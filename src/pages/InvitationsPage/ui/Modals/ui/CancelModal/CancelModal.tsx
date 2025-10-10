import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/Button/Button.tsx";
import { CenterModal } from "@/shared/ui/Modal/CenterModal/CenterModal.tsx";

import styles from "./CancelModal.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    cbModal: () => void;
};

export const CancelModal = ({ isOpen, onClose, cbModal }: TProps) => {
    const { t } = useTranslation();
    const handleAction = () => {
        cbModal();
    };

    return (
        <CenterModal
            isOpen={isOpen}
            onClose={onClose}
            closeIcon
        >
            <div className={styles.cancelInvitation}>
                <h2>{t("my_guests:modals:booking_guests:cancel_title")}</h2>
                <p>
                    {t("my_guests:modals:booking_guests:cancel_text")}
                </p>
                <div className={styles.actions}>
                    <Button
                        style="primary"
                        onClick={onClose}
                    >
                        {t("my_guests:buttons:back")}
                    </Button>
                    <Button
                        style="yellow"
                        onClick={handleAction}
                    >
                        {t("my_guests:buttons:yes_cancel")}
                    </Button>
                </div>
            </div>
        </CenterModal>
    );
};
