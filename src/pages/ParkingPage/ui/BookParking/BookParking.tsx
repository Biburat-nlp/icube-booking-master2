import { Select } from "antd";
import clsx from "clsx";
import { format, isSameDay } from "date-fns";
import React, { useCallback, useEffect, useState } from "react";

import { fnsFormats, fnsLocale } from "@/features/date/date-fns";
import { useTheme } from "@/app/providers/ThemeProvider.tsx";

import { selectFields } from "@/pages/ParkingPage/ui/BookParking/constants.ts";

import { useInvitations } from "@/features/invitations/hooks/useInvitations.ts";

import type { OfficeData, Parking } from "@/entities/offices/types.ts";

import { ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import type { DateTimeFilter } from "@/shared/hooks/useFormattedDateTimeFilter.ts";
import CalendarIcon from "@/shared/icons/CalendarIcon.svg?react";
import { Button } from "@/shared/ui/Button/Button.tsx";
import ValidatedIonInput from "@/shared/ui/Input/Input.tsx";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";
import { getFnsLocale } from "@/features/localisation/date-fns";
import styles from "./BookParking.module.scss";

const { Option } = Select;

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    parking: Parking | undefined;
    datesFilter: DateTimeFilter;
    office: OfficeData | null;
    cb: (data: any) => void;
};

export const BookParking = ({ isOpen, onClose, parking, datesFilter, cb }: TProps) => {
    const { t } = useTranslation();
    const [selectedPurpose, setSelectedPurpose] = useState(0);
    const [carModel, setCarModel] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const [formattedGuests, setFormattedGuests] = useState<Array<{ id: string; label: string }>>();
    const currentLocale = getFnsLocale();

    const { theme } = useTheme();

    const { data: quests, refetch: refetchInvations } = useInvitations((data) => {
        const formattedData = data.flatMap(({ guests }) =>
            guests.map(({ first_name, last_name }) => ({
                id: `${first_name} ${last_name}`,
                label: `${first_name} ${last_name}`,
            }))
        );

        setFormattedGuests(formattedData);
    });

    const [inputLengthError, setInputLengthError] = useState<boolean>(false);

    const { datetime_start, datetime_end } = datesFilter;

    const values = selectFields;

    const inputValidator = (value: string) => {
        setInputLengthError(!(value.trim().length > 2));
        return value.trim().length > 2;
    };

    const handleChangePurpose = useCallback(
        (id: number) => {
            setSelectedPurpose(id as never);

            if (id === 1) refetchInvations();
        },
        [selectedPurpose]
    );

    const handleAction = useCallback(() => {
        if (carModel && carNumber && parking) {
            const values = {
                ...parking,
                ...datesFilter,
                vehicle: {
                    vehicle_model: carModel,
                    vehicle_number: carNumber,
                },
                type: "confirmBook",
            };
            cb(values);
        }
    }, [carModel, carNumber, parking]);

    useEffect(() => {
        if (!isOpen) setSelectedPurpose(0);
    }, [isOpen]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            height="75%"
            closeIcon
        >
            <div className={styles.bookParking}>
                <h3>{t("modals:book_parking_place:")} {parking?.title}</h3>
                <div className={styles.bookParking__dateSection}>
                    <CalendarIcon className={styles.bookParking__icon} />
                    {isSameDay(datetime_start, datetime_end) ? (
                        <div>
                            <span className={styles.bookParking__date}>
                                {format(datetime_start, "dd.MM.yyyy, EEEE", { locale: currentLocale })}
                            </span>
                            <br />
                            <span className={clsx(styles.bookParking__date)}>
                                {format(datetime_start, "HH:mm")} - {format(datetime_end, "HH:mm")}
                            </span>
                        </div>
                    ) : (
                        <div>
                            <span className={styles.bookParking__date}>
                                {format(datetime_start, "dd.MM.yyyy, HH:mm, EEEE", { locale: currentLocale })}
                            </span>
                            <br />
                            <span className={clsx(styles.bookParking__date)}>
                                {format(datetime_end, "dd.MM.yyyy, HH:mm, EEEE", { locale: currentLocale })}
                            </span>
                        </div>
                    )}
                </div>
                <div className={styles.bookParking__select}>
                    <Select
                        placeholder={t("profile:placeholders:for_who")}
                        onChange={handleChangePurpose}
                        style={{
                            width: "100%",
                        }}
                    >
                        {values.map((value) => (
                            <Option
                                key={value.id}
                                value={value.id}
                            >
                                {value.label}
                            </Option>
                        ))}
                    </Select>
                </div>
                {!!selectedPurpose && (
                    <div className={styles.bookParking__select}>
                        <Select
                            style={{ width: "100%" }}
                            placeholder={t("profile:placeholders:guest")}
                        >
                            {!!formattedGuests?.length &&
                                formattedGuests.map((value) => (
                                    <Option
                                        key={value.id}
                                        value={value.id}
                                    >
                                        {value.label}
                                    </Option>
                                ))}
                        </Select>
                    </div>
                )}

                <div className={styles.bookParking__vehicleItems}>
                    <ValidatedIonInput
                        type="text"
                        label={t("profile:placeholders:car_model")}
                        labelPlacement="floating"
                        errorText={inputLengthError ? t("validations.minLength", { min: 3 }) : t("validations:required")}
                        className={styles.bookParking__item}
                        clearInput={true}
                        onValueChange={(value) => setCarModel(value)}
                        value={carModel}
                        validator={inputValidator}
                    />
                    <ValidatedIonInput
                        type="text"
                        label={t("profile:placeholders:car_number")}
                        labelPlacement="floating"
                        className={styles.bookParking__item}
                        errorText={inputLengthError ? t("validations.minLength", { min: 3 }) : t("validations:required")}
                        clearInput={true}
                        onValueChange={(value) => setCarNumber(value)}
                        value={carNumber}
                        validator={inputValidator}
                    />
                </div>

                <Button
                    style="dark-green"
                    onClick={handleAction}
                    className={clsx(styles.bookParking__action, {
                        [styles.bookParking__action_disabled]: !carNumber || !carModel,
                    })}
                    disabled={!carNumber || !carModel}
                >
                    {t("common:buttons:book")}
                </Button>
            </div>
        </BottomModal>
    );
};
