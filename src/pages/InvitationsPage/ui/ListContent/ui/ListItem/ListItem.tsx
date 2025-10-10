import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import type { TInvitations } from "@/features/invitations/types/invitations.ts";

import EditIcon from "@/shared/icons/EditIcon.svg?react";
import TrashIcon from "@/shared/icons/TrashIcon.svg?react";
import { formatWords } from "@/shared/utils/text/formatWords.ts";

import styles from "./ListItem.module.scss";

type TProps = {
    item: TInvitations;
    update: (values: TInvitations) => void;
    remove: (values: TInvitations) => void;
};

export const ListItem = ({ item, update, remove }: TProps) => {
    const { t, i18n } = useTranslation();
    if (!item) return null;

    const { id, guests, office_title, visit_start, visit_end, visit_user } = item;

    const date = format(visit_start, "dd.MM.yyyy, EEEE", { locale: i18n.language === "ru" ? ru : undefined });
    const visitUserFormatted = visit_user ? `${visit_user.first_name} ${visit_user.last_name}` : "";

    const amountPeople = formatWords(guests.length, [
        t("invitations_page:person"),
        t("invitations_page:people_2_4"),
        t("invitations_page:people_5_plus"),
    ]);

    return (
        <div className={styles.listItem}>
            <span className={styles.listItem__date}>{date}</span>
            <div className={styles.listItem__info}>
                <div className={styles.listItem__user}>
                    <span>{office_title}</span>
                    <span>{t("invitations_page:visiting_to", { name: visitUserFormatted })}</span>
                </div>
                <span className={styles.listItem__amount}>{amountPeople}</span>
            </div>
            <div className={styles.actions}>
                <button
                    type="button"
                    onClick={() => update(item)}
                >
                    <EditIcon className={styles.updateIcon} />
                </button>
                <button
                    className={styles.deleteButton}
                    onClick={() => remove(item)}
                >
                    <TrashIcon className={styles.trashIcon} />
                </button>
            </div>
        </div>
    );
};
