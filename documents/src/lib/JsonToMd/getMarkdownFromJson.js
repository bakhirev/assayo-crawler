const custom = require('./custom');
const TableOfContent = require('./TableOfContent');

function addListWithPrefix(list, markdown, prefix = '') {
  (list || []).forEach((text, index) => {
    const code = prefix || `${(index + 1)}. `;
    if (text) markdown.push(`${code}${text}`);
  });
}

function addBlockCode(code, markdown) {
  markdown.push('```');
  markdown.push(code);
  markdown.push('```');
}

function addTable(list, markdown) {
  const header = list.shift();
  markdown.push(`|${header.join('|')}|`);
  markdown.push(`|${header.fill('--------').join('|')}|`);
  list.forEach((row) => {
    const formattedRow = row
      .map((c, i) => {
        if (c === 'JSON like string') return ('`JSON` like `string`');
        if (i < 2 && c || [
          'true',
          'false',
          '{ message: string }'
        ].includes(c)) return ('`' + c + '`');
        return c || ' ';
      })
      .join('|')
    markdown.push(`|${formattedRow}|`);
  });
}

function getMarkdownFromJson(json, languages, language) {
  const tableOfContent = new TableOfContent();
  const firstTag = (json || [])?.[0]?.warning ? json.shift() : null;
  let markdown = [
    custom.getLanguageLinks(languages, language),
    firstTag ? `> ${firstTag.warning}\n` : '',
    custom.getTitle(language),
  ];

  (json || []).forEach((tag, index) => {
    if (!tag) return;

    if (index === 1) {
      // markdown.push(custom.getSocialLinks());
      // markdown.push(custom.getSreenshot());
    }

    if (tag.p) markdown.push(`${tag.p}\n`);
    else if (tag.warning) markdown.push(`> ${tag.warning}\n`);
    else if (tag.tableOfContent) markdown.push('tableOfContent');
    else if (tag.li) addListWithPrefix(tag.li, markdown, '- ');
    else if (tag.ol) addListWithPrefix(tag.ol, markdown);
    else if (tag.pre) addBlockCode(tag.pre, markdown);
    else if (tag.table) addTable(tag.table, markdown);
    else if (tag.img) markdown.push(`${tag.img}\n`);
    else if (tag.h1) tableOfContent.addTitle(1, tag.h1, markdown);
    else if (tag.h2) tableOfContent.addTitle(2, tag.h2, markdown);
    else if (tag.h3) tableOfContent.addTitle(3, tag.h3, markdown);
    else if (tag.h4) tableOfContent.addTitle(4, tag.h4, markdown);
    else if (tag.h5) tableOfContent.addTitle(5, tag.h5, markdown);
  });

  // markdown.push(custom.getYandexMetrika());
  // markdown = tableOfContent.getMarkdownWithTable(markdown);

  markdownText = markdown
    .join('\n')
    .replace('demo/?dump=./test.txt', `demo/?ref=github&lang=${language}&dump=./test.txt`)
    .replace('online/demo)', `online/demo?ref=github&lang=${language})`);

  return markdownText;
}

module.exports = getMarkdownFromJson;
