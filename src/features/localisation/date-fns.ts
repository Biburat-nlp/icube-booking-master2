import { enUS, ru } from "date-fns/locale";
import i18n from "i18next";

export const fnsFormats = {
    wideDateFormat: "EEEE, d MMMM yyyy",
    shortDateFormat: "dd.MM.yyyy",
    timeFormat: "HH:mm",
    dateTimeFormat: "dd.MM.yyyy HH:mm",
    monthYearFormat: "MMMM yyyy",
};

export const getFnsLocale = () => {
    const currentLanguage = i18n.language;
    
    switch (currentLanguage) {
        case "ru":
            return ru;
        case "en":
        default:
            return enUS;
    }
};


export const fnsLocale = getFnsLocale();