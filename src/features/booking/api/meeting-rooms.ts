import type { AnyReservation, TReservationItem } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types.ts";

import { universalApi } from "@/shared/api/api.ts";
import OfficeIcon from "@/shared/icons/OfficeIcon.svg?react";

export const meetingRoomsQueryKeys = {
    all: ["meeting-rooms"] as const,
    list: (params: any) => [...meetingRoomsQueryKeys.all, "list", params],
};

export const meetingRoomsApi = {
    getReservations: async (params: {
        datetime_start?: string;
        limit?: number;
        offset?: number;
    }): Promise<TReservationItem> => {
        const { data } = await universalApi.get("/my-office/meeting-rooms/", params);
        return {
            ...data,
            nameBlock: "my_booking:tables:meeting_rooms",
            Icon: OfficeIcon,
            type: "meeting-room",
        };
    },

    getAllReservations: async (params: {
        datetime_start?: string;
        datetime_end?: string;
        limit?: number;
        offset?: number;
    }): Promise<{ results: AnyReservation[] }> => {
        const { data } = await universalApi.get(`/meeting-rooms/reservations/`, params);
        return { results: data.results };
    },

    getHistoryReservations: async (params: { limit: number; offset: number }): Promise<TReservationItem> => {
        const { data } = await universalApi.get("/my-office/meeting-rooms/?within_date_range=true", {
            limit: params.limit, 
            offset: params.offset, 
            datetime_end: new Date().toISOString()
        });
        return { ...data, Icon: OfficeIcon, type: "meeting-room" };
    },

    getUsageMeetingRoms: async (
        office_id: string | undefined,
        data_grouped_by = "target_group",
        data_sliced_by = "office",
        reserve_start: string,
        reserve_end: string
    ): Promise<Usage[]> => {
        const { data } = await universalApi.post(`/meeting-rooms/office/${office_id}/rooms/usage/`, {
            data_grouped_by,
            data_sliced_by,
            reserve_start,
            reserve_end,
        });
        return data;
    },

    reserveMeetingRoom: async (
        room_id: number | undefined,
        datetime_end: string,
        datetime_start: string,
        invited_users_set: number[],
        meeting_subject: string
    ): Promise<AnyReservation> => {
        const { data } = await universalApi.post(`/meeting-rooms/${room_id}/reservations/`, {
            reserve_end: datetime_end,
            reserve_start: datetime_start,
            // По умолчанию чекбокс "Создать ссылку для встречи(create_webinar)" false
            create_webinar: false,
            invited_users_set,
            meeting_subject,
        });
        return data.results;
    },

    updateReservation: async (
        roomId: string | number,
        reservationId: string | number,
        datetime_start: string | number,
        datetime_end: string | number,
        invited_users_set: number[],
        meeting_subject: string
    ): Promise<any> => {
        const { data } = await universalApi.patch(`/meeting-rooms/${roomId}/reservations/${reservationId}/`, {
            reserve_end: datetime_end,
            reserve_start: datetime_start,
            invited_users_set,
            meeting_subject,
        });
        return data.results;
    },

    cancelMeetingRoom: async (roomId: number, reservationId: number): Promise<void> => {
        await universalApi.delete(`/meeting-rooms/${roomId}/reservations/${reservationId}/`);
    },
};
