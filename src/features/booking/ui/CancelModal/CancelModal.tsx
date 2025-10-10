import React from "react";
import { useTranslation } from "react-i18next";

import { Button } from "@/shared/ui/Button/Button.tsx";
import { CenterModal } from "@/shared/ui/Modal/CenterModal/CenterModal.tsx";

import styles from "./CancelModal.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: (isOpen: boolean) => void;
    cbModal: (arg: any) => void;
};

export const CancelModal = ({ isOpen, onClose, cbModal }: TProps) => {
    const { t } = useTranslation();
    
    const handleClose = () => {
        onClose(false);
    };

    const handleAction = (arg: any) => {
        cbModal(arg);
        handleClose();
    };

    return (
        <CenterModal
            isOpen={isOpen}
            onClose={handleClose}
            closeIcon
        >
            <div className={styles.cancelBook}>
                <h2>{t("common:dialogs:confirm_delete:title")}</h2>
                <div className={styles.actions}>
                    <Button
                        style="primary"
                        onClick={handleClose}
                    >
                        {t("common:buttons:back")}
                    </Button>
                    <Button
                        style="yellow"
                        onClick={() => handleAction("cancelBook")}
                    >
                        {t("common:buttons:yes_cancel")}
                    </Button>
                </div>
            </div>
        </CenterModal>
    );
};
