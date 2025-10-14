import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { ru_dictionary } from "@/features/localisation/dictionary/ru-RU";
import { en_dictionary } from "@/features/localisation/dictionary/en-US";

import type { PostProcessorModule } from "i18next";

const splitterPostProcessor: PostProcessorModule = {
    type: "postProcessor",
    name: "splitter",
    process: function (value: string, _key: string[], options: { [key: string]: any }) {
        if (options?.part !== undefined) {
            const parts = value.split("|").map((p) => p.trim());
            const index = Number(options.part);
            return parts[index] || value;
        }
        return value;
    },
};

const deviceLang = (typeof navigator !== "undefined" && navigator.language ? navigator.language : "").toLowerCase();
const initialLng = deviceLang.startsWith("ru") ? "ru" : "en";

i18n.use(splitterPostProcessor)
    .use(initReactI18next)
    .init({
        lng: initialLng,
        fallbackLng: "en",
        debug: false,
        keySeparator: ":",
        nsSeparator: false,
        defaultNS: "translation",
        interpolation: {
            escapeValue: false,
            prefix: "{",
            suffix: "}"
        },
        resources: {
            ru: { translation: ru_dictionary },
            en: { translation: en_dictionary },
        },
        postProcess: ["splitter"],
    });

export default i18n;
