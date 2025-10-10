import { Flex, Select } from "antd";
import React, { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/app/providers/ThemeProvider.tsx";

import { OfficeTreeSelect } from "@/features/navigation/ui/OfficeTreeSelect";

import type { WorkSpace } from "@/entities/offices/types.ts";

import ArrowDownIcon from "@/shared/icons/ArrowDownIcon.svg?react";

interface Props {
    offices: any[];
    selectedWorkspace: any;
    onWorkspaceChange: (ws: any) => void;
    users: any[];
    activeUser: number | null;
    onUserChange: (id: number) => void;
    roomOptions: { value: string; label: string }[];
    activeRoom?: string;
    onRoomChange: (val: string) => void;
    isRoomMode: boolean;
}

export const NavigationPageHeader = ({
    offices,
    onWorkspaceChange,
    users,
    activeUser,
    onUserChange,
    roomOptions,
    activeRoom,
    onRoomChange,
    isRoomMode,
}: Props) => {
    const { t } = useTranslation();
    const [officeSelected, setOfficeSelected] = useState<boolean>(false);

    const selectRef = useRef<any>(null);

    const { theme } = useTheme();

    const handleOfficeChange = useCallback(
        (val: WorkSpace | null) => {
            onWorkspaceChange(val);

            !officeSelected && setOfficeSelected(true);
        },
        [offices]
    );

    return (
        <Flex
            gap="24px"
            style={{
                flexDirection: "column",
                padding: 20,
                backgroundColor: theme === "dark" ? "var(--icube-dark-grey)" : "#ffffff",
            }}
        >
            <OfficeTreeSelect
                data={offices}
                onWorkspaceChange={handleOfficeChange}
            />

            {isRoomMode ? (
                <Select
                    ref={selectRef}
                    placeholder={t("navigation_page:placeholders:room")}
                    optionFilterProp="label"
                    options={roomOptions}
                    value={activeRoom}
                    onChange={onRoomChange}
                    disabled={!officeSelected}
                    suffixIcon={<ArrowDownIcon />}
                    onDropdownVisibleChange={(open) => {
                        if (!open) {
                            selectRef.current?.blur();
                        }
                    }}
                    showSearch
                />
            ) : (
                <Select
                    ref={selectRef}
                    placeholder={t("navigation_page:placeholders:employee")}
                    options={users.map((u) => ({ value: u.id, label: `${u.first_name} ${u.last_name}` }))}
                    optionFilterProp="label"
                    value={activeUser}
                    onChange={onUserChange}
                    disabled={!officeSelected}
                    suffixIcon={<ArrowDownIcon />}
                    onDropdownVisibleChange={(open) => {
                        if (!open) {
                            selectRef.current?.blur();
                        }
                    }}
                    showSearch
                />
            )}
        </Flex>
    );
};
