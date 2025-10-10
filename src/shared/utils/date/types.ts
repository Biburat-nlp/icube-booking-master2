import type { Duration } from "date-fns";

export type TFilteredDuration = {
    [key in keyof Duration]: number;
};
