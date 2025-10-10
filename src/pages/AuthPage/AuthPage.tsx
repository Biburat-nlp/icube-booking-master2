import { IonPage, IonContent } from "@ionic/react";
import React from "react";
import { useLocation } from "react-router-dom";

import { useAuth } from "@/app/providers/AuthProvider";

import ICoreLogoFull from "@/shared/icons/ICoreLogoFull.svg?react";
import { Button } from "@/shared/ui/Button/Button";

import styles from "./AuthPage.module.scss";

type LocationState = { from: string };

export const AuthPage = () => {
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
                    <h1>Добро пожаловать!</h1>
                    <p>Авторизуйтесь для продолжения работы с приложением.</p>
                    <Button
                        style="dark-green"
                        onClick={() => login(from)}
                    >
                        Войти
                    </Button>
                </div>
            </IonContent>
        </IonPage>
    );
};
