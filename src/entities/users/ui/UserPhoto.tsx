import { IonAvatar, IonButton, IonIcon } from "@ionic/react";
import { arrowUp } from "ionicons/icons";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

import { useUploadUserPhoto } from "@/entities/users/hooks/useUsers.ts";

import UserOneIcon from "@/shared/icons/UserOneIcon.svg?react";
import { getFullUrl } from "@/shared/utils/getFullUrl.ts";

import styles from "./UserPhoto.module.scss";

type TProps = {
    photoUrl: string;
    cb: () => void;
};

export const UserPhoto = ({ photoUrl, cb }: TProps) => {
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: uploadPhoto } = useUploadUserPhoto(() => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        cb();
    });

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadPhoto(file);
        }
    };

    return (
        <div className={styles.container}>
            <IonAvatar className={styles.avatar}>
                {photoUrl ? (
                    <img
                        src={getFullUrl(photoUrl)}
                        alt="User Photo"
                    />
                ) : (
                    <div className={styles.emptyImg}>
                        <UserOneIcon />
                    </div>
                )}
            </IonAvatar>

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className={styles.hiddenInput}
            />

            <IonButton
                onClick={handleButtonClick}
                className={styles.button}
            >
                <IonIcon
                    icon={arrowUp}
                    slot="start"
                />
                <span>{t("profile:form:upload_photo")}</span>
            </IonButton>
        </div>
    );
};
