import React, { useState, useEffect } from "react";
import { IonButton, IonInput, IonItem, IonLabel, IonModal, IonText, IonIcon, IonSpinner } from "@ionic/react";
import { checkmark, close, refresh, server } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import { useServerConfig } from "@/shared/hooks/useServerConfig.ts";
import { updateApiBaseUrl } from "@/shared/api/api.ts";
import { useAuth } from "@/app/providers/AuthProvider.tsx";
import { serverConfigManager } from "@/shared/config/serverConfig.ts";
import { useServerConfigContext } from "@/app/providers/ServerConfigProvider.tsx";
import styles from "./ServerConfigModal.module.scss";

interface ServerConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ServerConfigModal: React.FC<ServerConfigModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const { config, isLoading, error, updateConfig, resetToDefault, validateUrl, formatUrl, isDefaultUrl } = useServerConfig();
    const { refreshConfig } = useServerConfigContext();
    const { user, logout } = useAuth();
    const [serverUrl, setServerUrl] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (config && isOpen) {
            setServerUrl(config.baseUrl);
            setValidationError(null);
        }
    }, [config, isOpen]);

    const handleSave = async () => {
        if (!serverUrl.trim()) {
            setValidationError(t("server_config:errors:empty_address"));
            return;
        }

        if (!validateUrl(serverUrl)) {
            setValidationError(t("server_config:errors:invalid_url"));
            return;
        }

        try {
            setIsSaving(true);
            setValidationError(null);
            
            const formattedUrl = formatUrl(serverUrl);
            // Store domain only; API base will be derived
            // Проверяем, является ли введенный URL стандартным
            const isDefault = isDefaultUrl(formattedUrl);
            
            const newConfig = {
                baseUrl: formattedUrl,
                isCustom: !isDefault, // Если это дефолтный URL, то isCustom = false
            };

            await updateConfig(newConfig);
            const apiBase = serverConfigManager.getApiBaseUrlFromDomain(formattedUrl);
            await updateApiBaseUrl(apiBase);
            
            // Обновляем глобальный контекст
            await refreshConfig();

            // If user is logged in, force logout after server change
            if (user) {
                try {
                    await logout();
                } catch (e) {
                }
            }
            
            onClose();
        } catch (err) {
            setValidationError(err instanceof Error ? err.message : t("server_config:errors:save_error"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async () => {
        try {
            setIsResetting(true);
            setValidationError(null);
            await resetToDefault();
            const defaultConfig = await serverConfigManager.getConfig();
            const apiBase = await serverConfigManager.getApiBaseUrl();
            await updateApiBaseUrl(apiBase);
            
            // Обновляем глобальный контекст
            await refreshConfig();

            if (user) {
                try {
                    await logout();
                } catch (e) {
                }
            }
            
            onClose();
        } catch (err) {
            setValidationError(err instanceof Error ? err.message : t("server_config:errors:reset_error"));
        } finally {
            setIsResetting(false);
        }
    };

    const handleClose = () => {
        if (config) {
            setServerUrl(config.baseUrl);
        }
        setValidationError(null);
        onClose();
    };

    if (isLoading) {
        return (
            <IonModal
                isOpen={isOpen}
                onDidDismiss={handleClose}
                breakpoints={[0, 0.9]}
                initialBreakpoint={0.9}
                handle={true}
                className={styles.sheetModal}
            >
                <div className={styles.modalContent}>
                    <div className={styles.loadingContainer}>
                        <IonSpinner name="crescent" />
                        <IonText>{t("server_config:loading")}</IonText>
                    </div>
                </div>
            </IonModal>
        );
    }

    return (
        <IonModal
            isOpen={isOpen}
            onDidDismiss={handleClose}
            breakpoints={[0, 0.9]}
            initialBreakpoint={0.9}
            handle={true}
            className={styles.sheetModal}
        >
            <div className={styles.modalContent}>
                <div className={styles.header}>
                    <IonIcon icon={server} className={styles.headerIcon} />
                    <h2>{t("server_config:title")}</h2>
                </div>

                <div className={styles.content}>
                    <IonItem className={styles.inputItem}>
                        <IonLabel position="stacked">{t("server_config:labels:server_address")}</IonLabel>
                        <IonInput
                            value={serverUrl}
                            onIonInput={(e) => setServerUrl(e.detail.value!)}
                            placeholder={t("server_config:placeholders:url_placeholder")}
                            type="url"
                            className={styles.urlInput}
                        />
                    </IonItem>

                    {config?.isCustom && (
                        <div className={styles.customIndicator}>
                            <IonText color="primary">
                                <small>{t("server_config:labels:custom_server_in_use")}</small>
                            </IonText>
                        </div>
                    )}

                    {(error || validationError) && (
                        <div className={styles.errorContainer}>
                            <IonText color="danger">
                                <small>{error || validationError}</small>
                            </IonText>
                        </div>
                    )}

                    <div className={styles.helpText}>
                        <IonText color="medium">
                            <small>
                                {t("server_config:labels:enter_full_url")}
                            </small>
                        </IonText>
                    </div>
                </div>

                <div className={styles.footer}>
                    <IonButton
                        fill="outline"
                        onClick={handleReset}
                        disabled={isSaving || isResetting}
                        className={styles.resetButton}
                    >
                        {isResetting ? (
                            <IonSpinner name="crescent" />
                        ) : (
                            <IonIcon icon={refresh} slot="start" />
                        )}
                        {t("server_config:buttons:reset")}
                    </IonButton>

                    <div className={styles.actionButtons}>
                        <IonButton
                            fill="outline"
                            onClick={handleClose}
                            disabled={isSaving || isResetting}
                        >
                            <IonIcon icon={close} slot="start" />
                            {t("common:buttons:cancel")}
                        </IonButton>

                        <IonButton
                            onClick={handleSave}
                            disabled={isSaving || isResetting}
                            className={styles.saveButton}
                        >
                            {isSaving ? (
                                <IonSpinner name="crescent" />
                            ) : (
                                <IonIcon icon={checkmark} slot="start" />
                            )}
                            {t("common:buttons:save")}
                        </IonButton>
                    </div>
                </div>
            </div>
        </IonModal>
    );
};
