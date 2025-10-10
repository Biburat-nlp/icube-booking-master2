import { IonModal } from "@ionic/react";
import clsx from "clsx";
import React, { type ReactNode } from "react";

import CloseIcon from "@/shared/icons/CloseIcon.svg?react";

import styles from "./CenterModal.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    children?: ReactNode;
    closeIcon?: boolean;
    className?: string;
};

export const CenterModal = ({ isOpen, onClose, closeIcon, className, children }: TProps) => {
    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            className={clsx(styles.modal, className)}
            animated
        >
            {closeIcon && (
                <button
                    type="button"
                    onClick={onClose}
                    className={styles.btn}
                >
                    <CloseIcon className={styles.icon} />
                </button>
            )}
            <div className={styles.contentWrapper}>{children}</div>
        </IonModal>
    );
};
