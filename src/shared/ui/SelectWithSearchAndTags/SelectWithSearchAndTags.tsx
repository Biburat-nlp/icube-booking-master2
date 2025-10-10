import { Select } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

const { Option } = Select;

type TProps = {
    values: Array<{ id: number; name: string }>;
    placeholder?: string;
    selected: Array<number>;
    setSelected: (id: number) => void;
};

export const SelectWithSearchAndTags = ({
    values,
    placeholder,
    selected,
    setSelected,
}: TProps) => {
    const { t } = useTranslation();
    const handleChange = (value: any) => {
        setSelected(value);
    };

    return (
        <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={placeholder || t("profile:placeholders:invited_users")}
            onChange={handleChange}
            value={selected}
            filterOption={(input, option) => String(option?.children).toLowerCase().indexOf(input.toLowerCase()) >= 0}
            autoClearSearchValue
            showSearch
        >
            {values.map((user) => (
                <Option
                    key={user.id}
                    value={user.id}
                >
                    {user.name}
                </Option>
            ))}
        </Select>
    );
};
