import { Select } from "antd";
import clsx from "clsx";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

import { GuestCard } from "@/pages/InvitationsPage/ui/ListContent/ui/GuestCard/GuestCard.tsx";
import type { TLocalGuest } from "@/pages/InvitationsPage/ui/Modals/ui/GuestModal/GuestModal.tsx";

import type { TInvitations } from "@/features/invitations/types/invitations.ts";

import { useOfficeFilters } from "@/entities/offices/hooks/useOfficeFilters";
import { useUsers } from "@/entities/users/hooks/useUsers";
import type { TUsers } from "@/entities/users/types";

import PlusIcon from "@/shared/icons/PlusIcon.svg?react";
import type { TGuest } from "@/shared/types/guest.ts";
import { Button } from "@/shared/ui/Button/Button";
import { DateTimePickerWithMask } from "@/shared/ui/DateTimePickerWithMask/DateTimePickerWithMask";
import ValidatedIonInput from "@/shared/ui/Input/Input";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal";

import styles from "./InvitationModal.module.scss";

const { Option } = Select;

export type TInvitationForm = {
    office_id: number;
    visit_start: string;
    visit_end: string;
    visit_purpose: string;
    visit_user_id: number;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    handleOpenGuest: (guest?: TLocalGuest) => void;
    guests: TLocalGuest[];
    removeGuest: (idByCreate: string) => void;
    onSubmit: (data: TInvitationForm) => void;
    isUpdate: boolean;
    currentInvitation?: TInvitations;
};

export const InvitationModal: React.FC<Props> = ({
    isOpen,
    onClose,
    handleOpenGuest,
    guests,
    removeGuest,
    onSubmit,
    isUpdate,
    currentInvitation,
}) => {
    const { t } = useTranslation();
    const [visitStart, setVisitStart] = useState<Date>(new Date());
    const [visitEnd, setVisitEnd] = useState<Date>(new Date());
    const [visitUser, setVisitUser] = useState<number>();
    const [visitPurpose, setVisitPurpose] = useState<string>("");
    const [office, setOffice] = useState<number>();

    const { allOffices } = useOfficeFilters();
    const { data: users, refetch: refetchUsers } = useUsers({}, () => {});

    const formattedUsers = users?.map((u: TUsers) => {
        const prefix = u.first_name ? `${u.first_name[0]}. ` : "";
        return { id: u.id, label: `${prefix}${u.last_name}` };
    });
    const formattedOffices = allOffices.map((o) => ({ id: o.id, label: o.title }));

    useEffect(() => {
        if (!isOpen) return;

        if (isUpdate && currentInvitation) {
            setVisitStart(new Date(currentInvitation.visit_start));
            setVisitEnd(new Date(currentInvitation.visit_end));
            setVisitUser(currentInvitation.visit_user.id);
            setVisitPurpose(currentInvitation.visit_purpose ?? "");
            setOffice(currentInvitation.office_id);
        } else {
            const now = new Date();
            setVisitStart(now);
            setVisitEnd(now);
            setVisitUser(undefined);
            setVisitPurpose("");
            setOffice(undefined);
        }

        refetchUsers();
    }, [isOpen, isUpdate, currentInvitation, refetchUsers]);

    const allFields = Boolean(visitUser && visitPurpose && office && guests.length);

    const handleSubmitForm = useCallback(() => {
        onSubmit({
            office_id: office!,
            visit_start: visitStart.toISOString(),
            visit_end: visitEnd.toISOString(),
            visit_purpose: visitPurpose,
            visit_user_id: visitUser!,
        });
    }, [office, visitStart, visitEnd, visitPurpose, visitUser, onSubmit]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            height="95%"
            className={styles.invitationModal}
            closeIcon
        >
            <div className={styles.invitation}>
                <h2>{t("my_guests:modals:booking_guests:title")}</h2>

                <div className={styles.invitation__inputContainer}>
                    <span className={styles.invitation__inputContainer_label}>{t("labels:start_date")}</span>
                    <DateTimePickerWithMask
                        initialDate={visitStart}
                        onChange={(value) => setVisitStart(new Date(value))}
                    />
                </div>
                <div className={styles.invitation__inputContainer}>
                    <span className={styles.invitation__inputContainer_label}>{t("labels:end_date")}</span>
                    <DateTimePickerWithMask
                        initialDate={visitEnd}
                        onChange={(value) => setVisitEnd(new Date(value))}
                    />
                </div>

                <Select
                    style={{ width: "100%" }}
                    className={styles.invitation__select}
                    placeholder={t("profile:placeholders:who_guest_visiting")}
                    value={visitUser}
                    onChange={setVisitUser}
                >
                    {formattedUsers?.map((u) => (
                        <Option
                            key={u.id}
                            value={u.id}
                        >
                            {u.label}
                        </Option>
                    ))}
                </Select>

                <div>
                    <ValidatedIonInput
                        type="text"
                        label={t("profile:placeholders:visit_purpose")}
                        labelPlacement="floating"
                        errorText={t("validations:required")}
                        className={styles.invitation__input}
                        clearInput
                        onValueChange={setVisitPurpose}
                        value={visitPurpose}
                    />
                </div>

                <div className={styles.invitation__select}>
                    <Select
                        style={{ width: "100%" }}
                        placeholder={t("profile:placeholders:office")}
                        value={office}
                        onChange={setOffice}
                    >
                        {formattedOffices.map((o) => (
                            <Option
                                key={o.id}
                                value={o.id}
                            >
                                {o.label}
                            </Option>
                        ))}
                    </Select>
                </div>

                <div className={styles.guests__container}>
                    <span className={styles.guests__title}>{t("my_guests:labels:guests")}</span>
                    {guests.length ? (
                        <div className={styles.guests__list}>
                            {guests.map((g) => (
                                <div key={g.idByCreate}>
                                    <GuestCard
                                        guest={g as TGuest}
                                        removeGuest={() => removeGuest(g.idByCreate)}
                                        openGuest={() => handleOpenGuest(g)}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className={styles.guests__emptyMessage}>{t("my_guests:labels:no_guests")}</span>
                    )}
                    <Button
                        style="primary"
                        onClick={() => handleOpenGuest()}
                        className={styles.guests__button}
                    >
                        <PlusIcon />
                        <span>{t("my_guests:buttons:add_guest")}</span>
                    </Button>
                </div>

                <div className={styles.actions}>
                    <Button
                        style="primary"
                        onClick={onClose}
                    >
                        {t("common:buttons:cancel")}
                    </Button>
                    <Button
                        style="dark-green"
                        onClick={handleSubmitForm}
                        className={clsx({ [styles.disabled]: !allFields })}
                        disabled={!allFields}
                    >
                        {t("common:buttons:save")}
                    </Button>
                </div>
            </div>
        </BottomModal>
    );
};
