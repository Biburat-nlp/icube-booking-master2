import React from "react";

import MinusIcon from "@/shared/icons/MinusIcon.svg?react";
import PlusIcon from "@/shared/icons/PlusIcon.svg?react";

import s from "./NavigationControls.module.scss";

interface Props {
    onZoomIn: () => void;
    onZoomOut: () => void;
}

export const NavigationControls = ({ onZoomIn, onZoomOut }: Props) => (
    <div className={s.controls}>
        <button
            type="button"
            onClick={onZoomIn}
            className={s.button}
        >
            <PlusIcon className={s.icon} />
        </button>
        <button
            type="button"
            onClick={onZoomOut}
            className={s.button}
        >
            <MinusIcon className={s.icon} />
        </button>
    </div>
);
