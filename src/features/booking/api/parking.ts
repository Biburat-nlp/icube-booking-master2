import type { TParkingReservation, TReservationItem } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types.ts";

import { api } from "@/shared/api/api.ts";
import CarIcon from "@/shared/icons/CarIcon.svg?react";

export const parkingQueryKeys = {
    all: ["parkings"] as const,
    list: (params: any) => [...parkingQueryKeys.all, "list", params],
};

export const parkingApi = {
    getReservations: async (params: {
        datetime_start?: string;
        limit?: number;
        offset?: number;
    }): Promise<TReservationItem> => {
        const { data } = await api.get("/my-office/parkings", { params });
        return {
            ...data,
            nameBlock: "my_booking:tables:parking_places",
            Icon: CarIcon,
            type: "parking",
        };
    },

    getHistoryReservations: async (params: { limit: number; offset: number }): Promise<TReservationItem> => {
        const { data } = await api.get("/my-office/parkings/?within_date_range=true", {
            params: { limit: params.limit, offset: params.offset, datetime_end: new Date().toISOString() },
        });
        return { ...data, Icon: CarIcon, type: "parking" };
    },

    getUsageParkings: async (
        office_id: string | undefined,
        data_grouped_by: string,
        data_sliced_by: string,
        reserve_start: string,
        reserve_end: string
    ): Promise<Usage[]> => {
        const { data } = await api.post(`/parkings/office/${office_id}/parkings/usage/`, {
            data_grouped_by,
            data_sliced_by,
            reserve_start,
            reserve_end,
        });
        return data;
    },

    reserveParking: async (
        parkingId: string | undefined,
        datetime_end: string,
        datetime_start: string,
        vehicle: TParkingReservation["vehicle"]
    ): Promise<TParkingReservation> => {
        const { data } = await api.post(`/parkings/${parkingId}/reservations/`, {
            vehicle,
            reserve_end: datetime_end,
            reserve_start: datetime_start,
        });
        return data.results;
    },

    cancelReservation: async (parkingId: number, reservationId: number): Promise<void> => {
        await api.delete(`/parkings/${parkingId}/reservations/${reservationId}/`);
    },
};
