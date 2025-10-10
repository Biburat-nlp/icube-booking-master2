import { useTranslation } from "react-i18next";

import type { TReservationItem } from "@/features/booking/types/reservations.ts";
import { LockerItem } from "@/features/booking/ui/LockerItem/LockerItem.tsx";

import { Button } from "@/shared/ui/Button/Button";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import styles from "./MyLockers.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    amountFreeLockers: number | undefined;
    reservations: TReservationItem | undefined;
    historyReservations: TReservationItem | undefined;
    handleShowLockers: () => void;
    currentLockerTitle: string;
    cb: (arg: any) => void;
    handleMapToggle: () => void;
};

export const MyLockers = ({
    isOpen,
    onClose,
    amountFreeLockers,
    reservations,
    historyReservations,
    handleShowLockers,
    currentLockerTitle,
    cb,
    handleMapToggle,
}: TProps) => {
    const { t } = useTranslation();

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.myLockersModal}
            height="95%"
            closeIcon
        >
            <div className={styles.container}>
                <span className={styles.title}>{t("lockers_page:lockers_overview:titles:free_lockers")}</span>
                <div className={styles.freeLockers}>
                    <span className={styles.freeLockers__title}>
                        {t("lockers_page:lockers_overview:labels:in_module", { name: currentLockerTitle })}
                    </span>
                    <button
                        type="button"
                        className={styles.freeLockers__amount}
                        onClick={handleShowLockers}
                    >
                        {amountFreeLockers} {t("lockers_page:lockers_overview:buttons:free_cells")}
                    </button>
                    <Button
                        onClick={handleMapToggle}
                        className={styles.freeLockers__button}
                        style="dark-green"
                    >
                        {t("lockers_page:lockers_overview:buttons:show_on_map")}
                    </Button>
                </div>
                <div className={styles.myLockers}>
                    <span className={styles.myLockers__title}>{t("my_booking:title")}</span>
                    <div className={styles.myLockers__items}>
                        {reservations && (reservations as any).results && (reservations as any).results.length > 0 ? (
                            (reservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <LockerItem
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                        cb={cb}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myLockers__emptyMessage}>{t("lockers_page:lockers_overview:labels:no_data")}</span>
                        )}
                    </div>
                </div>

                <div className={styles.myLockers}>
                    <span className={styles.myLockers__title}>{t("common:words:booking_history")}</span>
                    <div className={styles.myLockers__items}>
                        {historyReservations &&
                        (historyReservations as any).results &&
                        (historyReservations as any).results.length > 0 ? (
                            (historyReservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <LockerItem
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myLockers__emptyMessage}>{t("lockers_page:lockers_overview:labels:no_data")}</span>
                        )}
                    </div>
                </div>
            </div>
        </BottomModal>
    );
};
