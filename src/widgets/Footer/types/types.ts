import type ReactComponent from "*.svg?react";

export type TModalTypes = "reservation" | "navigation";

export type TFooterTabItems = {
    path: string;
    label: string;
    Icon: typeof ReactComponent;
    action: (history: any) => void;
}[];
