import { format } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import { useTranslation } from "react-i18next";

import type { Cell } from "@/features/booking/api/lockers.ts";

import type { OfficeData } from "@/entities/offices/types.ts";

import { Button } from "@/shared/ui/Button/Button.tsx";
import { CenterModal } from "@/shared/ui/Modal/CenterModal/CenterModal.tsx";

import styles from "./ConfirmModal.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    title: string;
    modalProps: { [key: string]: string | number | number[] };
    cbModals: (arg: any) => void;
    reservationData: {
        office: OfficeData | null;
        currentLockerTitle?: string;
        datesFilter: any;
        currentCell?: Cell | undefined;
        selectedFloor?: string;
    };
};

export const ConfirmModal = ({ isOpen, onClose, title, modalProps, cbModals, reservationData }: TProps) => {
    const { t } = useTranslation();
    
    const getOfficeInfo = () => {
        if (reservationData.office) {
            const office = reservationData.office && `${reservationData.office.title}`;
            const floor = reservationData.office?.floors.find(
                ({ id }) => Number(reservationData.selectedFloor) === id
            )?.title;
            const time = `${format(reservationData.datesFilter.datetime_start, "dd.MM.yyyy, HH:mm", { locale: ru })} - ${format(reservationData.datesFilter.datetime_end, "dd.MM.yyyy, HH:mm", { locale: ru })}`;

            return `${office}, ${floor}, ${time}`;
        }
    };

    const handleClose = () => {
        onClose(false);
    };

    const handleAction = (arg: any) => {
        cbModals(arg);
        handleClose();
    };

    return (
        <CenterModal
            isOpen={isOpen}
            onClose={handleClose}
            className={styles.modal__confirm}
            closeIcon
        >
            <div className={styles.confirmBook}>
                <h2>{title}</h2>
                <p>{getOfficeInfo()}</p>
                <div className={styles.actions}>
                    <Button
                        style="primary"
                        onClick={handleClose}
                    >
                        {t("common:buttons:cancel")}
                    </Button>
                    <Button
                        style="dark-green"
                        onClick={() => handleAction({ type: modalProps.type, id: modalProps.id })}
                    >
                        {t("common:buttons:ok")}
                    </Button>
                </div>
            </div>
        </CenterModal>
    );
};
