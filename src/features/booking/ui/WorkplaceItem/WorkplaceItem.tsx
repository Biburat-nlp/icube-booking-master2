import clsx from "clsx";
import { format, isAfter, isBefore, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import type { AnyReservation } from "@/features/booking/types/reservations.ts";
import { fnsLocale } from "@/features/date/date-fns.ts";

import EditIcon from "@/shared/icons/EditIcon.svg?react";
import TrashIcon from "@/shared/icons/TrashIcon.svg?react";
import { formatTimeDuration } from "@/shared/utils/date/dateUtils.ts";

import styles from "./WorkplaceItem.module.scss";

import type ReactComponent from "*.svg?react";

export const WorkplaceItems = ({
    id,
    target_id,
    reserve_start,
    reserve_end,
    target_title,
    workspace_title,
    Icon,
    cb,
}: AnyReservation & {
    Icon: typeof ReactComponent;
    cb: (arg: any) => void;
}) => {
    const { t } = useTranslation();

    const startDate = new Date(reserve_start);
    const endDate = new Date(reserve_end);
    const isActive = isBefore(startDate, new Date()) && isAfter(endDate, new Date());
    const isExpired = isBefore(endDate, new Date());

    const handleCancel = () => {
        cb({ id: target_id, reservationId: id, type: "cancelBook" });
    };

    const handleUpdate = () => {
        cb({ id: target_id, reservationId: id, type: "updateBook" });
    };

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <Icon className={styles.icon} />
                <div className={styles.title}>
                    <h3>{target_title}</h3>
                    <p>{workspace_title}</p>
                </div>
            </div>

            <div className={styles.timeSection}>
                {isSameDay(startDate, endDate) ? (
                    <div>
                        <span className={styles.startDate}>
                            {format(startDate, "dd.MM.yyyy, EEEE", { locale: ru })}
                        </span>
                        <br />
                        <span className={clsx(styles.endDate, { [styles.endDate__expired]: isExpired })}>
                            {format(startDate, "HH:mm")} - {format(endDate, "HH:mm")}
                        </span>
                    </div>
                ) : (
                    <div>
                        <span className={styles.startDate}>
                            {format(startDate, "dd.MM.yyyy, EEEE", { locale: ru })}
                        </span>
                        <br />
                        <span className={clsx(styles.endDate, { [styles.endDate__expired]: isExpired })}>
                            {format(endDate, "dd.MM.yyyy, EEEE", { locale: ru })}
                        </span>
                    </div>
                )}
            </div>

            <div className={styles.durationSection}>
                {isActive ? (
                    <>
                        <span className={styles.durationLabel}>{t("common:left")}:</span>
                        <span className={styles.durationTime}>
                            {formatTimeDuration({ start: reserve_start, end: reserve_end }, fnsLocale, "minutes")}
                        </span>
                    </>
                ) : (
                    isBefore(new Date(), endDate) && (
                        <>
                            <span className={styles.durationLabel}>{t("common:before_start")}:</span>
                            <span className={styles.durationTime}>
                                {formatTimeDuration({ start: Date.now(), end: reserve_start }, fnsLocale, "minutes")}
                            </span>
                        </>
                    )
                )}
            </div>

            {!isBefore(endDate, new Date()) && (
                <div className={styles.actions}>
                    <button
                        type="button"
                        onClick={handleUpdate}
                    >
                        <EditIcon className={styles.updateIcon} />
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={handleCancel}
                    >
                        <TrashIcon className={styles.trashIcon} />
                    </button>
                </div>
            )}
        </div>
    );
};
