export const translations = {
    de: {
        settings: "Einstellungen",
        language: "Sprache",
        german: "Deutsch",
        russian: "Russisch",
        anonymization: "Automatisierte Anonymisierung",
        anonymizationDescription: "Maskiert automatisch Namen und sensible Identifikatoren in allen generierten Berichten, Analyseergebnissen und der Historie.",
    },
    ru: {
        settings: "Настройки",
        language: "Язык",
        german: "Немецкий",
        russian: "Русский",
        anonymization: "Автоматическая анонимизация",
        anonymizationDescription: "Автоматически маскирует имена и конфиденциальные идентификаторы во всех сгенерированных отчетах, результатах анализа и истории.",
    }
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.de;

export const t = (key: TranslationKey, lang: Language): string => {
    return translations[lang][key] || key;
};
