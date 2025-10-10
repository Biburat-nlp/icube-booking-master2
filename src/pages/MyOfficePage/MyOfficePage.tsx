import { IonContent } from "@ionic/react";

import { ReservationList } from "@/pages/MyOfficePage/ui/ReservationList/ReservationList.tsx";

import styles from "./MyOfficePage.module.scss";

export const MyOfficePage = () => {
    return (
        <IonContent className={styles.officePage}>
            <ReservationList />
        </IonContent>
    );
};
