import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { getNavigationsItems, getReservationItems } from "@/widgets/Footer/constants/constants.ts";

import styles from "./FooterModalContent.module.scss";

import type { TModalTypes } from "@/widgets/Footer/types/types.ts";

type TProps = {
    currentPath: string;
    currentMode: TModalTypes;
    closeModal: () => void;
};

export const FooterModalContent = ({ currentPath, currentMode, closeModal }: TProps) => {
    const history = useHistory();
    const { t } = useTranslation();

    const items = currentMode === "reservation" ? getReservationItems() : getNavigationsItems();

    return (
        <>
            {items.map(({ path, label, Icon, action }) => (
                <button
                    key={label}
                    onClick={() => {
                        action(history);
                        closeModal();
                    }}
                    type="button"
                    className={clsx(styles.item, { [styles.isActive]: currentPath.startsWith(path) })}
                >
                    <Icon className={styles.icon} />
                    <span className={styles.label}>{t(label, { part: 1 })}</span>
                </button>
            ))}
        </>
    );
};
