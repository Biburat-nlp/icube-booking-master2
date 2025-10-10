import { useIonViewWillEnter } from "@ionic/react";
import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { ReservaitionItem } from "@/pages/MyOfficePage/ui/ReservaitionItem/ReservaitionItem.tsx";
import { Modals } from "@/pages/MyOfficePage/ui/ReservationList/ui/Modals/Modals.tsx";

import { useCancelLocker, useUpdateLocker } from "@/features/booking/hooks/useLockers.ts";
import { useCancelMeetingRoom, useUpdateMeetingRoom } from "@/features/booking/hooks/useMeetingRooms.ts";
import { useCancelParking } from "@/features/booking/hooks/useParkings.ts";
import { useCancelWorkspace, useUpdateWorkspace } from "@/features/booking/hooks/useWorkspaces.ts";
import { useAllReservations } from "@/features/booking/model/hooks/useAllReservations.ts";
import type { TReservationItem, TSelectedReservation } from "@/features/booking/types/reservations.ts";
import type { TModalMessageProps } from "@/features/booking/ui/types.ts";

import { usePagination } from "@/shared/hooks/usePagination.ts";

type ResourceType = "lockers" | "meeting-room" | "parkings" | "workspace";
type ActionType = "cancel" | "update";

type MutationPayload = any;

export const ReservationList = () => {
    const location = useLocation();
    const { limit, offset } = usePagination({ rowsPerPage: 9999 });
    const params = useMemo(
        () => ({
            limit,
            offset,
            datetime_start: new Date().toISOString(),
        }),
        [limit, offset]
    );

    const { data, refetchAll, refetchByResource } = useAllReservations(params);

    const [selectedReservation, setSelectedReservation] = useState<TSelectedReservation | undefined>();
    const [openMessage, setOpenMessage] = useState<boolean>(false);
    const [modalProps, setModalProps] = useState<TModalMessageProps>({ type: "successBook" });

    const { mutate: cancelLocker } = useCancelLocker(() => {
        refetchByResource("lockers");
    });
    const { mutate: updateLocker } = useUpdateLocker(() => {
        refetchByResource("lockers");
    });
    const { mutate: cancelMeetingRoom } = useCancelMeetingRoom(() => {
        refetchByResource("meeting-rooms");
    });
    const { mutate: updateMeetingRoom } = useUpdateMeetingRoom(() => {
        refetchByResource("meeting-rooms");
        setOpenMessage(false);
    });

    const { mutate: cancelParking } = useCancelParking(() => {
        refetchByResource("parkings");
    });

    const { mutate: cancelWorkspace } = useCancelWorkspace(() => {
        refetchByResource("workspace");
    });
    const { mutate: updateWorkspace } = useUpdateWorkspace(() => {
        refetchByResource("workspace");
        setOpenMessage(false);
    });

    const mutationHandlers = useMemo(
        () => ({
            lockers: {
                cancel: (payload: MutationPayload) =>
                    cancelLocker({
                        lockerId: payload.locker_id,
                        cellId: payload.target_id,
                        reservationId: payload.id,
                    }),
                update: (payload: MutationPayload) =>
                    updateLocker({
                        lockerId: payload.locker_id,
                        cellId: payload.target_id,
                        reservationId: payload.id,
                        datetime_start: payload.datetime_start,
                        datetime_end: payload.datetime_end,
                    }),
            },
            "meeting-room": {
                cancel: (payload: MutationPayload) =>
                    cancelMeetingRoom({
                        target_id: payload.target_id,
                        id: payload.id,
                    }),
                update: (payload: MutationPayload) =>
                    updateMeetingRoom({
                        target_id: payload.target_id,
                        id: payload.id,
                        datetime_start: payload.datetime_start,
                        datetime_end: payload.datetime_end,
                        invited_users_set: payload.invited_users_set,
                        meeting_subject: payload.meeting_subject,
                    }),
            },
            parkings: {
                cancel: (payload: MutationPayload) =>
                    cancelParking({
                        reservationId: payload.reservationId,
                        id: payload.id,
                    }),
                update: () => {},
            },
            workspace: {
                cancel: (payload: MutationPayload) =>
                    cancelWorkspace({
                        reservationId: payload.reservationId,
                        id: payload.id,
                    }),
                update: (payload: MutationPayload) => {
                    updateWorkspace({
                        id: payload.target_id,
                        reservationId: payload.id,
                        datetime_start: payload.datetime_start,
                        datetime_end: payload.datetime_end,
                    });
                },
            },
        }),
        [
            cancelLocker,
            updateLocker,
            cancelMeetingRoom,
            updateMeetingRoom,
            cancelParking,
            cancelWorkspace,
            updateWorkspace,
        ]
    );

    const handleMutation = useCallback(
        (resource: ResourceType, action: ActionType, payload: MutationPayload) => {
            const actionHandler = mutationHandlers[resource]?.[action];
            if (actionHandler) {
                actionHandler(payload);
            }
        },
        [mutationHandlers]
    );

    const cbModals = (arg: any) => {
        if (!modalProps.id) return;

        if (modalProps.type === "cancelBook") {
            handleMutation(modalProps.moduleType as ResourceType, "cancel", { ...modalProps, ...arg });
        } else if (modalProps.type === "updateBook" && selectedReservation) {
            handleMutation(modalProps.moduleType as ResourceType, "update", {
                ...selectedReservation,
                datetime_start: arg.datetime_start,
                datetime_end: arg.datetime_end,
            });
        } else if (modalProps.type === "updateBookMeetingRoom") {
            handleMutation(modalProps.moduleType as ResourceType, "update", {
                ...arg,
                datetime_start: arg.datetime_start,
                datetime_end: arg.datetime_end,
            });
        }
    };

    const handleOpenModals = (arg: any, moduleType: ResourceType) => {
        if (arg.type === "updateBook" || arg.type === "updateBookMeetingRoom") {
            const selectedData = data.find(({ type }: TReservationItem) => type === moduleType);
            const curIdKey = moduleType === "workspace" ? arg.reservationId : arg.id;
            const selectedItem = selectedData?.results.find((item: any) => item.id === curIdKey);

            setSelectedReservation(selectedItem);
        }
        setModalProps({ ...arg, moduleType });
        setOpenMessage(true);
    };

    useIonViewWillEnter(() => {
        refetchAll();
    });

    return (
        <div>
            <Modals
                isOpen={openMessage}
                onClose={() => setOpenMessage(false)}
                modalProps={modalProps}
                cbModals={cbModals}
                reservationData={selectedReservation}
            />
            {data.map(({ results, nameBlock, Icon, type }: TReservationItem) => (
                <div
                    key={type}
                    style={{ width: "100%", height: "100%" }}
                >
                    <ReservaitionItem
                        results={results}
                        nameBlock={nameBlock}
                        Icon={Icon}
                        type={type}
                        cb={handleOpenModals}
                    />
                </div>
            ))}
        </div>
    );
};
