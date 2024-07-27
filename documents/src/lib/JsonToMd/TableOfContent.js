const SMILES = [
  null, // Содержание
  null, // Архитектура приложения
  '📐', // Алгоритм работы
  '🏭', // Режимы работы
  '🚀', // Как запустить?
  null, // Docker контейнер
  null, // Из исходников
  '📤', // Экспорт списка репозиториев из Bitbucket и Gitlab
  null, // Подготовка
  null, // Экспорт
  null, // Применение
  '🛠️', // Общие настройки
  null, // Файл в папке ```src/configs/app.json``` (пример заполнения ```public/assets/example/app.json```)
  null, // Переменные окружения
  '📝', // Настройка списка задач
  null, // Файл в папке ```src/configs/reports.json``` (пример заполнения ```public/assets/example/reports.json```)
  '👨‍💻', // API
  null, // Как обновить?
  null, // Docker контейнер
  '📧', // Пожелания, предложения, замечания

  '‍👨‍💼', // 2
  '👑', // 3
  '‍🎭', // 6
  '📤', // 7
  '📈', // 10
  '🏭', // 13
  '🗃️', // 14
  '🎨', // 15
  '📝', // 16
  '👮', // 17
  '📚', // 20
  '🛠️', // 23
  '🈯', // 29
  '🗺️', // 30
];

class TableOfContent {
  constructor() {
    this.prefixes = (new Array(6)).fill(1).map((a, i) => (new Array(i)).fill('#').join(''));
    this.smiles = SMILES;
    this.titles = [];
    this.indexOfList = 0;
  }

  addTitle(level, text, markdownText) {
    this.titles.push({ level, text });
    const index = this.titles.length - 1;
    markdownText.push(`<a name="link-${index}"></a>`);
    const prefix = this.prefixes[level] || '';
    const smile = this.smiles[index] || '';
    markdownText.push(`${prefix} ${smile} ${text}`);

    // маркер, где будет Содержание
    if (!this.indexOfList && level === 3) {
      this.indexOfList = markdownText.length;
    }
  }

  getMarkdownWithTable(markdownText) {
    const content = this.titles
      .map(({ level, text }, i) => {
        if (!(level === 3 || level === 4) || i === 3) return;
        const prefix = level === 4 ? '  ' : '';
        const title = text.replace(/(\([^)]*\))|([\[\]`]*)/gim, '');
        return `${prefix}- [${title}](#link-${i})`;
      })
      .filter(v => v);

    return [
      ...markdownText.slice(0, this.indexOfList),
      ...content,
      ...markdownText.slice(this.indexOfList),
    ];
  }
}

module.exports = TableOfContent;
