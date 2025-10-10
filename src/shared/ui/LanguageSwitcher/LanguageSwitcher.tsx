import React from "react";
import { IonButton, IonIcon, IonPopover, IonList, IonItem, IonLabel } from "@ionic/react";
import { language, checkmark } from "ionicons/icons";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.scss";

interface LanguageSwitcherProps {
    variant?: "icon" | "text" | "full";
    size?: "small" | "default" | "large";
    className?: string;
}

const languages = [
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "en", name: "English", flag: "🇺🇸" },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
    variant = "icon", 
    size = "default",
    className 
}) => {
    const { i18n, t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState(false);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (languageCode: string) => {
        i18n.changeLanguage(languageCode);
        setIsOpen(false);
    };

    const handleOpenPopover = () => {
        setIsOpen(true);
    };

    const handleClosePopover = () => {
        setIsOpen(false);
    };

    return (
        <>
            <IonButton
                fill="clear"
                size={size}
                onClick={handleOpenPopover}
                className={`${styles.languageSwitcher} ${styles[variant]} ${className || ""}`}
                title={t("sidebar:language_selector", { defaultValue: "Change language / Сменить язык" })}
            >
                <IonIcon 
                    icon={language} 
                    className={styles.icon}
                />
                {variant !== "icon" && (
                    <span className={styles.buttonText}>
                        {variant === "full" ? currentLanguage.name : currentLanguage.flag}
                    </span>
                )}
            </IonButton>

            <IonPopover
                isOpen={isOpen}
                onDidDismiss={handleClosePopover}
                showBackdrop={true}
                className={styles.popover}
            >
                <IonList className={styles.languageList}>
                    {languages.map((language) => (
                        <IonItem
                            key={language.code}
                            button
                            onClick={() => handleLanguageChange(language.code)}
                            className={styles.languageItem}
                        >
                            <IonLabel className={styles.languageLabel}>
                                <span className={styles.flag}>{language.flag}</span>
                                <span className={styles.name}>{language.name}</span>
                            </IonLabel>
                            {i18n.language === language.code && (
                                <IonIcon 
                                    icon={checkmark} 
                                    className={styles.checkIcon}
                                />
                            )}
                        </IonItem>
                    ))}
                </IonList>
            </IonPopover>
        </>
    );
};
