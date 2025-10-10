import CarIcon from "@/shared/icons/CarIcon.svg?react";
import EditIcon from "@/shared/icons/EditIcon.svg?react";
import TrashIcon from "@/shared/icons/TrashIcon.svg?react";
import type { TGuest } from "@/shared/types/guest.ts";

import styles from "./GuestCard.module.scss";

type TProps = {
    guest: TGuest;
    removeGuest: (id: number | undefined, firstName: string | null) => void;
    openGuest: (guest: TGuest) => void;
};

export const GuestCard = ({ guest, removeGuest, openGuest }: TProps) => {
    const { id, first_name, last_name, email, organization, vehicle } = guest;
    const sliceFirstName = first_name ? `${first_name.slice(0, 1)}. ` : "";
    const lastName = last_name ? last_name : "";

    return (
        <div className={styles.guestCard}>
            <span className={styles.guestCard__name}>{sliceFirstName + lastName}</span>
            <div className={styles.guestCard__info}>
                <span>{email}</span>
                <span>{organization}</span>
            </div>
            {vehicle?.vehicle_number && vehicle?.vehicle_model && (
                <div className={styles.vehicle}>
                    <CarIcon />
                    <span>Парковка забронирована</span>
                </div>
            )}
            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={() => openGuest(guest)}
                >
                    <EditIcon className={styles.updateIcon} />
                </button>
                <button
                    className={styles.deleteButton}
                    onClick={() => removeGuest(id, first_name)}
                >
                    <TrashIcon className={styles.trashIcon} />
                </button>
            </div>
        </div>
    );
};
