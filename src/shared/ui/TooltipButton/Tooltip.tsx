import { Tooltip } from "antd";
import { useMemo, useState } from "react";

import type { TooltipProps } from "antd";
import type { ReactNode } from "react";

type TProps = {
    children: ReactNode;
    placement?: "top" | "bottom";
    title: string;
    visible: boolean;
};

export const TooltipButton = ({ children, placement, title, visible }: TProps) => {
    const [arrow, setArrow] = useState<"Show" | "Hide" | "Center">("Show");
    const [open, setOpen] = useState(false);

    const mergedArrow = useMemo<TooltipProps["arrow"]>(() => {
        if (arrow === "Hide") {
            return false;
        }

        if (arrow === "Show") {
            return true;
        }

        return {
            pointAtCenter: true,
        };
    }, [arrow]);

    const handleChange = () => {
        if (visible) setOpen((prev) => !prev);
    };

    return (
        <Tooltip
            placement={placement}
            title={title}
            arrow={mergedArrow}
            open={open}
            onOpenChange={handleChange}
        >
            {children}
        </Tooltip>
    );
};
