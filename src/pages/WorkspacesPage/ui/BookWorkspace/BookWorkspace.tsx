import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { Desktop, OfficeData } from "@/entities/offices/types.ts";

import type { DateTimeFilter } from "@/shared/hooks/useFormattedDateTimeFilter.ts";
import { Button } from "@/shared/ui/Button/Button.tsx";
import { DateTimeRangePicker } from "@/shared/ui/DateTimeRangePicker/DateTimeRangePicker.tsx";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import styles from "./BookWorkspace.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    desktop: Desktop | undefined;
    datesFilter: DateTimeFilter;
    office: OfficeData | null;
    cb: (data: any) => void;
};

export const BookWorkspace = ({ isOpen, onClose, desktop, datesFilter, cb }: TProps) => {
    const { t } = useTranslation();
    const { datetime_start, datetime_end } = datesFilter;

    const [selectedDate, setSelecetedDate] = useState<{ datetime_start: Date | string; datetime_end: Date | string }>({
        datetime_start: new Date(datetime_start).toISOString(),
        datetime_end: new Date(datetime_end).toISOString(),
    });

    const handleAction = useCallback(() => {
        cb({ ...desktop, ...selectedDate, type: "confirmBook" });
    }, [desktop, selectedDate]);

    useEffect(() => {
        setSelecetedDate({
            datetime_start: new Date(datetime_start).toISOString(),
            datetime_end: new Date(datetime_end).toISOString(),
        });
    }, [desktop]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.bookWorkspaceModal}
            height="35%"
            closeIcon
        >
            <div className={styles.bookWorkspaceModal__container}>
                <h2>{t("modals:book_working_place:title", { workplace: desktop?.title })}</h2>
                <DateTimeRangePicker
                    value={selectedDate}
                    cb={setSelecetedDate}
                />
                <Button
                    style="dark-green"
                    onClick={handleAction}
                    className={styles.bookWorkspaceModal__button}
                >
                    {t("common:buttons:book")}
                </Button>
            </div>
        </BottomModal>
    );
};
