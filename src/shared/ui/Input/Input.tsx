import { IonInput } from "@ionic/react";
import clsx from "clsx";
import React, { useState } from "react";

import styles from "./Input.module.scss";

export interface IProps {
    value?: string | null | undefined;
    onValueChange: (value: string) => void;
    errorText?: string;
    type?: "text" | "password";
    label?: string;
    labelPlacement?: "fixed" | "start" | "end" | "floating" | "stacked";
    fill?: string;
    clearInput?: boolean;
    className?: string;
    validator?: (value: string) => boolean | void;
    disabled?: boolean;
}

const ValidatedIonInput = ({
    value,
    onValueChange,
    errorText = "Обязательное поле",
    type = "text",
    label,
    labelPlacement = "floating",
    clearInput,
    className,
    validator,
    disabled,
}: IProps) => {
    const [isTouched, setIsTouched] = useState(false);
    const [isValid, setIsValid] = useState<boolean | void>(undefined);

    const handleIonInput = (e: any) => {
        const newValue = e.detail.value || "";

        if (validator) {
            setIsValid(validator(newValue));
        } else {
            setIsValid(newValue.trim() !== "");
        }

        onValueChange(newValue);
    };

    const handleIonBlur = () => {
        setIsTouched(true);
    };

    return (
        <div>
            <IonInput
                type={type}
                value={value}
                onIonInput={handleIonInput}
                onIonBlur={handleIonBlur}
                label={label}
                labelPlacement={labelPlacement}
                errorText={errorText}
                clearInput={clearInput}
                fill="solid"
                className={clsx(styles.input, className, {
                    "ion-invalid": isTouched && isValid === false,
                    "ion-touched": isTouched,
                })}
                disabled={disabled}
            />
        </div>
    );
};

export default ValidatedIonInput;
