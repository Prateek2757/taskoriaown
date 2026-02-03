export const i18n = {
    defaultLocale: 'au',
    locales: ['au', 'en-AU', 'fr'], 
  } as const;
  
  export type Locale = (typeof i18n)['locales'][number];