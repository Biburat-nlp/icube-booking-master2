import { IonPage } from "@ionic/react";

import { Footer } from "@/widgets/Footer/Footer.tsx";
import { Header } from "@/widgets/Header/Header.tsx";
import { Sidebar } from "@/widgets/Sidebar/Sidebar.tsx";

import styles from "./MainLayout.module.scss";

import type { ReactNode } from "react";

type TProps = {
    children?: ReactNode;
    path: string;
};

export const MainLayout = ({ children, path }: TProps): JSX.Element => {
    return (
        <>
            <Sidebar />
            <IonPage
                id="main-content"
                className={styles.mainPage}
            >
                <Header path={path} />
                {children}
                <Footer currentPath={path} />
            </IonPage>
        </>
    );
};
