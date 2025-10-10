import { IonContent } from "@ionic/react";
import clsx from "clsx";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BookMeetingRoomNew } from "@/pages/MeetingRoomsPage/ui/BookMeetingRoomNew/BookMeetingRoomNew.tsx";
import { Modals } from "@/pages/MeetingRoomsPage/ui/Modals/Modals.tsx";
import { MyMeetingRooms } from "@/pages/MeetingRoomsPage/ui/MyMeetingRooms/MyMeetingRooms.tsx";

import {
    useAllMeetingRoomReservations,
    useCancelMeetingRoom,
    useReservations,
    useReserveMeetingRoom,
    useUpdateMeetingRoom,
} from "@/features/booking/hooks/useMeetingRooms.ts";
import type { AnyReservation } from "@/features/booking/types/reservations.ts";
import { UpdateMeetingRoomModal } from "@/features/booking/ui/UpdateMeetingRoomModal/UpdateMeetingRoomModal.tsx";
import { useFilters } from "@/features/filters/model/hooks/useFilters.ts";

import { type TSelectTreeNodeExtended, useOfficeFilters } from "@/entities/offices/hooks/useOfficeFilters.ts";
import type { MeetingRoom } from "@/entities/offices/types.ts";

import { usePagination } from "@/shared/hooks/usePagination.ts";
import { useRouteCache } from "@/shared/hooks/useRouteCache.ts";
import { ReservationsMap } from "@/shared/ui/ReservationsMap/ReservationsMap.tsx";
import { getFullUrl } from "@/shared/utils/getFullUrl.ts";
import type { TSwitchValue } from "@/shared/ui/SwitchItems/SwitchItems.tsx";

import { Filter } from "@/widgets/Filter/Filter.tsx";
import { WelcomeReservation } from "@/widgets/WelcomeReservation/WelcomeReservation.tsx";

import { filterFields, textFields } from "./constants.ts";

import styles from "./MeetingRoomsPage.module.scss";

type TProps = {
    path: string;
};

type TModalMessageProps = {
    [key: string]: string | number | number[];
};

export const MeetingRoomsPage = ({ path }: TProps) => {
    const [filterOpen, setFilterOpen] = useState(true);
    const [switchFilter, setSwitchFilter] = useState<{ [key: string]: boolean }>({
        has_multimedia_panel: false,
        has_drawing_board: false,
        has_conference_call: false,
    });

    const [filteredMeetingRooms, setFilteredMeetingRooms] = useState<MeetingRoom[] | []>([]);
    const [reserveMeetingRooms, setReserveMeetingRooms] = useState<AnyReservation[] | undefined>();
    const [currentMeetingRoom, setCurrentMeetingRoom] = useState<MeetingRoom | undefined>();
    const [currentReservation, setCurrentReservation] = useState<AnyReservation | undefined>();

    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<TModalMessageProps>({
        type: "",
    });
    const [openReservations, setOpenReservations] = useState<boolean>(false);
    const [openBookMeetingRoom, setOpenBookMeetingRoom] = useState<boolean>(false);
    const [openUpdateBookMeetingRoom, setOpenUpdateBookMeetingRoom] = useState<boolean>(false);

    const [isStartInterface, setIsStartInterface] = useState(true);
    const [currentPlanImg, setCurrentPlanImg] = useState<string | null>(null);
    const [mapPoints, setMapPoints] = useState<{ id: number; x: number; y: number; free: boolean }[] | []>([]);
    const [mapMode, setMapMode] = useState<boolean>(true);

    const { limit, offset } = usePagination({ rowsPerPage: 9999 });
    const { routeCache, pushToRouteCache } = useRouteCache(path);

    const {
        selectedOffice,
        setSelectedOffice,
        selectedSpace,
        setSelectedSpace,
        selectedFloor,
        setSelectedFloor,
        datesFilter,
        setDatesFilter,
        dateTimeFilterLabel,
    } = useFilters(routeCache, pushToRouteCache);

    const params = useMemo(
        () => ({
            limit,
            offset,
            office_id: selectedOffice,
            floor_id: selectedFloor,
            space_id: selectedSpace,
            datetime_start: datesFilter.datetime_start,
            datetime_end: datesFilter.datetime_end,
        }),
        [limit, offset, selectedOffice, selectedFloor, selectedSpace, datesFilter]
    );

    const { treeData, office } = useOfficeFilters(params, selectedSpace);

    const { refetch: refetchAllMeetingRooms } = useAllMeetingRoomReservations(params, (data: any) => {
        setReserveMeetingRooms(data.results);
    });

    const { data: reservations, refetch: refetchReservations } = useReservations(params, () => {
        refetchAllMeetingRooms();
    });

    const handleFilterMeetingRoom = useCallback(() => {
        const filteredByOptions =
            office?.meeting_rooms.filter(
                (el) =>
                    (!switchFilter.has_conference_call || el.has_conference_call) &&
                    (!switchFilter.has_drawing_board || el.has_drawing_board) &&
                    (!switchFilter.has_multimedia_panel || el.has_multimedia_panel)
            ) ?? [];

        const filteredBySpaceId = selectedSpace
            ? filteredByOptions?.filter(({ work_space_id }) => work_space_id === +selectedSpace)
            : filteredByOptions;

        setFilteredMeetingRooms(filteredBySpaceId);
    }, [office, selectedSpace, switchFilter, reservations]);

    const handleSwitchFilter = (state: boolean, data: TSwitchValue) => {
        const newFilterData = { [data.value]: state };
        setSwitchFilter((prev) => ({ ...prev, ...newFilterData }));
    };

    const handleShowReservations = () => {
        refetchReservations();
    };

    const { mutate: reserveMeetingRoomMutation } = useReserveMeetingRoom(() => {
        setOpenMessage(true);
        setModalProps((prev) => ({ ...prev, type: "successBook" }));

        handleShowReservations();
    });

    const { mutate: cancelMeetingRoom } = useCancelMeetingRoom(() => {
        handleShowReservations();
    });

    const { mutate: updateMeetingRoom } = useUpdateMeetingRoom(() => {
        handleShowReservations();
        setOpenUpdateBookMeetingRoom(false);
    });

    const handleOpenMap = useCallback(async () => {
        handleShowReservations();

        setIsStartInterface(false);
    }, [office]);

    const handleMapToggle = async () => {
        await refetchReservations().then(() => setOpenReservations((prev) => !prev));
        setMapMode((prevMapMode) => !prevMapMode);
    };

    const handleOpenBookMeetingRoom = (meetingRoom: MeetingRoom) => {
        if (!filteredMeetingRooms) return;
        const current: MeetingRoom | undefined = Object.values(filteredMeetingRooms ?? {})
            .flat()
            .find((p: MeetingRoom) => p.id === meetingRoom.id);

        setCurrentMeetingRoom(current);
        setOpenBookMeetingRoom(true);
    };

    const handleSelectMeetingRoom = useCallback(
        (room_id: number) => {
            const requestData = {
                room_id,
                datetime_end: modalProps.datetime_end,
                datetime_start: modalProps.datetime_start,
                invited_users_set: modalProps.invited_users_set,
                meeting_subject: modalProps.meeting_subject,
            };
            reserveMeetingRoomMutation(requestData);
        },
        [modalProps, reserveMeetingRoomMutation]
    );

    const handleCancelMeetingRoom = useCallback(
        (target_id: number, id: number) => {
            cancelMeetingRoom({ target_id, id });
        },
        [cancelMeetingRoom]
    );

    const handleUpdateMeetingRoom = useCallback(
        (
            target_id: number,
            id: number,
            datetime_start: string,
            datetime_end: string,
            invited_users_set: number[],
            meeting_subject: string
        ) => {
            updateMeetingRoom({
                target_id,
                id,
                datetime_start,
                datetime_end,
                invited_users_set,
                meeting_subject,
            });
        },
        [updateMeetingRoom]
    );

    const cbModals = () => {
        if (modalProps.type === "confirmBook" && currentMeetingRoom?.id) {
            handleSelectMeetingRoom(currentMeetingRoom.id);
        } else if (modalProps.type === "confirmUpdateBook") {
            handleUpdateMeetingRoom(
                modalProps.target_id as number,
                modalProps.id as number,
                modalProps.datetime_start as string,
                modalProps.datetime_end as string,
                modalProps.invited_users_set as number[],
                modalProps.meeting_subject as string
            );
        } else if (modalProps.type === "cancelBook" && modalProps.target_id) {
            handleCancelMeetingRoom(modalProps.target_id as number, modalProps.id as number);
        } else if (modalProps.type === "successBook") {
            setOpenBookMeetingRoom(false);
        }
    };

    const handleOpenModals = async (arg: any) => {
        if (arg.type === "updateBookMeetingRoom") {
            const currentReserve = reservations?.current?.results.find(({ id, target_id }) =>
                arg.isMap ? arg.id === target_id : arg.id === id
            );

            if (currentReserve) {
                setCurrentReservation(currentReserve);
                setModalProps(arg);
                setOpenUpdateBookMeetingRoom(true);
            }

            return;
        } else if (arg.type === "cancelBook") {
            setModalProps(arg);
        } else if (arg.type === "confirmBook" || arg.type === "confirmUpdateBook") {
            setModalProps(arg);
        }

        setOpenMessage(true);
    };

    const handleSelectWorkSpace = (data: TSelectTreeNodeExtended) => {
        const current = treeData.find((node) => node.workspace_id === data.workspace_id);
        if (current) {
            setCurrentPlanImg(current.plan ? getFullUrl(current.plan) : null);
            setSelectedSpace(String(data.workspace_id));
            setSelectedOffice(String(data.office_id));
            setSelectedFloor(String(data.floor_id));
        }
    };

    useEffect(() => {
        handleFilterMeetingRoom();
    }, [office, switchFilter, selectedSpace]);

    useEffect(() => {
        if (!office || !filteredMeetingRooms || !selectedSpace || !reservations?.current) {
            setMapPoints([]);
            return;
        }

        const filteredIds = new Set(filteredMeetingRooms.map((d) => d.id));
        const reservedIds = new Set(reserveMeetingRooms?.map((el) => el.target_id) ?? []);
        const myReservedIds = new Set(reservations.current?.results.map((el) => el.target_id) ?? []);

        const points = office.meeting_rooms
            .filter(({ work_space_id }) => work_space_id === +selectedSpace)
            .filter(({ id }) => filteredIds.has(id))
            .map(({ id, center_x: x, center_y: y }) => ({
                id,
                x,
                y,
                free: filteredIds.has(id) && !reservedIds.has(id),
                myReserve: myReservedIds.has(id) && reservedIds.has(id),
            }));

        setMapPoints(points);
    }, [office, selectedSpace, filteredMeetingRooms, reserveMeetingRooms, reservations]);

    useEffect(() => {
        if (!filteredMeetingRooms.length) return;

        const handler = window.setTimeout(() => {
            refetchReservations();
        }, 100);

        return () => {
            window.clearTimeout(handler);
        };
    }, [datesFilter]);

    useEffect(() => {
        if (!selectedSpace) return;

        refetchAllMeetingRooms();
        refetchReservations();
        handleFilterMeetingRoom();
    }, [selectedSpace]);

    return (
        <IonContent>
            <div className={clsx(styles.meetingRoomPage, { [styles.flexCenter]: !filterOpen })}>
                <Filter
                    isOpen={filterOpen}
                    setIsOpen={setFilterOpen}
                    officesData={treeData}
                    selectedSpace={selectedSpace}
                    datesFilter={datesFilter}
                    setDatesFilter={setDatesFilter}
                    handleSelectWorkSpace={handleSelectWorkSpace}
                    dateTimeFilterLabel={dateTimeFilterLabel}
                    pushToRouteCache={pushToRouteCache}
                    switchItems={filterFields}
                    onChangeFilterSwitch={handleSwitchFilter}
                />
                <UpdateMeetingRoomModal
                    isOpen={openUpdateBookMeetingRoom}
                    onClose={() => setOpenUpdateBookMeetingRoom(false)}
                    currentReservation={currentReservation}
                    office={office}
                    cb={handleOpenModals}
                />
                <BookMeetingRoomNew
                    isOpen={openBookMeetingRoom}
                    onClose={() => setOpenBookMeetingRoom(false)}
                    meetingRoom={currentMeetingRoom}
                    datesFilter={datesFilter}
                    office={office}
                    cb={handleOpenModals}
                />
                <Modals
                    isOpen={openMessage}
                    onClose={() => setOpenMessage(false)}
                    modalProps={modalProps}
                    cbModals={cbModals}
                    reservationData={{
                        office,
                        datesFilter: {
                            datetime_start: modalProps.datetime_start,
                            datetime_end: modalProps.datetime_end,
                        },
                        meetingRoomTitle: (modalProps.title as string) ?? "",
                        currentReservation,
                        selectedFloor,
                    }}
                />
                {isStartInterface ? (
                    <WelcomeReservation
                        centerPosition={!filterOpen}
                        textFields={textFields.greeting_modal}
                        selectedSpace={selectedSpace}
                        datesFilter={datesFilter}
                        popoverText={textFields.popoverText}
                        onClick={handleOpenMap}
                    />
                ) : (
                    <>
                        <ReservationsMap
                            imageUrl={currentPlanImg}
                            onReservationClick={(type, value) =>
                                type === "create"
                                    ? handleOpenBookMeetingRoom(value)
                                    : handleOpenModals({ ...value, type: "updateBookMeetingRoom", isMap: true })
                            }
                            reservations={mapPoints}
                            handleMapToggle={handleMapToggle}
                        />
                        <MyMeetingRooms
                            isOpen={openReservations}
                            onClose={() => setOpenReservations(false)}
                            historyReservations={reservations?.historyReservation}
                            reservations={reservations?.current}
                            meetingRooms={filteredMeetingRooms}
                            reserveMeetingRooms={reserveMeetingRooms}
                            deleteMeetingRoom={() => {}}
                            onSelectMeetingRoom={handleOpenBookMeetingRoom}
                            cb={handleOpenModals}
                        />
                    </>
                )}
            </div>
        </IonContent>
    );
};
