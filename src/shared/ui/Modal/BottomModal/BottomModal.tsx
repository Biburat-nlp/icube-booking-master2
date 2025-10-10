import { IonContent, IonModal } from "@ionic/react";
import clsx from "clsx";
import React from "react";

import CloseIcon from "@/shared/icons/CloseIcon.svg?react";

import styles from "./BottomModal.module.scss";

import type { ReactNode } from "react";

type BottomModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode | ((props: { closeModal: () => void }) => ReactNode);
    className?: string;
    closeIcon?: boolean;
    height: string;
};

export const BottomModal = ({ isOpen, onClose, children, className, closeIcon = false, height }: BottomModalProps) => {
    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={onClose}
            className={clsx(styles.modal, className)}
            style={{ "--height": height, "--max-height": height }}
        >
            <div className={styles.contentWrapper}>
                {closeIcon && (
                    <button
                        type="button"
                        onClick={onClose}
                        className={styles.btn}
                    >
                        <CloseIcon className={styles.icon} />
                    </button>
                )}
                <IonContent
                    className={styles.content}
                    style={{ "--background": "transparent" }}
                >
                    {typeof children === "function" ? children({ closeModal: onClose }) : children}
                </IonContent>
            </div>
        </IonModal>
    );
};
