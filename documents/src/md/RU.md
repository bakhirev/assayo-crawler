#### Экспорт
1. Откройте Bitbucket или Gitlab на странице со списком репозиториев;
2. Раскройте группы, если нужные репозитории внутри (пункт для Gitlab);
3. Нажмите на закладку со скриптом;
4. Сохраните полученный файл;


#### Применение
Сприпт сохранил список репозиториев в формате "списка задач".

Вы можете сразу поставить его на обработку перетащив в окно бразера (если уже запустили сервис) или положить в ```node/configs/reports.json``` (если планируете запустить локально).

Обычно один отдел работает в рамках одной области (bitbucket) или группы (gitlab). Поэтому скрипт по умолчанию формирует одну задачу для всего списка, чтобы объединить логи в один отчёт по отделу. Вы можете разбить список на несколько лог файлов для разных отчётов, если хотите отделить frontend от backend или QA группы.

### Общие настройки

Настройки могут быть получены сразу из нескольких источников. Приоритет выбора окончательного значения:

1. Из внешнего источника;
2. Из переменной окружения;
3. Из файла.

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

### Настройка списка задач

Список задач может быть получен сразу из нескольких источников. Приоритет выбора окончательного значения:

1. Из внешнего источника;
2. Из файла.

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

### Пожелания, предложения, замечания
- telegramm [@bakhirev](https://t.me/bakhirev) (приоритетный способ связи)
- [alexey-bakhirev@yandex.ru](mailto:alexey-bakhirev@yandex.ru)
- сайт [https://bakhirev.github.io/](https://bakhirev.github.io/?ref=github&lang=ru)
