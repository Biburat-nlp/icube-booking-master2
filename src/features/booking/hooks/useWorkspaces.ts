import { useMutation, useQuery } from "react-query";

import type { TCurrentReservationsData } from "@/pages/MeetingRoomsPage/types.ts";

import { workspacesApi, workspacesQueryKeys } from "@/features/booking/api/workspaces.ts";

import type { Usage } from "@/entities/offices/types.ts";

export const useReservations = (params: any, onSuccess: (data: any) => void) => {
    return useQuery<TCurrentReservationsData>(
        [workspacesQueryKeys.all, "my-office", params],
        async () => {
            const [resResult, histResult] = await Promise.all([
                workspacesApi.getReservations({ datetime_start: new Date().toISOString() }),
                workspacesApi.getHistoryReservations(params),
            ]);

            const usageRes: Usage[] | null = await workspacesApi.getUsageDesktops(
                params.office_id,
                "floor",
                "office",
                params.datetime_start,
                params.datetime_end
            );

            const curUsage = usageRes?.find(({ group_id }) =>
                params.office_id ? group_id === +params.office_id : false
            );

            const allReservations = await workspacesApi.getAllReservations({
                office_id: params.office_id,
                floor_id: params.floor_id,
                space_id: params.space_id,
                datetime_start: params.datetime_start,
                datetime_end: params.datetime_end,
            });

            const result = {
                current: resResult,
                historyReservation: histResult,
                usage: curUsage,
                all: allReservations.results,
            };
            
            console.log('useReservations result:', result);
            console.log('usage data:', curUsage);
            console.log('all reservations:', allReservations.results);
            
            return result;
        },
        {
            enabled: false,
            onSuccess,
        }
    );
};

// Бронирование рабочего места
export const useReserveWorkspace = (onSuccessCallback?: (data: any) => void) => {
    return useMutation(
        async (params: any) => {
            const result = await workspacesApi.reserveWorkspace(params.id, params.datetime_end, params.datetime_start);
            return result;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => console.error(error),
        }
    );
};

// Обновление дат рабочего места
export const useUpdateWorkspace = (onSuccessCallback?: (data: any) => void) => {
    return useMutation(
        async (params: any) => {
            const result = await workspacesApi.updateReservation(
                params.id,
                params.reservationId,
                params.datetime_start,
                params.datetime_end
            );
            return result;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => console.error(error),
        }
    );
};

// Отмена брони рабочего места
export const useCancelWorkspace = (onSuccessCallback?: (data: any) => void) => {
    return useMutation(
        async (params: any) => {
            const result = await workspacesApi.cancelReservation(params.id, params.reservationId);
            return result;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => console.error(error),
        }
    );
};
