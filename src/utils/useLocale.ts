import { useI18n } from 'vue-i18n'

export const useLocale = () => {
  const { locale } = useI18n()

  const setLocale = (newLocale: 'en' | 'km') => {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  const toggleLocale = () => {
    const newLocale = locale.value === 'en' ? 'km' : 'en'
    setLocale(newLocale)
  }

  return {
    locale,
    setLocale,
    toggleLocale
  }
}