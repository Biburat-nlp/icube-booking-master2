import { IonContent, IonHeader, IonMenu, IonMenuToggle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider.tsx";
import { useTheme } from "@/app/providers/ThemeProvider.tsx";

import { useGetPinCode } from "@/entities/users/hooks/useUsers.ts";

import ArrowLeftIcon from "@/shared/icons/ArrowLeftIcon.svg?react";
import KeyIcon from "@/shared/icons/KeyIcon.svg?react";
import MoonIcon from "@/shared/icons/MoonIcon.svg?react";
import SunIcon from "@/shared/icons/SunIcon.svg?react";
import UserOneIcon from "@/shared/icons/UserOneIcon.svg?react";
import { Button } from "@/shared/ui/Button/Button.tsx";
import { CenterModal } from "@/shared/ui/Modal/CenterModal/CenterModal.tsx";

import styles from "./Sidebar.module.scss";

import type ReactComponent from "*.svg?react";

type TProfileMenuItems = {
    Icon: typeof ReactComponent;
    label: string;
    action: () => void;
};

export const Sidebar = () => {
    const [pinCode, setPinCode] = useState<string | null>(null);
    const [isLanguageExpanded, setIsLanguageExpanded] = useState(false);
    const history = useHistory();
    const { logout } = useAuth();

    const { t, i18n } = useTranslation();

    const { theme, toggleTheme } = useTheme();

    const { mutate: getPincode } = useGetPinCode((pin_code) => {
        setPinCode(pin_code);
    });

    const handleResetPincode = () => {
        setPinCode(null);
    };

    const handleLanguageChange = (langCode: string) => {
        i18n.changeLanguage(langCode);
        setIsLanguageExpanded(false);
    };

    const profileMenuItems: TProfileMenuItems[] = [
        { Icon: UserOneIcon, label: t("common:words:profile"), action: () => history.replace("/profile") },
        {
            Icon: theme === "dark" ? SunIcon : MoonIcon,
            label: theme === "dark" ? t("sidebar:light_theme") : t("sidebar:dark_theme"),
            action: () => toggleTheme(),
        },
        {
            Icon: KeyIcon,
            label: t("common:words:pincode"),
            action: () => {
                getPincode();
            },
        },
        { Icon: ArrowLeftIcon, label: t("common:words:sign_out").toUpperCase(), action: () => logout() },
    ];

    return (
        <IonMenu
            side="start"
            contentId="main-content"
            className={styles.sidebar}
        >
            <IonHeader>
                <IonToolbar color="#ffffff"></IonToolbar>
            </IonHeader>
            <IonContent scrollY={false}>
                <div className={styles.list}>
                    {profileMenuItems.map(({ Icon, label, action }) => (
                        <IonMenuToggle key={label}>
                            <button
                                className={styles.item}
                                onClick={action}
                            >
                                <Icon className={styles.icon} />
                                <span className={styles.label}>{label}</span>
                            </button>
                        </IonMenuToggle>
                    ))}
                    
                    <div className={styles.languageSection}>
                        <button
                            className={styles.item}
                            onClick={() => setIsLanguageExpanded(!isLanguageExpanded)}
                        >
                            <span className={styles.label}>{t("sidebar:language_section_title")}</span>
                            <span className={`${styles.arrow} ${isLanguageExpanded ? styles.arrow_expanded : ""}`}>▼</span>
                        </button>
                        
                        {isLanguageExpanded && (
                            <div className={styles.languageOptions}>
                                <button
                                    className={`${styles.languageOption} ${i18n.language === "ru" ? styles.languageOption_active : ""}`}
                                    onClick={() => handleLanguageChange("ru")}
                                >
                                    {t("sidebar:language_russian")}
                                </button>
                                <button
                                    className={`${styles.languageOption} ${i18n.language === "en" ? styles.languageOption_active : ""}`}
                                    onClick={() => handleLanguageChange("en")}
                                >
                                    {t("sidebar:language_english")}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <CenterModal
                    isOpen={!!pinCode}
                    onClose={handleResetPincode}
                    className={styles.modal}
                    closeIcon
                >
                    <div className={styles.modal__container}>
                        <h3 className={styles.modal__title}>{pinCode}</h3>
                        <p className={styles.modal__text}>{t("common:dialogs:pin_code:text")}</p>
                        <Button
                            style="dark-green"
                            onClick={handleResetPincode}
                            className={styles.modal__button}
                        >
                            {t("common:buttons:ok")}
                        </Button>
                    </div>
                </CenterModal>
            </IonContent>
        </IonMenu>
    );
};
