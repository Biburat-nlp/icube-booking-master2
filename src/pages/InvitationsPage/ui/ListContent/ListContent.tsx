import { IonSpinner } from "@ionic/react";
import { useTranslation } from "react-i18next";

import { ListItem } from "@/pages/InvitationsPage/ui/ListContent/ui/ListItem/ListItem.tsx";

import type { TInvitations } from "@/features/invitations/types/invitations.ts";

import PlusIcon from "@/shared/icons/PlusIcon.svg?react";
import { Button } from "@/shared/ui/Button/Button.tsx";

import styles from "./ListContent.module.scss";

type TProps = {
    list: TInvitations[] | undefined;
    isLoading: boolean;
    onClick: () => void;
    update: (values: TInvitations) => void;
    remove: (values: TInvitations) => void;
};

export const ListContent = ({ list, isLoading, onClick, update, remove }: TProps) => {
    const { t } = useTranslation();
    return (
        <div className={styles.list}>
            {isLoading ? (
                <IonSpinner />
            ) : !!list?.length ? (
                list.map((item) => (
                    <div key={item.uid}>
                        <ListItem
                            item={item}
                            update={update}
                            remove={remove}
                        />
                    </div>
                ))
            ) : (
                <div className={styles.emptyBlock}>
                    <Button
                        style="primary"
                        onClick={onClick}
                        className={styles.emptyBlock__button}
                    >
                        <PlusIcon className={styles.emptyBlock__icon} />
                        <span>{t("invitations_page:add_request")}</span>
                    </Button>
                </div>
            )}
        </div>
    );
};
