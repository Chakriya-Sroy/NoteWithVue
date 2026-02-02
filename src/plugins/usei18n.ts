import en from '@/locales/en';
import km from '@/locales/km';
import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: 'en', // Set default locale
  fallbackLocale: 'en', // Fallback locale if translation missing
  messages: {
    en,
    km
  }
})

export default i18n;