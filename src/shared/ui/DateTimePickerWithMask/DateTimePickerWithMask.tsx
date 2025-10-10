import { IonButton, IonInput } from "@ionic/react";
import { format } from "date-fns";
import React, { useRef, useState, useEffect } from "react";

import { fnsFormats, fnsLocale } from "@/features/date/date-fns.ts";

import CalendarIcon from "@/shared/icons/CalendarIcon.svg?react";
import TimeIcon from "@/shared/icons/TimeIcon.svg?react";

import styles from "./DateTimePickerWithMask.module.scss";

type TProps = {
    initialDate: Date | string;
    onChange: (value: string) => void;
};

export const DateTimePickerWithMask = ({ initialDate, onChange }: TProps) => {
    const initDate = typeof initialDate === "string" ? new Date(initialDate) : initialDate;
    const initialIso = format(initDate, "yyyy-MM-dd'T'HH:mm");

    const [selectedDate, setSelectedDate] = useState(
        format(initDate, fnsFormats.wideDateFormat, { locale: fnsLocale })
    );
    const [selectedTime, setSelectedTime] = useState(format(initDate, fnsFormats.timeFormat, { locale: fnsLocale }));

    const hiddenInputRef = useRef<HTMLIonInputElement>(null);

    useEffect(() => {
        let nativeInput: HTMLInputElement;

        const setup = async () => {
            if (!hiddenInputRef.current) return;
            nativeInput = await hiddenInputRef.current.getInputElement();
            const handler = () => {
                const val = nativeInput.value;
                if (!val) return;
                const dt = new Date(val);
                setSelectedDate(format(dt, fnsFormats.wideDateFormat, { locale: fnsLocale }));
                setSelectedTime(format(dt, fnsFormats.timeFormat, { locale: fnsLocale }));
                onChange(val);
            };
            nativeInput.addEventListener("change", handler);
            nativeInput.addEventListener("input", handler);
        };

        setup();

        return () => {
            if (nativeInput) {
                nativeInput.removeEventListener("change", () => {});
                nativeInput.removeEventListener("input", () => {});
            }
        };
    }, [onChange]);

    const openDateTimePicker = async () => {
        if (!hiddenInputRef.current) return;
        const nativeInput = await hiddenInputRef.current.getInputElement();

        nativeInput.focus();
        if (typeof (nativeInput as any).showPicker === "function") {
            (nativeInput as any).showPicker();
        } else {
            nativeInput.click();
        }
    };

    return (
        <div className={styles.datetimeInputWithMask}>
            <IonButton
                onClick={openDateTimePicker}
                className={styles.maskButton}
                expand="block"
            >
                <div className={styles.dateInfo}>
                    <CalendarIcon />
                    <span>{selectedDate}</span>
                </div>
                <div className={styles.dateInfo}>
                    <TimeIcon />
                    <span>{selectedTime}</span>
                </div>
            </IonButton>
            <IonInput
                ref={hiddenInputRef}
                type="datetime-local"
                className={styles.hiddenDatetimeInput}
                onIonChange={(e: any) => onChange(e.detail.value)}
                value={initialIso}
            />
        </div>
    );
};
