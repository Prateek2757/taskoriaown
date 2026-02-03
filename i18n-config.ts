export const i18n = {
    defaultLocale: 'au',
    locales: ['au', 'en-au', 'fr'], 
  } as const;
  
  export type Locale = (typeof i18n)['locales'][number];