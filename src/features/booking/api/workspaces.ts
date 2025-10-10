import type { AnyReservation, TReservationItem } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types.ts";

import { universalApi } from "@/shared/api/api.ts";
import DeskIcon from "@/shared/icons/DeskIcon.svg?react";

export const workspacesQueryKeys = {
    all: ["desktops"] as const,
    list: (params: any) => [...workspacesQueryKeys.all, "list", params],
};

export const workspacesApi = {
    getReservations: async (params: {
        datetime_start?: string;
        limit?: number;
        offset?: number;
    }): Promise<TReservationItem> => {
        const { data } = await universalApi.get("/my-office/desktops", params);
        return {
            ...data,
            nameBlock: "my_booking:tables:workplaces",
            Icon: DeskIcon,
            type: "workspace",
        };
    },

    getAllReservations: async (params: {
        office_id: string;
        floor_id: string;
        space_id: string;
        datetime_start?: string;
        datetime_end?: string;
    }): Promise<TReservationItem> => {
        const { data } = await universalApi.get("/desktops/reservations", params);
        return data;
    },

    getHistoryReservations: async (params: { limit: number; offset: number }): Promise<TReservationItem> => {
        const { data } = await universalApi.get("/my-office/desktops/?within_date_range=true", {
            limit: params.limit, 
            offset: params.offset, 
            datetime_end: new Date().toISOString()
        });
        return { ...data, Icon: DeskIcon, type: "workspace" };
    },

    getUsageDesktops: async (
        office_id: string | undefined,
        data_grouped_by: string,
        data_sliced_by: string,
        reserve_start: string,
        reserve_end: string
    ): Promise<Usage[]> => {
        const { data } = await universalApi.post(`/desktops/office/${office_id}/desktops/usage/`, {
            data_grouped_by,
            data_sliced_by,
            reserve_start,
            reserve_end,
        });
        return data;
    },

    reserveWorkspace: async (
        workspaceId: number | undefined,
        datetime_end: string,
        datetime_start: string
    ): Promise<AnyReservation> => {
        const { data } = await universalApi.post(`/desktops/${workspaceId}/reservations/`, {
            reserve_end: datetime_end,
            reserve_start: datetime_start,
        });
        return data.results;
    },

    updateReservation: async (
        workspaceId: string | number,
        reservationId: string | number,
        datetime_start: string | number,
        datetime_end: string | number
    ): Promise<any> => {
        const { data } = await universalApi.patch(`/desktops/${workspaceId}/reservations/${reservationId}/`, {
            reserve_end: datetime_end,
            reserve_start: datetime_start,
        });
        return data.results;
    },

    cancelReservation: async (workplaceId: number, reservationId: number): Promise<void> => {
        await universalApi.delete(`/desktops/${workplaceId}/reservations/${reservationId}/`);
    },
};
