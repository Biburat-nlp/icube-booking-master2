import { IonInput } from "@ionic/react";
import { Checkbox } from "antd";
import clsx from "clsx";
import { format, parse } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";

import type { TSelectedReservation } from "@/features/booking/types/reservations.ts";
import { fnsFormats, fnsLocale } from "@/features/date/date-fns.ts";

import type { OfficeData } from "@/entities/offices/types.ts";
import { useUsers } from "@/entities/users/hooks/useUsers.ts";

import CalendarIcon from "@/shared/icons/CalendarIcon.svg?react";
import { Button } from "@/shared/ui/Button/Button.tsx";
import ValidatedIonInput from "@/shared/ui/Input/Input.tsx";
import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";
import { SelectWithSearchAndTags } from "@/shared/ui/SelectWithSearchAndTags/SelectWithSearchAndTags.tsx";
import { combineDateAndTime } from "@/shared/utils/date/combineDateAndTime.ts";

import styles from "./UpdateMeetingRoomModal.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    currentReservation?: TSelectedReservation;
    office: OfficeData | null;
    cb: (data: any) => void;
    isUpdateMode?: boolean;
};

export const UpdateMeetingRoomModal = ({ isOpen, onClose, currentReservation, office, cb }: TProps) => {
    if (!currentReservation) return null;

    const currentTitle = currentReservation.target_title;

    const reserve_start = format(currentReservation.reserve_start, "HH:mm:ss");
    const reserve_end = format(currentReservation.reserve_end, "HH:mm:ss");

    const office_workday_start = office ? office.workday_start : "09:00:00";
    const office_workday_end = office ? office.workday_end : "19:30:00";

    const timeStartFormated = parse(office_workday_start, "HH:mm:ss", new Date());
    const timeEndFormated = parse(office_workday_end, "HH:mm:ss", new Date());

    const [selectedUsers, setSelectedUsers] = useState();
    const [selectedTime, setSelectedTime] = useState({
        reserve_start,
        reserve_end,
    });

    const [themeMeeting, setThemeMeeting] = useState<string>();

    const timeStartRef = useRef<HTMLIonInputElement>(null);
    const timeEndRef = useRef<HTMLIonInputElement>(null);
    const timeRefs = {
        reserve_start: timeStartRef,
        reserve_end: timeEndRef,
    };

    const { data: usersData, refetch: refetchUsers } = useUsers();

    const formmatedUsers = useCallback(() => {
        return (
            usersData?.map((user) => ({
                id: user.id,
                name: `${user.first_name} ${user.last_name}`,
            })) || []
        );
    }, [usersData]);

    const handleOnClose = () => {
        onClose();
    };

    const handleSelectedTime = (e: any, type: "reserve_start" | "reserve_end") => {
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
                id: currentReservation.id,
                title: currentReservation.target_title,
                datetime_start: combineDateAndTime(
                    currentReservation.reserve_start,
                    selectedTime.reserve_start
                )?.toISOString(),
                datetime_end: combineDateAndTime(
                    currentReservation.reserve_end,
                    selectedTime.reserve_end
                )?.toISOString(),
                meeting_subject: themeMeeting,
                target_id: currentReservation.target_id,
                type: "confirmUpdateBook",
            });
        }
    };

    useEffect(() => {
        refetchUsers();
    }, [refetchUsers]);

    useEffect(() => {
        setThemeMeeting(currentReservation.meeting_subject || "");
        setSelectedTime({ reserve_start, reserve_end });
    }, [currentReservation.id]);

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={handleOnClose}
            height="75%"
            closeIcon
        >
            <div className={styles.updateMeetingRooms}>
                <h3>Забронировать переговорную {currentTitle}</h3>
                <div className={styles.updateMeetingRooms__dateWrap}>
                    <CalendarIcon className={styles.updateMeetingRooms__icon} />
                    <span className={styles.updateMeetingRooms__date}>
                        {format(currentReservation.reserve_start, fnsFormats.wideDateFormat, { locale: fnsLocale })}
                    </span>
                </div>
                <div className={styles.updateMeetingRooms__timePicker}>
                    <IonInput
                        type="time"
                        ref={timeStartRef}
                        value={selectedTime.reserve_start}
                        onIonChange={(e: any) => handleSelectedTime(e, "reserve_start")}
                        className={styles.updateMeetingRooms__timeStart}
                    />
                    <IonInput
                        type="time"
                        ref={timeEndRef}
                        value={selectedTime.reserve_end}
                        onIonChange={(e: any) => handleSelectedTime(e, "reserve_end")}
                        className={styles.updateMeetingRooms__timeEnd}
                    />
                </div>
                <div className={styles.updateMeetingRooms__themeMeeting}>
                    <ValidatedIonInput
                        type="text"
                        errorText="Обязательное поле"
                        label="Тема встречи"
                        labelPlacement="floating"
                        fill="solid"
                        className={styles.updateMeetingRooms__textInput}
                        clearInput={true}
                        value={themeMeeting}
                        onValueChange={(value) => setThemeMeeting(value)}
                    />
                </div>
                <div className={styles.updateMeetingRooms__select}>
                    <SelectWithSearchAndTags
                        values={formmatedUsers()}
                        selected={selectedUsers ?? []}
                        setSelected={handleSelectedUsers}
                    />
                </div>
                <div className={styles.updateMeetingRooms__actions}>
                    <Checkbox onChange={() => {}}>Создать ссылку для встречи</Checkbox>
                    <Button
                        onClick={handleSetData}
                        style="dark-green"
                        className={clsx(styles.updateMeetingRooms__sendButton, {
                            [styles.updateMeetingRooms__sendButton_disabled]: !themeMeeting,
                        })}
                        disabled={!themeMeeting}
                    >
                        Забронировать
                    </Button>
                </div>
            </div>
        </BottomModal>
    );
};
