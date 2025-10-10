import { useEffect, useMemo, useState } from "react";

import type { TSelectTreeNode } from "@/features/filters/types.ts";

import { useOfficesMutation } from "@/entities/offices/hooks/useOfficesMutation.ts";
import type { Floor, OfficeData, TOffice, WorkSpace } from "@/entities/offices/types.ts";

import { flattenTreeData } from "@/shared/ui/SelectTree/helpers.ts";

export type TSelectTreeNodeExtended = TSelectTreeNode & {
    type: "office" | "floor" | "space";
    office_id: number;
    floor_id?: number;
    workspace_id?: number;
    level: number;
    isGroup?: boolean;
    plan?: string;
};

type TParams = {
    limit: number;
    offset: number;
    office_id?: string | undefined;
    floor_id?: string | undefined;
    space_id?: string | undefined;
    datetime_start: string;
    datetime_end: string;
};

type TCallback = (data: OfficeData[]) => void;

export const useOfficeFilters = (
    params?: TParams,
    currentSpace?: string | undefined,
    cb?: TCallback,
    filterKey: TOffice = "lockers"
) => {
    const [data, setData] = useState<OfficeData[]>([]);
    const [currentOffice, setCurrentOffice] = useState<OfficeData | null>(null);
    const { mutate: fetchOffices } = useOfficesMutation(params, (cbData: OfficeData[]) => {
        setData(cbData);
        cb && cb(data);
    });

    const treeData = useMemo<TSelectTreeNodeExtended[]>(() => {
        if (!data) return [];

        const filteredData = data.map((office: OfficeData) => {
            const filteredFloors = office.floors.filter((floor: Floor) =>
                office[filterKey].some((el: any) => el.floor_id === floor.id)
            );

            const floorNodes: TSelectTreeNodeExtended[] = filteredFloors.map((floor: Floor) => {
                const workspaceNodes: TSelectTreeNodeExtended[] = office.workspaces
                    .filter(
                        (ws: WorkSpace) =>
                            ws.floor_id === floor.id &&
                            office[filterKey].some(
                                (locker: any) => locker.floor_id === floor.id && locker.work_space_id === ws.id
                            )
                    )
                    .map((ws: WorkSpace) => ({
                        title: ws.title,
                        level: 3,
                        isGroup: false,
                        type: "space",
                        office_id: office.id,
                        floor_id: floor.id,
                        workspace_id: ws.id,
                        plan: ws.plan,
                    }));

                return {
                    title: floor.title,
                    level: 2,
                    isGroup: true,
                    type: "floor",
                    office_id: office.id,
                    floor_id: floor.id,
                    children: workspaceNodes,
                };
            });

            return {
                title: office.title,
                level: 1,
                isGroup: true,
                type: "office",
                office_id: office.id,
                children: floorNodes,
            };
        });

        const flatOptions = flattenTreeData(filteredData) as TSelectTreeNodeExtended[];
        return flatOptions;
    }, [data]);

    useEffect(() => {
        fetchOffices();
    }, [currentSpace]);

    useEffect(() => {
        if (!!params?.office_id) {
            const current = data.find(({ id }) => params.office_id && id === +params.office_id);

            current && setCurrentOffice(current);
        }
    }, [currentSpace]);

    return { treeData, office: currentOffice, allOffices: data };
};
