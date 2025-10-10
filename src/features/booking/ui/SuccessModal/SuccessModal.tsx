import { format, isAfter, isBefore, parseISO } from "date-fns";
import React from "react";
import { useTranslation } from "react-i18next";

import type { Cell } from "@/features/booking/api/lockers.ts";
import type { AnyReservation } from "@/features/booking/types/reservations.ts";
import { fnsLocale } from "@/features/date/date-fns.ts";

import type { MeetingRoom, OfficeData } from "@/entities/offices/types.ts";

import { Button } from "@/shared/ui/Button/Button.tsx";
import { CenterModal } from "@/shared/ui/Modal/CenterModal/CenterModal.tsx";
import { formatTimeDuration } from "@/shared/utils/date/dateUtils.ts";

import styles from "./SuccessModal.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    title: string;
    cbModals: (arg: any) => void;
    reservationData: {
        office: OfficeData | null;
        currentLockerTitle?: string;
        datesFilter: any;
        currentCell?: Cell | undefined;
        currentReservation?: AnyReservation | MeetingRoom | undefined;
    };
};
export const SuccessModal = ({ isOpen, onClose, title, cbModals, reservationData }: TProps) => {
    const { t } = useTranslation();

    const startDate = new Date(reservationData.datesFilter.datetime_start);
    const endDate = new Date(reservationData.datesFilter.datetime_end);
    const isActive = isBefore(startDate, new Date()) && isAfter(endDate, new Date());

    const formatIsoWithOffset = function (isoDateStr: string) {
        const date = parseISO(isoDateStr);

        return format(date, "yyyy-MM-dd'T'HH:mm:ssxxx");
    };

    const currentDuration = isActive
        ? `${t("common:left")}:${" "}
    ${formatTimeDuration(
        {
            start: Date.now(),
            end: formatIsoWithOffset(reservationData.datesFilter?.datetime_end),
        },
        fnsLocale,
        "minutes"
    )}`
        : `${t("common:before_start")}:${" "}
     ${formatTimeDuration({ start: Date.now(), end: reservationData.datesFilter?.datetime_start }, fnsLocale, "minutes")}
    `;

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
            closeIcon
        >
            <div className={styles.successBook}>
                <h2>{title}</h2>
                {reservationData.datesFilter && <p>{currentDuration}</p>}
                <Button
                    style="dark-green"
                    onClick={() => handleAction("successBook")}
                    className={styles.button}
                >
                    {t("common:buttons:ok")}
                </Button>
            </div>
        </CenterModal>
    );
};
