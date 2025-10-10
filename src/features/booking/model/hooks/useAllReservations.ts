import { useQueries } from "react-query";

import { lockersApi } from "@/features/booking/api/lockers.ts";
import { meetingRoomsApi } from "@/features/booking/api/meeting-rooms.ts";
import { parkingApi } from "@/features/booking/api/parking.ts";
import { workspacesApi } from "@/features/booking/api/workspaces.ts";
import type { TReservationItem } from "@/features/booking/types/reservations.ts";

type TParams = {
    limit: number;
    offset: number;
    datetime_start: string;
};

type ReservationQueryDefinition = {
    resource: "lockers" | "meeting-rooms" | "parkings" | "workspace";
    queryKey: any[];
    queryFn: () => Promise<TReservationItem>;
};

export const useAllReservations = (params: TParams) => {
    const reservationQueryDefinitions: ReservationQueryDefinition[] = [
        {
            resource: "lockers",
            queryKey: ["lockers", params],
            queryFn: () => lockersApi.getReservations(params),
        },
        {
            resource: "meeting-rooms",
            queryKey: ["meeting-rooms", params],
            queryFn: () => meetingRoomsApi.getReservations(params),
        },
        {
            resource: "parkings",
            queryKey: ["parkings", params],
            queryFn: () => parkingApi.getReservations(params),
        },
        {
            resource: "workspace",
            queryKey: ["workspace", params],
            queryFn: () => workspacesApi.getReservations(params),
        },
    ];

    const queryResults = useQueries(
        reservationQueryDefinitions.map((def) => ({
            queryKey: def.queryKey,
            queryFn: def.queryFn,
        }))
    );

    const queries = queryResults.map((result, i) => ({
        ...result,
        resource: reservationQueryDefinitions[i].resource,
    }));

    const isLoading = queries.some((query) => query.isLoading);
    const isError = queries.some((query) => query.isError);
    const errors = queries.map((query) => query.error).filter(Boolean);

    const data = queries.flatMap((query) => (query.data ? [query.data] : [])) as TReservationItem[];

    const refetchAll = () => queries.forEach((query) => query.refetch());

    const refetchByResource = (resourceKey: "lockers" | "meeting-rooms" | "parkings" | "workspace") => {
        const query = queries.find((q) => q.resource === resourceKey);

        if (query) {
            query.refetch();
        }
    };

    return {
        data,
        errors,
        isLoading,
        isError,
        refetchAll,
        refetchByResource,
    };
};
