import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
export type DateTimeFilter = { datetime_start: string; datetime_end: string };

const nowIso = new Date().toISOString();

const initialDatesFilter: DateTimeFilter = {
    datetime_start: nowIso,
    datetime_end: addDays(nowIso, 1).toISOString(),
};

export const useFormattedDateTimeFilter = (dates: DateTimeFilter) => {
    const [datesFilter, setDatesFilter] = useState<DateTimeFilter>(dates);

    const dateTimeFilterLabel = useMemo(() => {
        const from = format(new Date(datesFilter.datetime_start), "dd.MM.yyyy");
        const to = format(new Date(datesFilter.datetime_end), "dd.MM.yyyy");
        return from === to ? from : `${from} — ${to}`;
    }, [datesFilter]);

    const mergedDateTimeInterval = useMemo(() => {
        return `${datesFilter.datetime_start}/${datesFilter.datetime_end}`;
    }, [datesFilter]);
    return {
        datesFilter,
        setDatesFilter,
        dateTimeFilterLabel,
        mergedDateTimeInterval,
    };
};
