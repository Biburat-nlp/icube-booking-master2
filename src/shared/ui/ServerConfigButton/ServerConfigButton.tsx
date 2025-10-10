import React, { useState } from "react";
import { IonButton, IonIcon, IonText } from "@ionic/react";
import { server } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { ServerConfigModal } from "../ServerConfigModal/ServerConfigModal";
import { useServerConfig } from "@/shared/hooks/useServerConfig.ts";
import styles from "./ServerConfigButton.module.scss";

interface ServerConfigButtonProps {
    variant?: "icon" | "text" | "full";
    size?: "small" | "default" | "large";
    className?: string;
    label?: string;
}

export const ServerConfigButton: React.FC<ServerConfigButtonProps> = ({ 
    variant = "icon", 
    size = "default",
    className,
    label
}) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { config, isLoading, reload } = useServerConfig();

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = async () => {
        setIsModalOpen(false);
        // Обновляем конфигурацию после закрытия модалки
        await reload();
    };

    if (isLoading) {
        return null;
    }

    const isCustom = config?.isCustom;

    return (
        <>
            <IonButton
                fill="clear"
                size={size}
                onClick={handleOpenModal}
                className={`${styles.serverConfigButton} ${styles[variant]} ${label ? styles.withLabel : ""} ${className || ""}`}
                title={t("server_config:server_settings_title")}
            >
                {label && (
                    <IonText className={styles.label}>
                        {label}
                    </IonText>
                )}
                <IonIcon 
                    icon={server} 
                    className={`${styles.icon} ${isCustom ? styles.customIcon : ""}`}
                />
                {variant !== "icon" && !label && (
                    <IonText className={styles.buttonText}>
                        {variant === "full" ? t("server_config:title") : t("server_config:title")}
                    </IonText>
                )}
            </IonButton>

            <ServerConfigModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
            />
        </>
    );
};
