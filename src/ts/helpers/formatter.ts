export function getLangPrefix() {
  // @ts-ignore
  const code = window?.localization?.language || 'ru';
  return {
    ru: 'ru-RU',
    en: 'en-EN',
    zh: 'zh-ZH',
    es: 'es-ES',
    fr: 'fr-FR',
    pt: 'pt-PT',
    de: 'de-DE',
    ja: 'ja-JA',
  }[code] || 'ru-RU';
}

export function getDate(timestamp: string) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(getLangPrefix(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getDateWithTime(timestamp: string) {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(getLangPrefix(), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
