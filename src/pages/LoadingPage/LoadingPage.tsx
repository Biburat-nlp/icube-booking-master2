import { IonPage, IonSpinner } from "@ionic/react";

import styles from "./LoadingPage.module.scss";

export const LoadingPage = () => {
    return (
        <IonPage>
            <div className={styles.container}>
                <IonSpinner name="crescent" />
            </div>
        </IonPage>
    );
};
