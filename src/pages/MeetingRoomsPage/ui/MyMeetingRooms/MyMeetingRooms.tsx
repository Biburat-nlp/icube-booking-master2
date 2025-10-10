import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import type { AnyReservation, TReservationItem } from "@/features/booking/types/reservations.ts";
import { MeetingRoomItem } from "@/features/booking/ui/MeetingRoomItem/MeetingRoomItem.tsx";

import type { MeetingRoom } from "@/entities/offices/types.ts";

import { BottomModal } from "@/shared/ui/Modal/BottomModal/BottomModal.tsx";

import styles from "./MyMeetingRooms.module.scss";

type TProps = {
    isOpen: boolean;
    onClose: () => void;
    reservations: TReservationItem | undefined;
    historyReservations: TReservationItem | undefined;
    meetingRooms: MeetingRoom[] | undefined;
    reserveMeetingRooms: AnyReservation[] | undefined;
    deleteMeetingRoom: (arg: any) => void;
    onSelectMeetingRoom: (meetingRoom: any, reserve?: any) => void;
    cb: (room_id: number, reservationId: number) => void;
};

export const MyMeetingRooms = ({
    isOpen,
    onClose,
    reservations,
    historyReservations,
    meetingRooms,
    reserveMeetingRooms,
    onSelectMeetingRoom,
    cb,
}: TProps) => {
    const { t } = useTranslation();

    const isMeetingRoomReserve = (id: number) => reserveMeetingRooms?.find(({ target_id }) => target_id === id);

    const getReserveTime = (id: number) => {
        const current = isMeetingRoomReserve(id);

        if (current) return format(current.reserve_end, "dd.MM.yyyy, HH:mm");
    };

    const handleClick = (room: MeetingRoom) => {
        if (!isMeetingRoomReserve(room.id)) {
            onSelectMeetingRoom(room);
        }
    };

    return (
        <BottomModal
            isOpen={isOpen}
            onClose={onClose}
            className={styles.myMeetingRoomsModal}
            height="95%"
            closeIcon
        >
            <div className={styles.container}>
                <span className={styles.title}>{t("modals:find_meeting_room:title")}</span>
                {!!meetingRooms?.length ? (
                    <>
                        <div className={styles.freeMeetingRooms}>
                            {meetingRooms.map((room) => (
                                <button
                                    type="button"
                                    key={room.id}
                                    className={styles.freeMeetingRooms__button}
                                    onClick={() => handleClick(room)}
                                >
                                    <span className={styles.freeMeetingRooms__title}>{room.title}: </span>

                                    {!!isMeetingRoomReserve(room.id) ? (
                                        <span className={styles.freeMeetingRooms__busy}>
                                            В это время занята, освободится {getReserveTime(room.id)}{" "}
                                        </span>
                                    ) : (
                                        <span className={styles.freeMeetingRooms__free}>
                                            {t("modals:find_meeting_room:buttons:free_meeting_room")}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </>
                ) : (
                    <span className={styles.freeMeetingRooms__emptyMessage}>Нет подходящих переговорных</span>
                )}

                <div className={styles.myMeetingRooms}>
                    <span className={styles.myMeetingRooms__title}>Мои бронирования</span>
                    <div className={styles.myMeetingRooms__items}>
                        {reservations && (reservations as any).results && (reservations as any).results.length > 0 ? (
                            (reservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <MeetingRoomItem
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                        cb={cb}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myMeetingRooms__emptyMessage}>
                                У вас нет забронированных переговорных
                            </span>
                        )}
                    </div>
                </div>

                <div className={styles.myMeetingRooms}>
                    <span className={styles.myMeetingRooms__title}>История бронирования</span>
                    <div className={styles.myMeetingRooms__items}>
                        {historyReservations &&
                        (historyReservations as any).results &&
                        (historyReservations as any).results.length > 0 ? (
                            (historyReservations as any).results.map((el: any, i: number) => (
                                <div
                                    key={`${el.locker_title}-${i}`}
                                    style={{ width: "calc(50% - 4px)", borderRadius: "8px", boxSizing: "border-box" }}
                                >
                                    <MeetingRoomItem
                                        {...el}
                                        Icon={(reservations as any).Icon}
                                    />
                                </div>
                            ))
                        ) : (
                            <span className={styles.myMeetingRooms__emptyMessage}>
                                У вас нет забронированных переговорных
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </BottomModal>
    );
};
