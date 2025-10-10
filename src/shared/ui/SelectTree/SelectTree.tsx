import { Select, theme } from "antd";

import { useTheme } from "@/app/providers/ThemeProvider.tsx";

import type { TSelectTreeNodeExtended } from "@/entities/offices/hooks/useOfficeFilters.ts";

import ArrowDownIcon from "@/shared/icons/ArrowDownIcon.svg?react";

const { useToken } = theme;

type TProps = {
    options: TSelectTreeNodeExtended[];
    value?: string;
    onSelect?: (selected: TSelectTreeNodeExtended) => void;
};

export const SelectTree = ({ options, value, onSelect }: TProps) => {
    if (!options || !Array.isArray(options)) return null;

    const { theme } = useTheme();

    return (
        <Select
            value={value}
            onChange={(selectedObj) => {
                const selectedOption = options.find((opt) => opt.workspace_id === +selectedObj);
                if (selectedOption && onSelect) {
                    onSelect(selectedOption);
                }
            }}
            style={{
                width: "100%",
                border: "none",
                marginBottom: 16,
            }}
            placeholder="Офис"
            options={options.map(({ title, isGroup, workspace_id, level }) => ({
                label: title,
                value: workspace_id?.toString(),
                disabled: isGroup,
                style: {
                    paddingLeft: 24 * level,
                },
                key: workspace_id?.toString(),
            }))}
            dropdownStyle={{
                padding: "8px 24px",
            }}
            suffixIcon={<ArrowDownIcon />}
        />
    );
};
