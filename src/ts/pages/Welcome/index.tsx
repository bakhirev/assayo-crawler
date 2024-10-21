import React from 'react';

import { t } from 'ts/helpers/Localization';

import Screen from './components/Screen';
import Area from './components/Area';
import Bitbucket from './components/Bitbucket';
import Player from './components/Player';

import styleArea from './styles/area.module.scss';
import style from './styles/index.module.scss';
import textStyle from './styles/text.module.scss';

function Welcome() {
  console.log(t('page.welcome.step1'));
  return (
    <>
      <Player />
      <Screen>
        <h2 className={`${style.welcome_title} ${textStyle.welcome_text_l}`}>
          Сервис сбора лог файлов из репозиториев
        </h2>
        <p className={`${style.welcome_description} ${textStyle.welcome_text_m}`}>
          Он умеет скачивать репозитории и сохранять log файл в отдельную папку.
        </p>
        <div className={styleArea.welcome_area_wrapper}>
          <Area
            icon="./assets/cards/commits.png"
            title="%Перетащите% JSON файл с настройками работы сервиса в эту область."
            description="Пример файла можно скачать %тут%."
            link="/assets/example/app.json"
            onChange={() => {
            }}
          />
          <Area
            icon="./assets/cards/tasks.png"
            title="%Перетащите% JSON файл со списком заданий в эту область."
            description="Пример файла можно скачать %тут%."
            link="/assets/example/reports.json"
            onChange={() => {
              console.log('x');
            }}
          />
        </div>
      </Screen>

      <Screen>
        <h2 className={`${style.welcome_title} ${textStyle.welcome_text_l}`}>
          У вас микросервисная архитектура?
          <br/>
          Работа ведется в нескольких репозиториях?
        </h2>
        <p className={`${style.welcome_description} ${textStyle.welcome_text_m}`}>
          Экспорт списка репозиториев из вашей системы
        </p>
        <Bitbucket/>
      </Screen>
    </>
  );
}

export default Welcome;
