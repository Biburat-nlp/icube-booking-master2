import { useMutation, useQuery } from "react-query";

import type { TCurrentReservationsData } from "@/pages/MeetingRoomsPage/types.ts";

import { meetingRoomsApi, meetingRoomsQueryKeys } from "@/features/booking/api/meeting-rooms.ts";
import type { AnyReservation } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types";

export const useReservations = (params: any, onSuccess: () => void) => {
    return useQuery<TCurrentReservationsData>(
        [meetingRoomsQueryKeys.all, "my-office", params],
        async () => {
            const [resResult, histResult] = await Promise.all([
                meetingRoomsApi.getReservations({ datetime_start: new Date().toISOString() }),
                meetingRoomsApi.getHistoryReservations(params),
            ]);

            const usageRes: Usage[] | null = await meetingRoomsApi.getUsageMeetingRoms(
                params.space_id,
                "floor",
                "office",
                params.datetime_start,
                params.datetime_end
            );

            const curUsage = usageRes?.find(({ group_id }) =>
                params.floor_id ? group_id === +params.floor_id : false
            );

            return {
                current: resResult,
                historyReservation: histResult,
                usage: curUsage,
            };
        },
        {
            enabled: false,
            onSuccess,
        }
    );
};

export const useAllMeetingRoomReservations = (params: any, onSuccess?: (data: any) => void) => {
    return useQuery<{ results: AnyReservation[] }>(
        [meetingRoomsQueryKeys.all, "meeting-rooms", params],
        async () => {
            const currentReservations = await meetingRoomsApi.getAllReservations(params);

            return currentReservations;
        },
        {
            enabled: false,
            onSuccess,
        }
    );
};

// Бронирование переговорной
export const useReserveMeetingRoom = (onSuccessCallback?: (data: any) => void) => {
    return useMutation(
        async (data: any) => {
            const reservedRoom: AnyReservation = await meetingRoomsApi.reserveMeetingRoom(
                data.room_id,
                data.datetime_end,
                data.datetime_start,
                data.invited_users_set,
                data.meeting_subject
            );
            return reservedRoom;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => console.error(error),
        }
    );
};

// Удаление брони переговорной
export const useCancelMeetingRoom = (onSuccess?: (data: any) => void) => {
    return useMutation(
        async (payload: { target_id: number; id: number }) => {
            const response: any = await meetingRoomsApi.cancelMeetingRoom(payload.target_id, payload.id);
            return response;
        },
        {
            onSuccess,
            onError: (error) => console.log(error),
        }
    );
};

export const useUpdateMeetingRoom = (onSuccess?: (data: any) => void) => {
    return useMutation(
        async (payload: {
            target_id: number;
            id: number;
            datetime_start: string;
            datetime_end: string;
            invited_users_set: number[];
            meeting_subject: string;
        }) => {
            const updatedRoom: any = await meetingRoomsApi.updateReservation(
                payload.target_id,
                payload.id,
                payload.datetime_start,
                payload.datetime_end,
                payload.invited_users_set,
                payload.meeting_subject
            );
            return updatedRoom;
        },
        {
            onSuccess,
            onError: (error) => console.error(error),
        }
    );
};
