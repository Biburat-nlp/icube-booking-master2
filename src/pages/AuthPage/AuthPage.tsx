import { IonPage, IonContent } from "@ionic/react";
import React from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider";

import ICoreLogoFull from "@/shared/icons/ICoreLogoFull.svg?react";
import { Button } from "@/shared/ui/Button/Button";
import { ServerConfigButton } from "@/shared/ui/ServerConfigButton/ServerConfigButton";
import { useTranslation } from "react-i18next";

import styles from "./AuthPage.module.scss";

type LocationState = { from: string };

export const AuthPage = () => {
    const { t } = useTranslation();
    const { login } = useAuth();
    const location = useLocation<LocationState>();
    const from = location.state?.from || "/office";

    return (
        <IonPage>
            <IonContent
                scrollY={false}
                className={styles.authContainer}
                fullscreen
            >
                <div className={styles.wrapper}>
                    <ICoreLogoFull className={styles.logoIcon} />
                    <h1>{t("auth_page:title")}</h1>
                    <p>{t("auth_page:subtitle")}</p>
                    <div style={{ marginBottom: 16 }}>
                        <ServerConfigButton variant="text" />
                    </div>
                    <Button
                        style="dark-green"
                        onClick={() => login(from)}
                    >
                        {t("auth_page:login_button")}
                    </Button>
                </div>
            </IonContent>
        </IonPage>
    );
};
