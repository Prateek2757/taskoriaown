export const i18n = {
    defaultLocale: 'en-au',
    locales: ['au', 'en-au'], 
  } as const;
  
  export type Locale = (typeof i18n)['locales'][number];