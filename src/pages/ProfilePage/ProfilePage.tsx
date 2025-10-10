import { IonContent } from "@ionic/react";
import clsx from "clsx";
import { format, parse } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/app/providers/AuthProvider.tsx";

import { useUpdateUser } from "@/entities/users/hooks/useUsers.ts";
import { UserPhoto } from "@/entities/users/ui/UserPhoto.tsx";

import type { TUser } from "@/shared/types/user.ts";
import { Button } from "@/shared/ui/Button/Button.tsx";
import ValidatedIonInput from "@/shared/ui/Input/Input.tsx";
import { TimePickerWithMask } from "@/shared/ui/TimePickerWithMask/TimePickerWithMask.tsx";
import { ServerConfigButton } from "@/shared/ui";

import styles from "./ProfilePage.module.scss";

export const ProfilePage = () => {
    const { t } = useTranslation();
    const { user, refreshUser } = useAuth();
    const { avatar, first_name, last_name, messenger_link, organization, username, work_day_start, work_day_end } =
        user as TUser;

    const { mutate: updateUser } = useUpdateUser(() => {
        refreshUser();
    });

    const startDateAsDate = parse(work_day_start, "HH:mm:ss", new Date());
    const endDateAsDate = parse(work_day_end, "HH:mm:ss", new Date());

    const formattedStartDate = format(startDateAsDate, "HH:mm");
    const formattedEndDate = format(endDateAsDate, "HH:mm");

    const [updateData, setUpdateData] = useState<Pick<TUser, "messenger_link" | "work_day_start" | "work_day_end">>({
        messenger_link,
        work_day_start,
        work_day_end,
    });

    const memoData = useMemo(() => updateData, [user]);
    const isUpdate =
        JSON.stringify(updateData) !== JSON.stringify(memoData) && !Object.values(updateData).some((el) => !el);

    const infoFields = useMemo(() => {
        return [
            { label: t("profile:form:first_name"), value: first_name },
            { label: t("profile:form:last_name"), value: last_name },
            { label: t("profile:form:username"), value: username },
        ];
    }, [user, t]);

    const handleDataUpdate = useCallback(
        (value: string, key: "messenger_link" | "work_day_start" | "work_day_end") => {
            setUpdateData((prev) => ({ ...prev, [key]: value }));
        },
        [user]
    );

    const handleUpdateUser = () => {
        updateUser(updateData);
    };

    return (
        <IonContent>
            <div className={styles.container}>
                <div className={styles.image}>
                    <UserPhoto
                        photoUrl={avatar}
                        cb={refreshUser}
                    />
                </div>
                <div className={styles.mainInfo}>
                    {infoFields.map(({ label, value }) => (
                        <div
                            className={clsx(styles.mainInfo__item, { [styles.disabled]: true })}
                            key={label}
                        >
                            <span className={styles.mainInfo__item_label}>{label}</span>
                            <span className={styles.mainInfo__item_value}>{value}</span>
                        </div>
                    ))}
                </div>
                <div className={styles.updateInfo}>
                    <div className={styles.updateInfo__item}>
                        <span className={styles.updateInfo__item_label}>{t("profile:form:messenger_link")}</span>
                        <ValidatedIonInput
                            value={updateData?.messenger_link}
                            onValueChange={(e) => handleDataUpdate(e, "messenger_link")}
                            className={styles.updateInfo__item_textInput}
                            validator={() => true}
                        />
                    </div>
                    <div className={styles.updateInfo__item}>
                        <span className={styles.updateInfo__item_label}>{t("profile:form:work_day_start")}</span>
                        <TimePickerWithMask
                            initialTime={formattedStartDate}
                            onChange={(e) => handleDataUpdate(e, "work_day_start")}
                        />
                    </div>
                    <div className={styles.updateInfo__item}>
                        <span className={styles.updateInfo__item_label}>{t("profile:form:work_day_end")}</span>
                        <TimePickerWithMask
                            initialTime={formattedEndDate}
                            onChange={(e) => handleDataUpdate(e, "work_day_end")}
                        />
                    </div>
                </div>
                <div className={clsx(styles.organization, { [styles.disabled]: true })}>
                    <div className={styles.organization__item}>
                        <span className={styles.organization__item_label}>{t("profile:form:organization")}</span>
                        <ValidatedIonInput
                            value={organization}
                            onValueChange={() => () => {}}
                            className={styles.organization__item_textInput}
                            disabled={true}
                        />
                    </div>
                </div>
                
                <div className={styles.serverConfigSection}>
                    <ServerConfigButton variant="icon" size="default" label={t("server_config:title")} />
                </div>
                <Button
                    style="dark-green"
                    disabled={!isUpdate}
                    className={clsx(styles.button, { [styles.disabled]: !isUpdate })}
                    onClick={handleUpdateUser}
                >
                    {t("common:buttons:save")}
                </Button>
            </div>
        </IonContent>
    );
};
