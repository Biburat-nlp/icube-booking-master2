import { IonInput } from "@ionic/react";
import { Checkbox } from "antd";
import clsx from "clsx";
import { format, parse } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";

import { fnsFormats, fnsLocale } from "@/features/date/date-fns";

import type { MeetingRoom, OfficeData } from "@/entities/offices/types";
import { useUsers } from "@/entities/users/hooks/useUsers";

import type { DateTimeFilter } from "@/shared/hooks/useFormattedDateTimeFilter";
import CalendarIcon from "@/shared/icons/CalendarIcon.svg?react";
import { Button } from "@/shared/ui/Button/Button";
import ValidatedIonInput from "@/shared/ui/Input/Input.tsx";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal";
import { SelectWithSearchAndTags } from "@/shared/ui/SelectWithSearchAndTags/SelectWithSearchAndTags";
import { combineDateAndTime } from "@/shared/utils/date/combineDateAndTime";

import { useTranslation } from "react-i18next";

import styles from "./BookMeetingRoomNew.module.scss";
import { getFnsLocale } from "@/features/localisation/date-fns";

type NewReservationProps = {
    isOpen: boolean;
    onClose: () => void;
    meetingRoom: MeetingRoom | undefined;
    datesFilter: DateTimeFilter;
    office: OfficeData | null;
    cb: (data: any) => void;
};

export const BookMeetingRoomNew = ({ isOpen, onClose, meetingRoom, datesFilter, office, cb }: NewReservationProps) => {
    if (!meetingRoom) return null;
    const { t, i18n } = useTranslation();
    const currentTitle = meetingRoom.title;
    const { datetime_start } = datesFilter;
    const workday_start = office ? office.workday_start : "09:00:00";
    const workday_end = office ? office.workday_end : "19:30:00";

    const timeStartFormated = parse(workday_start, "HH:mm:ss", new Date());
    const timeEndFormated = parse(workday_end, "HH:mm:ss", new Date());

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedTime, setSelectedTime] = useState({
        timeStart: workday_start,
        timeEnd: workday_end,
    });
    const [themeMeeting, setThemeMeeting] = useState<string>("");

    const timeStartRef = useRef<HTMLIonInputElement>(null);
    const timeEndRef = useRef<HTMLIonInputElement>(null);
    const timeRefs = {
        timeStart: timeStartRef,
        timeEnd: timeEndRef,
    };

    const { data: usersData, refetch: refetchUsers } = useUsers();

    const currentLocale = getFnsLocale();

    const formmatedUsers = useCallback(() => {
        return (
            usersData?.map((user) => ({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
            })) || []
        );
    }, [usersData]);

    const handleSelectedTime = (e: any, type: "timeStart" | "timeEnd") => {
        if (e.detail.value) {
            const currentDate = parse(e.detail.value, "HH:mm", new Date());
            if (currentDate >= timeStartFormated && currentDate <= timeEndFormated) {
                setSelectedTime((prev) => ({ ...prev, [type]: e.detail.value }));
            } else {
                if (timeRefs[type]?.current) {
                    timeRefs[type].current.value = selectedTime[type];
                }
            }
        }
    };

    const handleSelectedUsers = (id: number) => {
        setSelectedUsers(id as never);
    };

    const handleSetData = () => {
        if (selectedTime && themeMeeting) {
            cb({
                invited_users_set: selectedUsers,
                datetime_start: combineDateAndTime(datesFilter.datetime_start, selectedTime.timeStart)?.toISOString(),
                datetime_end: combineDateAndTime(datesFilter.datetime_start, selectedTime.timeEnd)?.toISOString(),
                meeting_subject: themeMeeting,
                target_id: meetingRoom.id,
                title: currentTitle,
                type: "confirmBook",
            });
        }
    };

    const handleOnClose = () => {
        setSelectedUsers([]);
        onClose();
    };

    useEffect(() => {
        refetchUsers();
    }, [refetchUsers]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={handleOnClose}
            height="75%"
            closeIcon
        >
            <div className={styles.bookMeetingRooms}>
                <h3>{t("modals:book_meeting_room:title").split("|")[0]} {currentTitle}</h3>
                <div className={styles.bookMeetingRooms__dateWrap}>
                    <CalendarIcon className={styles.bookMeetingRooms__icon} />
                    <span className={styles.bookMeetingRooms__date}>
                        {format(datetime_start, fnsFormats.wideDateFormat, { locale: currentLocale })}
                    </span>
                </div>
                <div className={styles.bookMeetingRooms__timePicker}>
                    <IonInput
                        type="time"
                        ref={timeStartRef}
                        min={workday_start}
                        max={workday_end}
                        value={selectedTime.timeStart}
                        step="300"
                        onIonChange={(e: any) => handleSelectedTime(e, "timeStart")}
                        className={styles.bookMeetingRooms__timeStart}
                    />
                    <IonInput
                        type="time"
                        ref={timeEndRef}
                        min={workday_start}
                        max={workday_end}
                        value={selectedTime.timeEnd}
                        step="300"
                        onIonChange={(e: any) => handleSelectedTime(e, "timeEnd")}
                        className={styles.bookMeetingRooms__timeEnd}
                    />
                </div>
                <div className={styles.bookMeetingRooms__themeMeeting}>
                    <ValidatedIonInput
                        type="text"
                        errorText={t("validations.required")}
                        label={t("profile:placeholders:meeting_topic")}
                        labelPlacement="floating"
                        fill="solid"
                        className={styles.bookMeetingRooms__textInput}
                        clearInput={true}
                        value={themeMeeting}
                        onValueChange={(value) => setThemeMeeting(value)}
                    />
                </div>
                <div className={styles.bookMeetingRooms__select}>
                    <SelectWithSearchAndTags
                        values={formmatedUsers()}
                        selected={selectedUsers}
                        setSelected={handleSelectedUsers}
                    />
                </div>
                <div className={styles.bookMeetingRooms__actions}>
                    <Checkbox onChange={() => {}}>{t("common:buttons:create_meeting_link")}</Checkbox>
                    <Button
                        onClick={handleSetData}
                        style="dark-green"
                        className={clsx(styles.bookMeetingRooms__sendButton, {
                            [styles.bookMeetingRooms__sendButton_disabled]: !themeMeeting,
                        })}
                        disabled={!themeMeeting}
                    >
                        {t("common:buttons:book")}
                    </Button>
                </div>
            </div>
        </BottomModal>
    );
};