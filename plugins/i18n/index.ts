'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import LanguageDetector from 'i18next-browser-languagedetector'
export const fallbackLng = 'fa'
export const languages = ['fa']
export const defaultNS = 'common'
i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) =>
        import(`./locales/${language}/${namespace}.json`)))
    .init({
        supportedLngs: languages,
        fallbackLng,
        fallbackNS: defaultNS,
        defaultNS,
        detection: {
            order: ['path', 'htmlTag', 'cookie', 'navigator'],
        }
    })

export default i18next