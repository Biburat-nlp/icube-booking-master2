import { useMutation, useQuery } from "react-query";

import type { TCurrentReservationsData } from "@/pages/LockersPage/types.ts";

import { lockersApi, lockersQueryKeys } from "@/features/booking/api/lockers";
import type { Cell } from "@/features/booking/api/lockers";
import type { TSelectedReservation } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types";

export const useReservations = (params: any, onSuccess?: () => void) => {
    return useQuery<TCurrentReservationsData>(
        [lockersQueryKeys.all, "reservations", params],
        async () => {
            const [resResult, histResult] = await Promise.all([
                lockersApi.getReservations({ datetime_start: new Date().toISOString() }),
                lockersApi.getHistoryReservations(params),
            ]);

            const usageRes: Usage[] | null = await lockersApi.getUsageLockers(
                params.space_id,
                "target_group",
                "office",
                params.datetime_start,
                params.datetime_end
            );

            const curUsage = usageRes?.find(({ group_id }) =>
                params.space_id ? group_id === +params.space_id : false
            );

            const freeCells = curUsage ? curUsage.all_count - curUsage.reserved_count : 0;

            return {
                current: resResult,
                historyReservation: histResult,
                usage: curUsage,
                freeCells,
            };
        },
        {
            enabled: false,
            onSuccess,
        }
    );
};

export const useCells = (params: any, selectedSpace: string | undefined, onSuccess?: () => void) => {
    return useQuery<Cell[]>(
        [lockersQueryKeys.all, "cells", params, selectedSpace],
        async () => {
            const cells: Cell[] | [] = await lockersApi.getCells(selectedSpace, params);
            return cells;
        },
        {
            enabled: false,
            onSuccess,
        }
    );
};

export const useReserveLocker = (
    params: any,
    selectedOffice: string | undefined,
    onSuccessCallback?: (data: any) => void
) => {
    return useMutation(
        async (lockerId: string) => {
            const updatedLockers: Cell[] = await lockersApi.reserveLocker(
                selectedOffice,
                lockerId,
                params.datetime_end,
                params.datetime_start
            );
            return updatedLockers;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => console.error(error),
        }
    );
};

export const useCancelLocker = (onSuccess?: (data: any) => void) => {
    return useMutation({
        mutationFn: (payload: { lockerId: string | number; cellId: string | number; reservationId: string | number }) =>
            lockersApi.cancelReservation(payload.lockerId, payload.cellId, payload.reservationId),
        onSuccess,
    });
};

export const useUpdateLocker = (onSuccess?: (data: any) => void) => {
    return useMutation(
        async ({ lockerId, cellId, reservationId, datetime_start, datetime_end }: TSelectedReservation) => {
            const updatedLockers: Cell[] = await lockersApi.updateReservation(
                lockerId,
                cellId,
                reservationId,
                datetime_start,
                datetime_end
            );
            return updatedLockers;
        },
        {
            onSuccess,
            onError: (error) => console.error(error),
        }
    );
};
