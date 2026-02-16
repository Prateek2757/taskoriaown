export const i18n = {
    defaultLocale: 'en-Au',
    locales: ['au', 'en-au'], 
  } as const;
  
  export type Locale = (typeof i18n)['locales'][number];