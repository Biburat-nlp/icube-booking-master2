import { useMutation, useQuery } from "react-query";

import type { TCurrentReservationsData } from "@/pages/MeetingRoomsPage/types.ts";

import { parkingApi, parkingQueryKeys } from "@/features/booking/api/parking.ts";
import type { TParkingReservation } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types.ts";

export const useReservations = (params: any, onSuccess: (data: any) => void) => {
    return useQuery<TCurrentReservationsData>(
        [parkingQueryKeys.all, "my-office", params],
        async () => {
            const [resResult, histResult] = await Promise.all([
                parkingApi.getReservations({ datetime_start: new Date().toISOString() }),
                parkingApi.getHistoryReservations(params),
            ]);

            const usageRes: Usage[] | null = await parkingApi.getUsageParkings(
                params.office_id,
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

// Бронирование парковки
export const useReserveParking = (onSuccessCallback?: (data: any) => void) => {
    return useMutation(
        async (params: any) => {
            const result: TParkingReservation = await parkingApi.reserveParking(
                params.id,
                params.datetime_end,
                params.datetime_start,
                params.vehicle
            );
            return result;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => console.error(error),
        }
    );
};

// Отмена брони парковки
export const useCancelParking = (onSuccessCallback?: (data: any) => void) => {
    return useMutation(
        async (params: any) => {
            const result = await parkingApi.cancelReservation(params.id, params.reservationId);
            return result;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => console.error(error),
        }
    );
};
