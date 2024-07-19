import React from 'react';

import { t } from 'ts/helpers/Localization';

import Area from './components/Area';
import styleArea from './styles/area.module.scss';
import style from './styles/index.module.scss';

function Welcome() {
  console.log(t('page.welcome.step1'));
  return (
    <section className={style.welcome}>
      <div className={style.welcome_row}>
        <h2 className={style.welcome_title}>
          Сервис сбора лог файлов из репозиториев
        </h2>
        <p className={style.welcome_description}>
          Он умеет скачивать репозитории и сохранять log файл в отдельную папку.
        </p>
        <div className={styleArea.welcome_area_wrapper}>
          <Area
            icon="./assets/cards/commits.png"
            title="%Перетащите% JSON файл с настройками работы сервиса."
            description="Пример файла можно скачать %тут%."
            link="https://ya.ru"
            onChange={() => {}}
          />
          <Area
            icon="./assets/cards/tasks.png"
            title="%Перетащите% JSON файл со списком заданий в эту область."
            description="Пример файла можно скачать %тут%."
            link="https://ya.ru"
            onChange={() => {}}
          />
        </div>
      </div>
    </section>
  );
}

export default Welcome;
