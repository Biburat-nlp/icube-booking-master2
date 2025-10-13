import type { TReservationItem } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types.ts";

import { api } from "@/shared/api/api.ts";
import TilesIcon from "@/shared/icons/TilesIcon.svg?react";

export const lockersQueryKeys = {
    all: ["lockers"] as const,
    list: (params: any) => [...lockersQueryKeys.all, "list", params],
};

export const myOfficeQueryKeys = {
    all: ["my-office"] as const,
    list: (params: any) => [...myOfficeQueryKeys.all, "list", params],
};

export type Cell = {
    id: number;
    board_address: number;
    cell_height: number;
    cell_number: string;
    cell_width: number;
    created_at: string;
    lock_port: number;
    lock_status: 0 | 1;
    locker: number;
    ordering: number;
    status: string;
    updated_at: string;
    position_x: number;
    position_y: number;
    target_title: string;
};

export const lockersApi = {
    getReservations: async (params: { datetime_start?: string }): Promise<TReservationItem> => {
        const { data } = await api.get("/my-office/cells/", { params });
        return {
            ...data,
            nameBlock: "my_booking:tables:lockers",
            Icon: TilesIcon,
            type: "lockers",
        };
    },

    getHistoryReservations: async (params: { limit: number; offset: number }): Promise<TReservationItem> => {
        const { data } = await api.get("/my-office/cells/?within_date_range=true", {
            params: { limit: params.limit, offset: params.offset, datetime_end: new Date().toISOString() },
        });
        return { ...data, Icon: TilesIcon, type: "lockers" };
    },

    getCells: async (
        space_id: string | undefined,
        params: {
            limit: number;
            offset: number;
        }
    ): Promise<Cell[]> => {
        const { data } = await api.get(`/lockers/${space_id}/cells/`, { params });
        return data.results;
    },

    getUsageLockers: async (
        office_id: string | undefined,
        data_grouped_by = "target_group",
        data_sliced_by = "office",
        reserve_start: string,
        reserve_end: string
    ): Promise<Usage[]> => {
        const { data } = await api.post(`/lockers/office/${office_id}/lockers/usage/`, {
            data_grouped_by,
            data_sliced_by,
            reserve_start,
            reserve_end,
        });
        return data;
    },

    reserveLocker: async (
        office_id: string | undefined,
        cell: string | number,
        datetime_end: string,
        datetime_start: string
    ): Promise<Cell[]> => {
        const { data } = await api.post(`/lockers/${office_id}/cells/${cell}/reservations/`, {
            reserve_end: datetime_end,
            reserve_start: datetime_start,
        });
        return data.results;
    },

    updateReservation: async (
        locker_id: string | number,
        cell: string | number,
        id: string | number,
        datetime_start: string | number,
        datetime_end: string | number
    ): Promise<Cell[]> => {
        const { data } = await api.patch(`/lockers/${locker_id}/cells/${cell}/reservations/${id}/`, {
            reserve_end: datetime_end,
            reserve_start: datetime_start,
        });
        return data.results;
    },

    cancelReservation: async (
        lockerId: string | number,
        cellId: string | number,
        reservationId: string | number
    ): Promise<void> => {
        await api.delete(`/lockers/${lockerId}/cells/${cellId}/reservations/${reservationId}/`);
    },
};
