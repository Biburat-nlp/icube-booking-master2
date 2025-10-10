import clsx from "clsx";

import styles from "./Button.module.scss";

import type { HTMLProps } from "react";

type TProps = HTMLProps<HTMLButtonElement> & {
    type?: "button" | "submit";
    style?: "primary" | "dark-green" | "yellow";
    id?: string;
    disabled?: boolean;
};

export const Button = ({ type = "button", onClick, children, className, style = "primary", id, disabled }: TProps) => {
    return (
        <button
            id={id}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={clsx(
                styles.default,
                { [styles.primary]: style === "primary", [styles.dark_green]: style === "dark-green" },
                { [styles.yellow]: style === "yellow", [styles.yellow]: style === "yellow" },

                className
            )}
        >
            {children}
        </button>
    );
};
