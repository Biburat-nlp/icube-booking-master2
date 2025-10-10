import { isBefore } from "date-fns";
import React, { useEffect, useState } from "react";

import type { TSelectedReservation } from "@/features/booking/types/reservations.ts";

import { Button } from "@/shared/ui/Button/Button.tsx";
import { DateTimeRangePicker } from "@/shared/ui/DateTimeRangePicker/DateTimeRangePicker.tsx";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import styles from "./UpdateModal.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    modalProps?: { [key: string]: string | number };
    cbModal: (arg: any) => void;
    reservationData?: TSelectedReservation;
};

export const UpdateModal = ({ isOpen, onClose, modalProps, cbModal, reservationData }: TProps) => {
    if (!reservationData) return null;

    const { target_title, reserve_end, reserve_start } = reservationData;
    const title =
        modalProps?.moduleType === "lockers"
            ? `Забронировать шкаф ${target_title}`
            : `Забронировать рабочее место ${target_title}`;

    const [selectedDate, setSelecetedDate] = useState<{ datetime_start: Date | string; datetime_end: Date | string }>({
        datetime_start: new Date(reserve_start).toISOString(),
        datetime_end: new Date(reserve_end).toISOString(),
    });

    const handleClose = () => {
        onClose(false);
    };

    const handleAction = () => {
        cbModal(selectedDate);
        handleClose();
    };

    useEffect(() => {
        setSelecetedDate({
            datetime_start: new Date(reserve_start).toISOString(),
            datetime_end: new Date(reserve_end).toISOString(),
        });
    }, [reservationData]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={handleClose}
            className={styles.updateModal}
            height="35%"
            closeIcon
        >
            <div className={styles.updateModal__container}>
                <h2>{title}</h2>
                <DateTimeRangePicker
                    value={selectedDate}
                    disabledStartDate={isBefore(new Date(reserve_start), new Date())}
                    cb={setSelecetedDate}
                />
                <Button
                    style="dark-green"
                    onClick={handleAction}
                    className={styles.updateModal__button}
                >
                    Забронировать
                </Button>
            </div>
        </BottomModal>
    );
};
