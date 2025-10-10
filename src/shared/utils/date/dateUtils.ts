import { intervalToDuration } from "date-fns";
import { setHours, setMinutes, setSeconds } from "date-fns";
import { ru } from "date-fns/locale";

import type { Duration, Interval } from "date-fns";
import type { Locale } from "date-fns/locale";

export function formatTimeDuration(interval: Interval, locale: Locale, limiter?: keyof Duration): string {
    const units: Array<keyof Duration> = ["years", "months", "weeks", "days", "hours", "minutes", "seconds"];
    const duration = intervalToDuration(interval);
    const currentLanguage = locale === ru ? "ru" : "en";

    const abbreviations = {
        ru: {
            years: "г.",
            months: "мес.",
            weeks: "нед.",
            days: "д.",
            hours: "ч.",
            minutes: "мин.",
            seconds: "сек.",
        },
        en: {
            years: "y",
            months: "mo",
            weeks: "w",
            days: "d",
            hours: "h",
            minutes: "m",
            seconds: "s",
        },
    };

    const parts: string[] = [];

    for (const unit of units) {
        const value = duration[unit];
        if (value && value > 0) {
            parts.push(`${value}${abbreviations[currentLanguage][unit]}`);
        }
        if (unit === limiter) break;
    }

    return parts.join(" ");
}

export const setTimeFromString = (date: Date, timeStr: string): Date => {
    const [hoursStr, minutesStr, secondsStr = "0"] = timeStr.split(":");
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
    let updatedDate = setHours(date, hours);
    updatedDate = setMinutes(updatedDate, minutes);
    updatedDate = setSeconds(updatedDate, seconds);
    return updatedDate;
};
