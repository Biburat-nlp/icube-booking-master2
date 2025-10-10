import type { TReservationItem } from "@/features/booking/types/reservations.ts";

import type { Usage } from "@/entities/offices/types.ts";

export type TCurrentReservationsData = {
    current: TReservationItem | undefined;
    historyReservation: TReservationItem | undefined;
    usage: Usage | undefined;
    all?: TReservationItem["results"] | undefined;
};
