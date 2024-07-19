import IHashMap from 'ts/interfaces/HashMap';
import localization from 'ts/helpers/Localization';

function getParametersFromString(text: string): IHashMap<string> {
  return Object.fromEntries((text || '')
    .substring(1, Infinity)
    .split('&')
    .map((token: string) => token.split('=')));
}

function getParametersFromURL(): IHashMap<string> {
  const parameters = {
    ...getParametersFromString(window.location.search),
    ...getParametersFromString(window.location.hash),
  };
  delete parameters[''];
  return parameters;
}

function loadCssFile(url: string) {
  const node = document.createElement('link');
  node.setAttribute('rel', 'stylesheet');
  node.setAttribute('href', url);
  document.body.appendChild(node);
}

export let applicationHasCustom = {
  theme: false,
  title: false,
};

export default function applyUrlCommands(callback: Function) {
  const parameters: IHashMap<string> = getParametersFromURL();

  const cssUrl = parameters.style || parameters.theme;
  if (cssUrl) {
    loadCssFile(cssUrl);
    applicationHasCustom.theme = true;
  }

  const language = parameters.lang || parameters.language;
  if (language) {
    localization.language = language;
  }

  callback(parameters);
}
