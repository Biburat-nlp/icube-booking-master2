import { IonInput } from "@ionic/react";
import clsx from "clsx";
import { addYears, parseISO, format, isAfter, addDays, isBefore, subDays } from "date-fns";
import React, { useEffect, useState } from "react";

import styles from "./DateRangePicker.module.scss";

type Props = {
    value: {
        datetime_start: Date | string;
        datetime_end: Date | string;
    };
    disabledStartDate?: boolean;
    cb?: (arg: any) => void;
};

export const DateTimeRangePicker = ({ value, disabledStartDate = false, cb }: Props) => {
    const now = new Date();
    const oneYearAhead = addYears(now, 1);
    const minDate = format(now, "yyyy-MM-dd'T'HH:mm");
    const maxDate = format(oneYearAhead, "yyyy-MM-dd'T'HH:mm");

    const { datetime_start, datetime_end } = value;

    const [formattedStartTimeValue, setFormattedStartTimeValue] = useState(
        datetime_start ? format(datetime_start, "yyyy-MM-dd'T'HH:mm") : ""
    );
    const [formattedEndTimeValue, setFormattedEndTimeValue] = useState(
        datetime_end ? format(datetime_end, "yyyy-MM-dd'T'HH:mm") : ""
    );

    const handleStartChange = (e: CustomEvent) => {
        const newStart = parseISO(e.detail.value);

        setFormattedStartTimeValue(format(newStart, "yyyy-MM-dd'T'HH:mm"));
        cb && cb({ ...value, datetime_start: newStart.toISOString() });
    };

    const handleEndChange = (e: CustomEvent) => {
        const newEnd = parseISO(e.detail.value);

        setFormattedEndTimeValue(format(newEnd, "yyyy-MM-dd'T'HH:mm"));
        cb && cb({ ...value, datetime_end: newEnd.toISOString() });
    };

    useEffect(() => {
        if (isAfter(formattedStartTimeValue, formattedEndTimeValue)) {
            const newDate = addDays(formattedStartTimeValue, 1).toISOString();

            setFormattedEndTimeValue(format(newDate, "yyyy-MM-dd'T'HH:mm"));
            cb && cb({ ...value, datetime_end: newDate });
        } else if (isBefore(formattedEndTimeValue, formattedStartTimeValue)) {
            const newDate = subDays(formattedStartTimeValue, 1);
            const checkDate = newDate > parseISO(minDate) ? format(newDate, "yyyy-MM-dd'T'HH:mm") : minDate;

            setFormattedEndTimeValue(checkDate);
            cb && cb({ ...value, datetime_end: parseISO(checkDate).toISOString() });
        }
    }, [formattedStartTimeValue, formattedEndTimeValue]);

    return (
        <div className={styles.container}>
            <div className={clsx(styles.inputContainer, { [styles.inputContainer__disabled]: disabledStartDate })}>
                <IonInput
                    type="datetime-local"
                    onIonInput={handleStartChange}
                    disabled={disabledStartDate}
                    className={clsx({ [styles.buttonDisabled]: disabledStartDate })}
                    min={minDate}
                    max={maxDate}
                    value={formattedStartTimeValue}
                    placeholder={datetime_start ? format(datetime_start, "yyyy-MM-dd'T'HH:mm") : minDate}
                />
            </div>
            <div className={styles.inputContainer}>
                <IonInput
                    type="datetime-local"
                    onIonInput={handleEndChange}
                    min={minDate}
                    max={maxDate}
                    value={formattedEndTimeValue}
                    placeholder={datetime_end ? format(datetime_end, "yyyy-MM-dd'T'HH:mm") : maxDate}
                    className={styles.input}
                />
            </div>
        </div>
    );
};
