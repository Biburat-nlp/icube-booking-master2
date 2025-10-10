import { IonButtons, IonHeader, IonMenuButton, IonToolbar } from "@ionic/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

import { ROUTES_FIELD } from "@/app/router/constants.ts";

import ICoreLogoFull from "@/shared/icons/ICoreLogoFull.svg?react";
import MenuIcon from "@/shared/icons/MenuIcon.svg?react";
import PlusIcon from "@/shared/icons/PlusIcon.svg?react";
import { emitter } from "@/shared/utils/emitter/emitter.ts";
import { getRouteLabel } from "@/shared/utils/getRouteLabel.ts";

import { useFilterOpen } from "@/widgets/Header/hooks/useFilterOpen.ts";

import styles from "./Header.module.scss";

type TProps = {
    path: string;
};

export const Header = ({ path }: TProps) => {
    const { t } = useTranslation();
    const isFilterOpen = useFilterOpen();

    const currentLabel = getRouteLabel(ROUTES_FIELD, path);

    const isInvitationPage = path.startsWith("/invitation");

    const invitationPageHandler = () => {
        emitter.emit("isOpenCreateInvitation");
    };

    return (
        <IonHeader className={clsx(styles.header, { [styles.hideShadow]: isFilterOpen })}>
            <IonToolbar color="#ffffff">
                <IonButtons slot="start">
                    <IonMenuButton
                        className={styles.menuBtn}
                        autoHide={false}
                    >
                        <MenuIcon className={styles.menuIcon} />
                    </IonMenuButton>
                </IonButtons>
                <div className={styles.logoWrap}>
                    <ICoreLogoFull className={styles.logo} />
                    {currentLabel && <span className={styles.label}>{t(currentLabel)}</span>}
                    {isInvitationPage && (
                        <button
                            onClick={invitationPageHandler}
                            className={styles.invitationBtn}
                        >
                            <PlusIcon className={styles.invitationIcon} />
                        </button>
                    )}
                </div>
            </IonToolbar>
        </IonHeader>
    );
};
