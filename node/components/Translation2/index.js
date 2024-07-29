const translation = {
  en: require('./translations/en.json'),
  ru: require('./translations/ru.json')
}

function getTranslation(koaContext) {
  let lang = 'en';

  const languages = koaContext.request.acceptsLanguages();
  if (Array.isArray(languages)) {
    lang = languages.find((code) => translation[code])
  } else if (typeof languages === 'string') {
    lang = translation[languages] ? languages : lang;
  }

  return (key) => {
    return translation[lang][key] || translation.en[key] || key;
  }
}

module.exports = getTranslation;
