import { IonContent, IonLabel, IonSegment, IonSegmentButton } from "@ionic/react";
import clsx from "clsx";
import { format } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { CalendarContent } from "@/pages/InvitationsPage/ui/CalendarContent/CalendarContent";
import { ListContent } from "@/pages/InvitationsPage/ui/ListContent/ListContent";
import { Modals } from "@/pages/InvitationsPage/ui/Modals/Modals";
import { CancelModal } from "@/pages/InvitationsPage/ui/Modals/ui/CancelModal/CancelModal";

import { useInvitations, useRemoveInvitation } from "@/features/invitations/hooks/useInvitations";
import type { TInvitations } from "@/features/invitations/types/invitations";

import CalendarIcon2 from "@/shared/icons/CalendarIcon2.svg?react";
import ListIcon from "@/shared/icons/ListIcon.svg?react";
import { emitter } from "@/shared/utils/emitter/emitter";

import styles from "./InvitationsPage.module.scss";

export const InvitationsPage = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<"list" | "calendar">("list");
    const [highlightedDates, setHighlightedDates] = useState<
        Array<{ date: string; textColor: string; backgroundColor: string }>
    >([]);
    const [currentInvitation, setCurrentInvitation] = useState<TInvitations | undefined>();
    const [modalType, setModalType] = useState<"create" | "update" | "remove" | "closed">("closed");

    const {
        data: list,
        refetch,
        isLoading,
    } = useInvitations((data) => {
        if (data?.length) {
            setHighlightedDates(
                data.map(({ visit_start }) => ({
                    date: format(visit_start, "yyyy-MM-dd"),
                    textColor: "var(--icube-light-grey)",
                    backgroundColor: "transparent",
                }))
            );
        }
    });

    const cbClose = useCallback(() => {
        refetch();
        setModalType("closed");
        setCurrentInvitation(undefined);
    }, [refetch]);

    const { mutate: removeInvitation } = useRemoveInvitation(cbClose);

    const openCreate = useCallback(() => {
        setCurrentInvitation(undefined);
        setModalType("create");
    }, []);

    const openUpdate = useCallback((inv: TInvitations) => {
        setCurrentInvitation(inv);
        setModalType("update");
    }, []);

    const openRemove = useCallback((inv: TInvitations) => {
        setCurrentInvitation(inv);
        setModalType("remove");
    }, []);

    const handleRemove = useCallback(() => {
        if (currentInvitation?.id) {
            removeInvitation(currentInvitation.id);
        }
    }, [removeInvitation, currentInvitation]);

    useEffect(() => {
        refetch();
    }, [selectedTab]);

    useEffect(() => {
        const handler = () => openCreate();
        emitter.on("isOpenCreateInvitation", handler);
        return () => {
            emitter.off("isOpenCreateInvitation", handler);
        };
    }, [openCreate]);

    return (
        <div className={clsx(styles.container, { [styles.noScroll]: !list?.length })}>
            <Modals
                isOpen={modalType === "create" || modalType === "update"}
                onClose={cbClose}
                cb={cbClose}
                isUpdate={modalType === "update"}
                currentInvitation={currentInvitation}
            />
            <CancelModal
                isOpen={modalType === "remove"}
                onClose={cbClose}
                cbModal={handleRemove}
            />

            <IonSegment
                value={selectedTab}
                onIonChange={(e) => setSelectedTab(e.detail.value as "list" | "calendar")}
                className={styles.segment}
            >
                <IonSegmentButton
                    value="list"
                    className={clsx(styles.segment__button, styles.segment__button_list, {
                        [styles.segment__active]: selectedTab === "list",
                    })}
                >
                    <IonLabel
                        className={clsx(styles.segment__label, {
                            [styles.segment__label_active]: selectedTab === "list",
                        })}
                    >
                        <ListIcon className={styles.segment__icon} />
                        <span>{t("invitations_page:tabs:requests")}</span>
                    </IonLabel>
                </IonSegmentButton>

                <IonSegmentButton
                    value="calendar"
                    className={clsx(styles.segment__button, styles.segment__button_calendar, {
                        [styles.segment__active]: selectedTab === "calendar",
                    })}
                >
                    <IonLabel
                        className={clsx(styles.segment__label, {
                            [styles.segment__label_active]: selectedTab === "calendar",
                        })}
                    >
                        <CalendarIcon2 className={styles.segment__icon} />
                        <span>{t("invitations_page:tabs:calendar")}</span>
                    </IonLabel>
                </IonSegmentButton>
            </IonSegment>

            <IonContent scrollY={selectedTab !== "calendar"}>
                {selectedTab === "list" ? (
                    <ListContent
                        list={list}
                        isLoading={isLoading}
                        onClick={openCreate}
                        update={openUpdate}
                        remove={openRemove}
                    />
                ) : (
                    <CalendarContent highlightedDates={highlightedDates} />
                )}
            </IonContent>
        </div>
    );
};
