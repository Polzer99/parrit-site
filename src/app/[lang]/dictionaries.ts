import 'server-only';

import fr from './dictionaries/fr.json';
import en from './dictionaries/en.json';
import ptBR from './dictionaries/pt-BR.json';

export type Dictionary = typeof fr;

const dictionaries = {
  fr: () => Promise.resolve(fr as Dictionary),
  en: () => Promise.resolve(en as Dictionary),
  'pt-BR': () => Promise.resolve(ptBR as Dictionary),
};

export type Locale = keyof typeof dictionaries;

export const locales: Locale[] = ['fr', 'en', 'pt-BR'];
export const defaultLocale: Locale = 'fr';

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  'pt-BR': 'Português (BR)',
};

export const localeShortLabels: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
  'pt-BR': 'PT',
};

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
