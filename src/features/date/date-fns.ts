import { enUS, ru } from "date-fns/locale";

import type { Locale } from "date-fns/locale";

const LOCALES = {
    ru,
    en: enUS,
} as const;

type LocaleKey = keyof typeof LOCALES;

const getFnsLocale = (): Locale => {
    const browserLanguage = navigator.language;
    const languageCode = browserLanguage.split("-")[0] as LocaleKey;

    if (LOCALES[languageCode]) {
        return LOCALES[languageCode];
    }

    return LOCALES.en;
};

export const fnsFormats = {
    timeFormat: "kk:mm",
    timeFormatWithSecond: "kk:mm:ss",
    shortDateFormat: "dd.MM.yyyy",
    wideDateFormat: "dd.MM.yyyy, EEEE",
    dateMonthTime: "dd.MM, HH:mm",
};

export const fnsLocale = getFnsLocale();
