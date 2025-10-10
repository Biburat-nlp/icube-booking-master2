import { Select } from "antd";
import React, { useCallback } from "react";

import type { TReservationItem } from "@/features/booking/types/reservations.ts";
import { WorkplaceItems } from "@/features/booking/ui/WorkplaceItem/WorkplaceItem.tsx";

import type { Desktop } from "@/entities/offices/types.ts";

import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import styles from "./MyWorkspaces.module.scss";

const Option = Select;

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    reservations: TReservationItem | undefined;
    historyReservations: TReservationItem | undefined;
    freeDesktops: { [key: string]: Desktop[] } | undefined;
    cbModal: (value: Desktop) => void;
    setOpenBook: (value: Desktop) => void;
};

export const MyWorkspaces = ({
    isOpen,
    onClose,
    reservations,
    historyReservations,
    freeDesktops,
    cbModal,
    setOpenBook,
}: TProps) => {
    const handleChange = useCallback(
        (groupId: string, value: number) => {
            if (!freeDesktops?.[groupId]) return;

            const selectedValue = freeDesktops?.[groupId].find((el) => el.id === value);

            selectedValue && setOpenBook(selectedValue);
        },
        [freeDesktops]
    );

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.myWorkspacesModal}
            height="95%"
            closeIcon
        >
            <div className={styles.container}>
                <span className={styles.freeWorkspaces__title}>Свободные рабочие места</span>
                {!!freeDesktops && Object.keys(freeDesktops).length ? (
                    <div className={styles.freeWorkspaces__wrapper}>
                        {Object.entries(freeDesktops).map((groupDesktops) => (
                            <div
                                key={groupDesktops[0]}
                                className={styles.freeWorkspaces__group}
                            >
                                <span className={styles.freeWorkspaces__group_title}>{groupDesktops[0]}:</span>
                                <Select
                                    style={{ width: "50%" }}
                                    className={styles.freeWorkspaces__item}
                                    placeholder="Выберите"
                                    onSelect={(value) => handleChange(groupDesktops[0], value)}
                                >
                                    {!!groupDesktops[1].length &&
                                        groupDesktops[1].map((desktop) => (
                                            <Option
                                                key={`${groupDesktops[0]}-${desktop.title}`}
                                                value={desktop.id}
                                            >
                                                {desktop.title}
                                            </Option>
                                        ))}
                                </Select>
                            </div>
                        ))}
                    </div>
                ) : (
                    <span className={styles.freeWorkspaces__emptyMessage}>Нет свободных рабочих мест</span>
                )}
                <div className={styles.myWorkspaces}>
                    <span className={styles.myWorkspaces__title}>Мои бронирования</span>
                    <div className={styles.myWorkspaces__items}>
                        {reservations && (reservations as any).results && (reservations as any).results.length > 0 ? (
                            (reservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <WorkplaceItems
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                        cb={cbModal}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myWorkspaces__emptyMessage}>
                                У вас нет забронированных рабочих мест
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.myWorkspaces}>
                    <span className={styles.myWorkspaces__title}>История бронирования</span>
                    <div className={styles.myWorkspaces__items}>
                        {historyReservations &&
                        (historyReservations as any).results &&
                        (historyReservations as any).results.length > 0 ? (
                            (historyReservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <WorkplaceItems
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myWorkspaces__emptyMessage}>
                                У вас нет забронированных рабочих мест
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </BottomModal>
    );
};
