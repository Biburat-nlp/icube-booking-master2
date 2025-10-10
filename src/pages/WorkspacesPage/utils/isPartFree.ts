import type { AnyReservation } from "@/features/booking/types/reservations.ts";

import type { DateTimeFilter } from "@/shared/hooks/useFormattedDateTimeFilter.ts";

export function isPartFree(range: DateTimeFilter, res?: AnyReservation): boolean {
    if (!res) return false;

    const selStart = new Date(range.datetime_start).getTime();
    const selEnd = new Date(range.datetime_end).getTime();
    const resStart = new Date(res.reserve_start).getTime();
    const resEnd = new Date(res.reserve_end).getTime();

    const [h1, m1, s1] = res.reserved_by_user.work_day_start.split(":").map(Number);
    const [h2, m2, s2] = res.reserved_by_user.work_day_end.split(":").map(Number);

    const MS_DAY = 24 * 60 * 60 * 1000;
    let occupied = 0;

    // Перебираем дни от начала выбора до конца
    for (
        let day = new Date(range.datetime_start).setHours(0, 0, 0, 0);
        day <= new Date(range.datetime_end).setHours(0, 0, 0, 0);
        day += MS_DAY
    ) {
        const workStart = new Date(day);
        workStart.setHours(h1, m1, s1, 0);
        const workEnd = new Date(day);
        workEnd.setHours(h2, m2, s2, 0);

        // зона занятости: пересечение рабочего окна и резервации
        const occStart = Math.max(workStart.getTime(), resStart);
        const occEnd = Math.min(workEnd.getTime(), resEnd);
        if (occEnd <= occStart) continue;

        // пересечение с выбранным диапазоном
        const segStart = Math.max(occStart, selStart);
        const segEnd = Math.min(occEnd, selEnd);
        if (segEnd > segStart) {
            occupied += segEnd - segStart;
        }
    }

    const total = selEnd - selStart;
    return occupied > 0 && occupied < total;
}
