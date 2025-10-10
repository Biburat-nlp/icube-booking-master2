import { IonTabBar, IonFooter, IonTabButton } from "@ionic/react";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import { ROUTES_FIELD } from "@/app/router/constants.ts";

import Modal from "@/widgets/Footer/ui/Modal/Modal.tsx";

import styles from "./Footer.module.scss";

import type { TModalTypes } from "@/widgets/Footer/types/types.ts";

type TProps = {
    currentPath: string;
};

export const Footer = ({ currentPath }: TProps) => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [currentMode, setIsСurrentMode] = useState<TModalTypes>("reservation");

    const history = useHistory();
    const location = useLocation();

    const { t } = useTranslation();

    const tabs = Object.values(ROUTES_FIELD).filter(({ isFooter }) => isFooter);

    const handleOpenTabMenu = (tabPath: string) => {
        if (tabPath === ROUTES_FIELD.RESERVATION.path || tabPath === ROUTES_FIELD.NAVIGATION.path) {
            setIsСurrentMode(tabPath === ROUTES_FIELD.RESERVATION.path ? "reservation" : "navigation");
            setIsOpenModal(true);
        } else {
            history.replace({ pathname: tabPath, search: location.search });
        }
    };

    return (
        <IonFooter className={styles.footer}>
            <IonTabBar
                slot="bottom"
                className={styles.tabs}
            >
                {tabs.map(({ path, label, Icon }) => (
                    <IonTabButton
                        tab={path}
                        onClick={() => handleOpenTabMenu(path)}
                        key={path}
                        className={clsx(styles.button, { [styles.isActive]: currentPath.startsWith(path) })}
                    >
                        {Icon && <Icon className={styles.icon} />}
                        {label && <span className={styles.label}>{t(label)}</span>}
                    </IonTabButton>
                ))}
            </IonTabBar>
            <Modal
                isOpen={isOpenModal}
                setIsOpen={setIsOpenModal}
                currentMode={currentMode}
                currentPath={currentPath}
            />
        </IonFooter>
    );
};
