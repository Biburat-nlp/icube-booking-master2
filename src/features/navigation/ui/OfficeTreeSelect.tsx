import { TreeSelect } from "antd";
import React, { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";

import type { OfficeData, WorkSpace } from "@/entities/offices/types.ts";

import ArrowDownIcon from "@/shared/icons/ArrowDownIcon.svg?react";

interface Props {
    data: OfficeData[];
    onWorkspaceChange: (ws: WorkSpace | null) => void;
    onFloorChange?: (floorId: number | null) => void;
}

export const OfficeTreeSelect: React.FC<Props> = ({ data, onWorkspaceChange, onFloorChange }) => {
    const { t } = useTranslation();
    const selectRef = useRef<any>(null);

    const wsMap = useMemo(() => {
        const m = new Map<number, WorkSpace>();
        data.forEach((o) => o.workspaces.forEach((ws) => m.set(ws.id, ws)));
        return m;
    }, [data]);

    const treeData = useMemo(
        () =>
            data.map((office) => ({
                title: office.title,
                value: `office-${office.id}`,
                key: `office-${office.id}`,
                disabled: true,
                children: office.floors.map((floor) => {
                    const wsForFloor = office.workspaces.filter((ws) => ws.floor_id === floor.id);
                    return {
                        title: floor.title,
                        value: `floor-${floor.id}`,
                        key: `floor-${floor.id}`,
                        children: wsForFloor.map((ws) => ({
                            title: ws.title,
                            value: ws.id.toString(),
                            key: ws.id.toString(),
                            isLeaf: true,
                        })),
                    };
                }),
            })),
        [data]
    );

    const handleChange = (value: string) => {
        if (/^\d+$/.test(value)) {
            const id = parseInt(value, 10);
            onWorkspaceChange(wsMap.get(id) || null);
            onFloorChange?.(null);
        } else if (value.startsWith("floor-")) {
            const floorId = parseInt(value.split("-")[1], 10);
            onWorkspaceChange(null);
            onFloorChange?.(floorId);
        }
    };

    return (
        <TreeSelect
            ref={selectRef}
            style={{ width: "100%", background: "transparent" }}
            placeholder={t("profile:placeholders:office")}
            treeDefaultExpandAll
            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
            treeData={treeData}
            onChange={handleChange}
            treeNodeLabelProp="title"
            labelInValue={false}
            suffixIcon={<ArrowDownIcon />}
            onDropdownVisibleChange={(open) => {
                if (!open) {
                    selectRef.current?.blur();
                }
            }}
        />
    );
};
