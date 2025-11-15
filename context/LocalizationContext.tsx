import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { locales } from '../i18n/locales';

type Language = 'en' | 'es' | 'ru';

interface LocalizationContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('ru');

    const t = useCallback((key: string): string => {
        const keys = key.split('.');
        let result: any = locales[language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                return key;
            }
        }
        return result || key;
    }, [language]);

    return (
        <LocalizationContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LocalizationContext.Provider>
    );
};

export const useLocalization = (): LocalizationContextType => {
    const context = useContext(LocalizationContext);
    if (context === undefined) {
        throw new Error('useLocalization must be used within a LocalizationProvider');
    }
    return context;
};