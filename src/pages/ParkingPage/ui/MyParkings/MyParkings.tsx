import type { TReservationItem } from "@/features/booking/types/reservations.ts";
import { ParkingItem } from "@/features/booking/ui/ParkingItem/ParkingItem.tsx";

import type { Parking } from "@/entities/offices/types.ts";

import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import styles from "./MyParkings.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    reservations: TReservationItem | undefined;
    historyReservations: TReservationItem | undefined;
    freeParkings: Record<string, Parking[]> | undefined;
    cbModal: (value: Parking) => void;
    setOpenBook: (value: Parking) => void;
};

export const MyParkings = ({
    isOpen,
    onClose,
    reservations,
    historyReservations,
    freeParkings,
    cbModal,
    setOpenBook,
}: TProps) => {
    const handleClick = (value: Parking) => setOpenBook(value);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.myParkingsModal}
            height="95%"
            closeIcon
        >
            <div className={styles.container}>
                <span className={styles.freeParkings__title}>Свободные парковки</span>
                {!!freeParkings && Object.keys(freeParkings).length ? (
                    <div className={styles.freeParkings__wrapper}>
                        {Object.entries(freeParkings).map((groupParking) => (
                            <div
                                key={groupParking[0]}
                                className={styles.freeParkings__group}
                            >
                                <span className={styles.freeParkings__group_title}>{groupParking[0]}:</span>
                                <div className={styles.freeParkings__items}>
                                    {!!groupParking[1].length &&
                                        groupParking[1].map((elParking) => (
                                            <button
                                                onClick={() => handleClick(elParking)}
                                                key={`${groupParking[0]}-${elParking.title}`}
                                                className={styles.freeParkings__item}
                                            >
                                                {elParking.title}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className={styles.freeParkings__emptyMessage}>Нет свободных парковок</span>
                )}
                <div className={styles.myParkings}>
                    <span className={styles.myParkings__title}>Мои бронирования</span>
                    <div className={styles.myParkings__items}>
                        {reservations && (reservations as any).results && (reservations as any).results.length > 0 ? (
                            (reservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <ParkingItem
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                        cb={cbModal}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myParkings__emptyMessage}>У вас нет забронированных парковок</span>
                        )}
                    </div>
                </div>

                <div className={styles.myParkings}>
                    <span className={styles.myParkings__title}>История бронирования</span>
                    <div className={styles.myParkings__items}>
                        {historyReservations &&
                        (historyReservations as any).results &&
                        (historyReservations as any).results.length > 0 ? (
                            (historyReservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <ParkingItem
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myParkings__emptyMessage}>У вас нет забронированных парковок</span>
                        )}
                    </div>
                </div>
            </div>
        </BottomModal>
    );
};
