# [Assayo](https://assayo.online/?ref=github-crawler&lang=ru)

Вспомогательный модуль приложения для визуализации и анализа лог файлов git`а ([demo](https://assayo.online/demo/?ref=github&dump=./test.txt), [install](https://assayo.online/demo/?ref=github), [docker](https://hub.docker.com/r/bakhirev/assayo), [reddit](https://www.reddit.com/r/ITManagers/comments/1e5k291/the_visualization_and_analysis_of_git_commit/), [habr](https://habr.com/ru/articles/763342/)).

**Цель модуля:** автоматический сбор и объединение log файлов git`а.

**Проблемы, которые он решает:**
- автоматическое получение свежих логов по расписанию;
- просмотр объединенного лога по группе микросервисов;

### Содержание
- [Архитектура приложения](#link-)
  - [Алгоритм работы](#link-)
  - [Ресурсы необходимые приложению](#link-)
- [Как запустить?](#link-)
  - [Запуск из исходников](#link-)
  - [Запуск Docker контейнера](#link-)
- [Общие настройки](#link-)
  - [Json файл](#link-)
  - [Переменные окружения](#link-)
- [Настройки списка задач](#link-)
  - [Json файл](#link-)
- [API](#link-)
- [Контакты](#link-)

<a name="link-"></a>
### Архитектура приложения

<img src="https://raw.githubusercontent.com/bakhirev/assayo-crawler/12af4410fc93384cafb108a4429e43f9a874dbaa/schema.svg" width="70%" />

1. [Reports showcase UI](https://github.com/bakhirev/assayo-showcase) отображает список доступных отчётов. Каждый отчёт состоит из названия, описания и списка репозиториев.
2. [Crawler service](https://github.com/bakhirev/assayo-crawler) **(вы тут)** собирает логи репозиториев для отчёта.
3. [Log visualization UI](https://github.com/bakhirev/assayo) отображает отчёты. Для работы ему нужен лог файл.

<a name="link-"></a>
#### Алгоритм работы
1. Ожидание триггера запуска (таймер, запрос, событие);
2. Обход списка репозиториев;
3. Получение лог-файла для каждого репозитория;
4. Объединение логов в общие файлы;
5. Переход к пункту 1.

<a name="link-"></a>
#### Режимы работы

В ходе работы скрипт загружает репозиторий для его обработки. Репозиторий может иметь большой вес. Доступные варианты работы:

- *Хранить репозитории между вызовами.* В этом случае расходуется много дискового пространства, но увеличивается скорость ежедневного обхода списка задач и снижаются сетевые расходы для получения изменений в репозитории.
- *Удалять репозиторий сразу после получения лога.* При этом подходе требуется меньший объём дискового пространства, но необходимо заново скачивать весь репозиторий при каждом обходе. Это увеличивает время обработки списка и объём сетевого трафика.

### Как запустить?
#### Docker контейнер
В процессе своей работы сервис сохраняет данные. Т.к. в контейнере это сделать нельзя, вам нужно будет запустить Docker образ примонтировав к нему локальную папку.
- Создайте папку на диске. Сохраните её путь в формате ```/c/YouFolder``` (в примере указан формат для Windows пути типа ```C:/YouFolder```). Путь должен быть абсолютным.
- Вставьте полученый на первом шаге путь в команду: ```docker run --name assayo-crawler -p 80:80 --mount type=bind,source=/c/YouFolder,destination=/usr/src/assayo_crawler/input --mount type=bind,source=/c/YouFolder,destination=/usr/src/assayo_crawler/output -d assayo-crawler```;
- Скачайте [Docker образ](https://hub.docker.com/r/bakhirev/assayo-crawler) с Docker Hub.
- Запустите образ командой полученной на втором шаге. Обратите внимание на параметр source. Мы монтируем две папки (для логов и для репозиториев), но ссылаются они на одну и ту же C:/YouFolder. Вы можете это изменить, указав в команде разные папки для хранения логов и выгрузки репозиториев.
- По умолчанию сервис будет доступен по адресу ```localhost```
- Откройте его в браузере, чтобы убедиться, что контейнер запустился.
- Настроить параметры работы и список задач можно разными путями (переменные окружения, запрос к внешнему серверу, чтение из локального JSON файла и т.п.). Но самый простой способ: скачать примеры JSON файлов (по адресу ```http://localhost```, заполнить их и кинуть обратно в окно браузера.

<a name="link-"></a>
#### Из исходников

1. Скачайте и установите [NodeJS](https://nodejs.org/en/download/current)
2. Клонируйте или скачайте этот репозиторий 
3. Установите зависимые пакеты ```npm install```
4. Поправьте общие настройки приложения в файле ```src/configs/app.json```
5. Поправьте список задач (а именно, список репозиториев для обработки) в файле ```/src/configs/reports.json```
6. Выполните команду ```cd node && node index.js```

### Экспорт списка репозиториев из Bitbucket и Gitlab

#### Подготовка
Чтобы не выписывать руками URL адреса репозиториев, подготовим скрипт для парсинга страницы Bitbucket или Gitlab

1. Откройте новую вкладку;
2. Добавьте её в закладки;
3. Откройте свойства только что созданной закладки и вставьте в поле URL этот скрипт:

```javascript
javascript:(()=>{function getConfig(code, repositories) {return code && repositories.length? [{ code, folder: code, status: 1, repositories }]: [];}function getRepositories(selector, getUrl) {const elements=document.body.querySelectorAll(selector);return Array.from(elements).map((node)=>({url: getUrl(node),}));}function getConfigFromBitbucketPage() {const domain=location.origin;const code=location.pathname.toLowerCase().split('/').pop()||'';const repositories=getRepositories('.aui-iconfont-repository-small + .repository-name span',node=>[domain, '/scm/', code, '/', node.innerText, '.git'].join(''));return getConfig(code, repositories);}function getConfigFromGitlabPage() {const code=(location.pathname.split('/')?.[1]||'')?.replace(/-/gim, '_');const repositories=getRepositories('li[itemprop=owns] > div > a', node=>(node.href + '.git'));return getConfig(code, repositories);}function downloadForChrome(blob, suggestedName) {window.showSaveFilePicker({ suggestedName }).then(async (file)=>{const writable=await file.createWritable();await writable.write(blob);await writable.close();});}function downloadForAll(blob, filename) {const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download=filename;document.body.appendChild(a);a.click();setTimeout(function() {document.body.removeChild(a);window.URL.revokeObjectURL(url);}, 0);}function download(text, filename) {const blob=new Blob([text], { type: 'application/json' });if (window.navigator.msSaveOrOpenBlob) {window.navigator.msSaveOrOpenBlob(blob, filename);} else if (window.showSaveFilePicker) {downloadForChrome(blob, filename);} else {downloadForAll(blob, filename)}}function getFileName(code) {const defaultFileName=[code||'tasks', '.json'].join('');return window.showSaveFilePicker? defaultFileName: (prompt('File name for save?', defaultFileName)||defaultFileName);}const config=[...getConfigFromBitbucketPage(),...getConfigFromGitlabPage(),];const fileName=getFileName(config?.[0]?.code);download(JSON.stringify(config, 2, 2), fileName);})();
```
4. Сохраните изменения;


#### Экспорт
1. Откройте Bitbucket или Gitlab на странице со списком репозиториев;
2. Раскройте группы, если нужные репозитории внутри (пункт для Gitlab);
3. Нажмите на закладку со скриптом;
4. Сохраните полученный файл;


#### Применение
Сприпт сохранил список репозиториев в формате "списка задач".

Вы можете сразу поставить его на обработку перетащив в окно бразера (если уже запустили сервис) или положить в ```node/configs/reports.json``` (если планируете запустить локально).

Обычно один отдел работает в рамках одной области (bitbucket) или группы (gitlab). Поэтому скрипт по умолчанию формирует одну задачу для всего списка, чтобы объединить логи в один отчёт по отделу. Вы можете разбить список на несколько лог файлов для разных отчётов, если хотите отделить frontend от backend или QA группы.

<a name="link-"></a>
### Общие настройки

Настройки могут быть получены сразу из нескольких источников. Приоритет выбора окончательного значения:

1. Из внешнего источника;
2. Из переменной окружения;
3. Из файла.

<a name="link-"></a>
#### Файл в папке ```src/configs/app.json``` (пример заполнения ```public/assets/example/app.json```)

| Свойство                     | Тип значения | Значение по умолчание | Описание                                                                 |
|------------------------------|--------------|-----------------------|--------------------------------------------------------------------------|
| `canUpdateConfigFromUI`           | `boolean`    | true                  | Можно принимать настройки от UI?                                         |
| `loadConfigFromUrl`          | `JSON`       |                       | Нужно запросить настройки из внешнего источника?                         |
| `loadConfigFromUrl.url`      | `string`     |                       | URL-адрес запроса.                                                       |
| `loadConfigFromUrl.method`   | `string`     |                       | Метод запроса.                                                           |
| `loadConfigFromUrl.headers`  | `JSON`       |                       | Заголовки запроса в виде json объекта.                                   |
| `loadConfigFromUrl.body`     | any          |                       | Тело запроса.                                                            |
| `canUpdateTasksFromUI`            | `boolean`    | true                  | Можно принимать список задач от UI?                                      |
| `loadTasksFromUrl`           | `JSON`       |                       | Нужно запросить список задач из внешнего источника?                      |
| `loadTasksFromUrl.url`       | `string`     |                       | URL-адрес запроса.                                                       |
| `loadTasksFromUrl.method`    | `string`     |                       | Метод запроса.                                                           |
| `loadTasksFromUrl.headers`   | `JSON`       |                       | Заголовки запроса в виде json объекта.                                   |
| `loadTasksFromUrl.body`      | any          |                       | Тело запроса.                                                            |
| `output.folder`              | `string`     | `"logs"`              | Папка, в которую будут складываться логи репозиториев после обработки.   |
| `output.needCreateAfterInit` | `boolean`    | `true`                | Нужно создать эту папку в момент инициализации приложения.               |
| `input.folder`               | `string`     | `"repositories"`      | Папка, в которую будут загружаться репизитории указанные в списке задач. |
| `input.needCreateAfterInit`  | `boolean`    | `true`                | Нужно создать эту папку в момент инициализации приложения.               |
| `input.needRemoveAfterUse`    | `boolean`    | `false`               | Нужно очищать эту папку каждый раз после завершения сбора логов.         |

<a name="link-"></a>
#### Переменные окружения

| Свойство                        | Тип значения         | Значение по умолчание | Описание                                                                 |
|---------------------------------|----------------------|-----------------------|--------------------------------------------------------------------------|
| `PORT`                          | `number`             | `3007`                | Порт запуска приложения.                                                 |
| `LOAD_CONFIG_UI`                | `boolean`            |                       | Можно принимать настройки от UI.                                         |
| `LOAD_CONFIG_URL`               | `string`             | `true`                | URL-адрес для запроса для настроек приложения.                           |
| `LOAD_CONFIG_METHOD`            | `string`             |                       | Метод запроса.                                                           |
| `LOAD_CONFIG_HEADERS`           | `JSON` like `string` |                       | Заголовки запроса в виде json объекта.                                   |
| `LOAD_CONFIG_BODY`              | any                  |                       | Тело запроса.                                                            |
| `LOAD_REPORTS_UI`               | `boolean`            | `true`                | Можно принимать список задач от UI.                                      |
| `LOAD_REPORTS_URL`              | `string`             |                       | URL-адрес для запроса списка задач.                                      |
| `LOAD_REPORTS_METHOD`           | `string`             |                       | Метод запроса.                                                           |
| `LOAD_REPORTS_HEADERS`          | `JSON` like `string` |                       | Заголовки запроса в виде json объекта.                                   |
| `LOAD_REPORTS_BODY`             | any                  |                       | Тело запроса.                                                            |
| `OUTPUT_FOLDER`                 | `string`             | `"logs"`              | Папка, в которую будут складываться логи репозиториев после обработки.   |
| `OUTPUT_NEED_CREATE_AFTER_INIT` | `boolean`            | `true`                | Нужно создать эту папку в момент инициализации приложения.               |
| `INPUT_FOLDER`                  | `string`             | `"repositories"`      | Папка, в которую будут загружаться репизитории указанные в списке задач. |
| `INPUT_NEED_CREATE_AFTER_INIT`  | `boolean`            | `true`                | Нужно создать эту папку в момент инициализации приложения.               |
| `INPUT_NEED_CLEAR_AFTER_USE`    | `boolean`            | `false`               | Нужно очищать эту папку каждый раз после завершения сбора логов.         |

<a name="link-"></a>
### Настройка списка задач

Список задач может быть получен сразу из нескольких источников. Приоритет выбора окончательного значения:

1. Из внешнего источника;
2. Из файла.

<a name="link-3"></a>
#### Файл в папке ```src/configs/reports.json``` (пример заполнения ```public/assets/example/reports.json```)

| Свойство                            | Тип значения | Обязательный | Описание                                                                                                                          |
|-------------------------------------|--------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `code`                              | `string`     | да           | Уникальный индентификатор. Используется в качестве названия итогового файла.                                                      |
| `folder`                            | `string`     | нет          | Дочерняя папка, в которую нужно поместить итоговый файл. По умолчанию файл помещается в папку указанную в общих настройках (output.folder) |
| `repositories[]`                    | `object[]`   | да           | Список репозиториев для обработки.                                                                                                |
| `repositories[].url`                | `string`     | да           | URL-адрес для загрузки репозитория.                                                                                               |
| `repositories[].folder`             | `string`     | нет          | Дочерняя папка, в которую нужно поместить репозиторий.                                                                            |
| `repositories[].needRemoveAfterUse` | `boolean`    | нет          | Нужно очищать эту папку каждый раз после завершения сбора логов.                                                                  |

### API

| Метод  | URL                        | Тело ответа           | Описание                                          |
|--------|----------------------------|-----------------------|---------------------------------------------------|
| `GET`  | `/api/v1.0/start`          | `{ message: string }` | Запустить обработку списка задач                  |
| `GET`  | `/api/v1.0/stop`           | `{ message: string }` | Остановить обработку списка задач                 |
| `GET`  | `/api/v1.0/restart`        | `{ message: string }` | Пере-запустить обработку списка задач             |
| `POST` | `/api/v1.0/update/configs` | `{ message: string }` | Пере-запустить обработку списка задач             |
| `POST` | `/api/v1.0/update/reports` | `{ message: string }` | Пере-запустить обработку списка задач             |
| `GET`  | `/api/v1.0/get/status`     | `{ message: string }` | Пере-запустить обработку списка задач             |
| `GET`  | `/check`                   | `{ message: string }` | Получить текущий статус приложения (health check) |


### Как обновить?
#### Docker контейнер
- run ```npm run build```
- run ```docker build -t assayo-crawler .```
- visually check the image ```docker run --name assayo-crawler -p 80:80 --mount type=bind,source=/c/work/assayo-crawler/node/input,destination=/usr/src/assayo_crawler/input --mount type=bind,source=/c/work/assayo-crawler/node/output,destination=/usr/src/assayo_crawler/output -d assayo-crawler```;
- add tag ```docker tag assayo-crawler bakhirev/assayo-crawler:latest```;
- push image to [Docker Hub](https://hub.docker.com/r/bakhirev/assayo-crawler) ```docker push bakhirev/assayo-crawler:latest```;

<a name="link-"></a>
### Пожелания, предложения, замечания
- telegramm [@bakhirev](https://t.me/bakhirev) (приоритетный способ связи)
- [alexey-bakhirev@yandex.ru](mailto:alexey-bakhirev@yandex.ru)
- сайт [https://assayo.online/](https://assayo.online/?ref=github&lang=ru)
