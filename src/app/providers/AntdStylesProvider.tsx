import { ConfigProvider } from "antd";
import React from "react";

import type { ReactNode } from "react";

type TProps = {
    children: ReactNode;
    theme: "dark" | "light";
};

export const AntdStylesProvider = ({ children, theme }: TProps) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimaryBg: theme === "dark" ? "var(--icube-dark-grey)" : "#EAEAEA",
                    colorTextBase: theme === "dark" ? "#ffffff" : "var(--icube-light-grey)",
                    colorText: theme === "dark" ? "#ffffff" : "var(--icube-light-grey)",
                    fontFamily: "SuisseIntl",
                },
                components: {
                    Select: {
                        colorTextBase: theme === "dark" ? "#ffffff" : "var(--icube-dark-grey)",
                        colorText: theme === "dark" ? "#ffffff" : "var(--icube-dark-grey)",
                        selectorBg: theme === "dark" ? "#ffffff0a" : "#EAEAEA",
                        multipleSelectorBgDisabled: theme === "dark" ? "#ffffff0a" : "#EAEAEA",
                        colorBgElevated: theme === "dark" ? "var(--icube-dark-grey)" : "#EAEAEA",
                        controlItemBgActive: theme === "dark" ? "var(--icube-dark-grey)" : "var(--icube-light-grey)",
                        controlOutline: "transparent",
                        boxShadowSecondary: "1px 1px 5px 0px #00000040",
                        colorBorder: "transparent !important",
                        showArrowPaddingInlineEnd: 0,
                    },
                    TreeSelect: {
                        colorTextBase: theme === "dark" ? "#ffffff" : "var(--icube-dark-grey)",
                        colorText: theme === "dark" ? "#ffffff" : "var(--icube-dark-grey)",
                        colorBgElevated: theme === "dark" ? "var(--icube-dark-grey)" : "#EAEAEA",
                        controlItemBgActive: theme === "dark" ? "var(--icube-dark-grey)" : "var(--icube-light-grey)",
                        controlOutline: "transparent",
                        boxShadowSecondary: "1px 1px 5px 0px #00000040",
                        colorBorder: "transparent !important",
                    },
                    Tooltip: {
                        colorTextLightSolid: "var(--icube-dark-grey)",
                        colorBgSpotlight: "#ffffff",
                    },
                    Checkbox: {
                        colorBgContainer: "transparent",
                        fontSize: 12,
                    },
                },
            }}
        >
            {children}
        </ConfigProvider>
    );
};
