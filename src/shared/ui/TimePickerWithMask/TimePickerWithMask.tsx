import { IonButton, IonInput, isPlatform } from "@ionic/react";
import React, { useRef, useState } from "react";

import TimeIcon from "@/shared/icons/TimeIcon.svg?react";

import styles from "./TimePickerWithMask.module.scss";

type TProps = {
    initialTime: string;
    onChange: (value: string) => void;
};

export const TimePickerWithMask = ({ initialTime, onChange }: TProps) => {
    const [selectedTime, setSelectedTime] = useState(initialTime);

    const hiddenInputRef = useRef<HTMLIonInputElement>(null);

    const openTimePicker = () => {
        const ionInput = hiddenInputRef.current;
        if (!ionInput) return;

        const nativeInput = ionInput.querySelector("input");
        if (!nativeInput) return;

        if (isPlatform("ios")) {
            nativeInput.focus();

            nativeInput.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
            return;
        }

        if (typeof (nativeInput as any).showPicker === "function") {
            (nativeInput as any).showPicker();
            return;
        }

        nativeInput.click();
    };

    const handleChange = (val: string) => {
        if (!val) return;
        setSelectedTime(val);
        onChange(val);
    };

    return (
        <div className={styles.timeInputWithMask}>
            <IonButton
                onClick={openTimePicker}
                className={styles.maskButton}
                expand="block"
            >
                <TimeIcon />
                <span className={styles.timeText}>{selectedTime}</span>
            </IonButton>

            <IonInput
                ref={hiddenInputRef}
                type="time"
                className={styles.hiddenTimeInput}
                onIonChange={(e: any) => handleChange(e.detail.value)}
            />
        </div>
    );
};
