# [Assayo](https://assayo.online/?ref=github-crawler&lang=ru)

Визуализация и анализ данных вашего git-репозитория ([демо](https://assayo.online/demo/?dump=./test.txt)).

В этом репозитории находится модуль для автоматического сбора и объединения логов для списка репозиториев.

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
3. [Log visualization UI](https://github.com/bakhirev/assayo) отображает отчёты. Для работы ему нужен файл лога.

<a name="link-"></a>
#### Алгоритм работы
1. Ожидание триггера запуска (таймер, запрос, событие);
2. Обход списка репозиториев;
3. Получение лог-файла для каждого репозитория;
4. Объединение логов в общие файлы;
5. Переход к пункту 1.

<a name="link-"></a>
#### Ресурсы необходимые приложению

В ходе работы скрипт загружает репозиторий для его обработки. Репозиторий может иметь большой вес. Доступные варианты работы:

- *Хранить репозитории между вызовами.* В этом случае расходуется много дискового пространства, но увеличивается скорость обхода списка задач и снижаются сетевые расходы для получения изменений в репозитории.
- *Удалять репозиторий сразу после получения лога.* При этом подходе требуется меньший объём дискового пространства, но необходимо заново скачивать весь репозиторий. Это увеличивает время обработки списка и объём сетевого трафика.

<a name="link-"></a>
### Как запустить?

<a name="link-"></a>
#### Запуск из исходников

1. Скачайте и установите [NodeJS](https://nodejs.org/en/download/current)
2. Клонируйте или скачайте этот репозиторий 
3. Установите зависимые пакеты ```npm install```
4. Поправьте общие настройки приложения в файле ```src/configs/app.json```
5. Поправьте список задач (а именно, список репозиториев для обработки) в файле ```/src/configs/tasks.json```
6. Перейдите в папку ```src/```
7. Выполните команду ```node index.js```

<a name="link-"></a>
#### Запуск Docker контейнера

1. Скачайте [Docker образ](https://hub.docker.com/r/bakhirev/assayo-crawler);
2. Поднимите его в локальной сети;

<a name="link-"></a>
### Общие настройки

Настройки могут быть получены сразу из нескольких источников. Приоритет выбора окончательного значения:

1. Из внешнего источника;
2. Из переменной окружения;
3. Из файла.

<a name="link-"></a>
#### Файл в папке ```src/configs/app.json``` (пример заполнения ```src/configs/example/app.json```)

| Свойство                     | Тип значения   | Значение по умолчание   | Описание                                                                 |
|------------------------------|----------------|-------------------------|--------------------------------------------------------------------------|
| `loadConfigFromUrl`          | `JSON`         |                         | Нужно запросить настройки из внешнего источника?                         |
| `loadConfigFromUrl.url`      | `string`       |                         | URL-адрес запроса.                                                       |
| `loadConfigFromUrl.method`   | `string`       |                         | Метод запроса.                                                           |
| `loadConfigFromUrl.headers`  | `JSON`         |                         | Заголовки запроса в виде json объекта.                                   |
| `loadConfigFromUrl.body`     | any            |                         | Тело запроса.                                                            |
| `loadTasksFromUrl`           | `JSON`         |                         | Нужно запросить список задач из внешнего источника?                      |
| `loadTasksFromUrl.url`       | `string`       |                         | URL-адрес запроса.                                                       |
| `loadTasksFromUrl.method`    | `string`       |                         | Метод запроса.                                                           |
| `loadTasksFromUrl.headers`   | `JSON`         |                         | Заголовки запроса в виде json объекта.                                   |
| `loadTasksFromUrl.body`      | any            |                         | Тело запроса.                                                            |
| `output.folder`              | `string`       | `"logs"`                | Папка, в которую будут складываться логи репозиториев после обработки.   |
| `output.needCreateAfterInit` | `boolean`      | `true`                  | Нужно создать эту папку в момент инициализации приложения.               |
| `input.folder`               | `string`       | `"repositories"`        | Папка, в которую будут загружаться репизитории указанные в списке задач. |
| `input.needCreateAfterInit`  | `boolean`      | `true`                  | Нужно создать эту папку в момент инициализации приложения.               |
| `input.needClearAfterUse`    | `boolean`      | `false`                 | Нужно очищать эту папку каждый раз после завершения сбора логов.         |

<a name="link-"></a>
#### Переменные окружения

| Свойство                        | Тип значения       | Значение по умолчание | Описание                                                                 |
|---------------------------------|--------------------|-----------------------|--------------------------------------------------------------------------|
| `PORT`                          | `number`           | `3007`                | Порт запуска приложения.                                                 |
| `LOAD_CONFIG_URL`               | `string`           |                       | URL-адрес для запроса для настроек приложения.                           |
| `LOAD_CONFIG_METHOD`            | `string`           |                       | Метод запроса.                                                           |
| `LOAD_CONFIG_HEADERS`           | `JSON`-like string |                       | Заголовки запроса в виде json объекта.                                   |
| `LOAD_CONFIG_BODY`              | any                |                       | Тело запроса.                                                            |
| `LOAD_TASKS_URL`                | `string`           |                       | URL-адрес для запроса списка задач.                                      |
| `LOAD_TASKS_METHOD`             | `string`           |                       | Метод запроса.                                                           |
| `LOAD_TASKS_HEADERS`            | `JSON`-like string |                       | Заголовки запроса в виде json объекта.                                   |
| `LOAD_TASKS_BODY`               | any                |                       | Тело запроса.                                                            |
| `OUTPUT_FOLDER`                 | `string`           | `"logs"`              | Папка, в которую будут складываться логи репозиториев после обработки.   |
| `OUTPUT_NEED_CREATE_AFTER_INIT` | `boolean`          | `true`                | Нужно создать эту папку в момент инициализации приложения.               |
| `INPUT_FOLDER`                  | `string`           | `"repositories"`      | Папка, в которую будут загружаться репизитории указанные в списке задач. |
| `INPUT_NEED_CREATE_AFTER_INIT`  | `boolean`          | `true`                | Нужно создать эту папку в момент инициализации приложения.               |
| `INPUT_NEED_CLEAR_AFTER_USE`    | `boolean`          | `false`               | Нужно очищать эту папку каждый раз после завершения сбора логов.         |

<a name="link-"></a>
### Настройки списка задач

Список задач может быть получен сразу из нескольких источников. Приоритет выбора окончательного значения:

1. Из внешнего источника;
2. Из файла.

<a name="link-3"></a>
#### Файл в папке ```src/configs/tasks.json``` (пример заполнения ```src/configs/example/tasks.json```)

| Свойство                           | Тип значения | Обязательный | Описание                                                                                                                          |
|------------------------------------|--------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------|
| `code`                             | `string`     | да           | Уникальный индентификатор. Используется в качестве названия итогового файла.                                                      |
| `folder`                           | `string`     | нет          | Дочерняя папка, в которую нужно поместить итоговый файл. По умолчанию файл помещается в папку указанную в общих настройках (output.folder) |
| `repositories[]`                   | `object[]`   | да           | Список репозиториев для обработки.                                                                                                |
| `repositories[].url`               | `string`     | да           | URL-адрес для загрузки репозитория.                                                                                               |
| `repositories[].folder`            | `string`     | нет          | Дочерняя папка, в которую нужно поместить репозиторий.                                                                            |
| `repositories[].needClearAfterUse` | `boolean`    | нет          | Нужно очищать эту папку каждый раз после завершения сбора логов.                                                                  |

### API

| Метод   | URL      | Тело ответа           | Описание                                          |
|---------|----------|-----------------------|---------------------------------------------------|
| `GET`   | `/start` | `{ message: string }` | Запустить обработку списка задач                  |
| `GET`   | `/check` | `{ message: string }` | Получить текущий статус приложения (health check) |

#### How to update the Docker image?
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
