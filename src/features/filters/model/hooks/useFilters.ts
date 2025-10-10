import { addDays } from "date-fns";
import { useEffect, useState } from "react";

import { useFormattedDateTimeFilter } from "@/shared/hooks/useFormattedDateTimeFilter";

export type DefaultRouteCache = {
    datetime_start?: string;
    datetime_end?: string;
    timeStartFilter?: string;
    timeEndFilter?: string;
    office?: string;
    floor?: string;
    space?: string;
};

const nowIso = new Date().toISOString();

export const useFilters = (
    routeCache: DefaultRouteCache | undefined,
    pushToRouteCache?: (value: Record<string, unknown>) => void
) => {
    const { datesFilter, dateTimeFilterLabel, mergedDateTimeInterval, setDatesFilter } = useFormattedDateTimeFilter({
        datetime_start: routeCache?.datetime_start ?? nowIso,
        datetime_end: routeCache?.datetime_end ?? addDays(nowIso, 1).toISOString(),
    });

    const [selectedSpace, setSelectedSpace] = useState<string | undefined>(routeCache?.space);
    const [selectedFloor, setSelectedFloor] = useState<string | undefined>(routeCache?.floor);
    const [selectedOffice, setSelectedOffice] = useState<string | undefined>(routeCache?.office);

    useEffect(() => {
        if (!pushToRouteCache || !selectedOffice) return;

        if (routeCache?.office !== selectedOffice) pushToRouteCache({ office_id: selectedOffice });
    }, [selectedOffice]);

    useEffect(() => {
        if (!pushToRouteCache || !selectedFloor) return;
        pushToRouteCache({ floor_id: selectedFloor });
    }, [selectedFloor]);

    useEffect(() => {
        if (!pushToRouteCache || !selectedSpace) return;
        pushToRouteCache({ space_id: selectedSpace });
    }, [selectedSpace]);

    return {
        selectedSpace,
        setSelectedSpace,
        selectedFloor,
        setSelectedFloor,
        selectedOffice,
        setSelectedOffice,
        datesFilter,
        setDatesFilter,
        dateTimeFilterLabel,
        mergedDateTimeInterval,
    };
};
