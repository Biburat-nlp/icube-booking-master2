import clsx from "clsx";
import { useEffect, useState } from "react";

import type { TCurrentReservationsData } from "@/pages/LockersPage/types.ts";

import type { Cell } from "@/features/booking/api/lockers.ts";
import type { TReservationItem } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types.ts";

import LockIcon from "@/shared/icons/LockIcon.svg?react";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import styles from "./BookCells.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    cells: Cell[] | undefined;
    reservations: TCurrentReservationsData | undefined;
    usage: Usage | undefined;
    onSelectLocker: (arg: any) => void;
    currentLockerTitle: string;
    userId?: number;
};

export const BookCells = ({
    isOpen,
    onClose,
    cells,
    reservations,
    usage,
    onSelectLocker,
    currentLockerTitle,
    userId,
}: TProps) => {
    if (!userId) return null;

    const [myUsage, setMyUsage] = useState<number[]>([]);
    const [anotherUsage, setAnotherUsage] = useState<Number[]>([]);

    const handleSelectLocker = (id: number) => {
        if (!!usage?.reserved_ids && usage?.reserved_ids.includes(id)) return;

        onSelectLocker({ id, type: "confirmBook" });
    };

    useEffect(() => {
        if (usage?.reserved_ids && reservations?.current && userId) {
            const currentResults = reservations.current as TReservationItem;

            const myReserved = currentResults.results
                .filter(({ reserved_by_user }) => reserved_by_user.id === userId)
                .map(({ target_id }) => target_id)
                .filter((id) => usage.reserved_ids.includes(id));

            const othersReserved = usage.reserved_ids.filter((id) => !myReserved.includes(id as number));

            setMyUsage(myReserved);
            setAnotherUsage(othersReserved);
        }
    }, [usage, reservations, userId]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.bookCells}
            height="75%"
            closeIcon
        >
            <div className={styles.bookCells__container}>
                <span className={styles.bookCells__title}>Модуль {currentLockerTitle}</span>
                <div className={styles.bookCells__items}>
                    {cells?.length ? (
                        cells.map(({ id, cell_number }) => (
                            <button
                                onClick={() => handleSelectLocker(id)}
                                key={cell_number}
                                className={clsx(styles.bookCells__item, {
                                    [styles.bookCells__item_blue]: myUsage.includes(id),
                                    [styles.bookCells__item_red]: anotherUsage.includes(id) && !myUsage.includes(id),
                                })}
                            >
                                <LockIcon className={styles.bookCells__icon} />
                                <span className={styles.bookCells__number}>{cell_number}</span>
                            </button>
                        ))
                    ) : (
                        <span className={styles.bookCells__emptyMessage}>Нет свободных ячеек</span>
                    )}
                </div>
            </div>
        </BottomModal>
    );
};
