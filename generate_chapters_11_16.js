const fs = require('fs');

// 读取v2数据
const db = JSON.parse(fs.readFileSync('v2/data/chapters.json', 'utf8'));
const chapters = db.chapters.filter(ch => ch.id >= 11 && ch.id <= 16);

// 转义函数
function escapeString(str) {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

// 生成JavaScript格式
let output = '';
chapters.forEach(ch => {
  output += `  ${ch.id}: {\n`;
  output += `    s01: {\n`;
  output += `      professional: "${escapeString(ch.content.s01.professional)}",\n`;
  output += `      simple: "${escapeString(ch.content.s01.simple)}",\n`;
  output += `      status2026: "${escapeString(ch.content.s01.status2026)}"\n`;
  output += `    },\n`;

  output += `    s02: [\n`;
  ch.content.s02.forEach((item, i) => {
    output += `      "${escapeString(item)}"${i < ch.content.s02.length - 1 ? ',' : ''}\n`;
  });
  output += `    ],\n`;

  output += `    s03: [\n`;
  ch.content.s03.forEach((item, i) => {
    output += `      ["${escapeString(item[0])}", "${escapeString(item[1])}"]${i < ch.content.s03.length - 1 ? ',' : ''}\n`;
  });
  output += `    ],\n`;

  output += `    s04: {\n`;
  output += `      tools: "${escapeString(ch.content.s04.tools)}",\n`;
  output += `      aiNative: "${escapeString(ch.content.s04.aiNative)}"\n`;
  output += `    },\n`;

  output += `    s05: [\n`;
  ch.content.s05.forEach((item, i) => {
    output += `      ["${escapeString(item[0])}", "${escapeString(item[1])}"]${i < ch.content.s05.length - 1 ? ',' : ''}\n`;
  });
  output += `    ],\n`;

  output += `    s06: {\n`;
  output += `      must: [\n`;
  ch.content.s06.must.forEach((item, i) => {
    output += `        "${escapeString(item)}"${i < ch.content.s06.must.length - 1 ? ',' : ''}\n`;
  });
  output += `      ],\n`;
  output += `      notNeeded: [\n`;
  ch.content.s06.notNeeded.forEach((item, i) => {
    output += `        "${escapeString(item)}"${i < ch.content.s06.notNeeded.length - 1 ? ',' : ''}\n`;
  });
  output += `      ]\n`;
  output += `    },\n`;

  output += `    s07: [\n`;
  ch.content.s07.forEach((item, i) => {
    const row = item.map(cell => `"${escapeString(String(cell))}"`).join(', ');
    output += `      [${row}]${i < ch.content.s07.length - 1 ? ',' : ''}\n`;
  });
  output += `    ],\n`;

  output += `    s08: {\n`;
  output += `      replaceRisk: "${escapeString(ch.content.s08.replaceRisk)}",\n`;
  output += `      enhanceLevel: "${escapeString(ch.content.s08.enhanceLevel)}",\n`;
  output += `      newOpportunities: "${escapeString(ch.content.s08.newOpportunities)}"\n`;
  output += `    },\n`;

  output += `    s09: {\n`;
  output += `      fatal: [\n`;
  ch.content.s09.fatal.forEach((item, i) => {
    output += `        "${escapeString(item)}"${i < ch.content.s09.fatal.length - 1 ? ',' : ''}\n`;
  });
  output += `      ],\n`;
  output += `      serious: [\n`;
  ch.content.s09.serious.forEach((item, i) => {
    output += `        "${escapeString(item)}"${i < ch.content.s09.serious.length - 1 ? ',' : ''}\n`;
  });
  output += `      ],\n`;
  output += `      moderate: [\n`;
  ch.content.s09.moderate.forEach((item, i) => {
    output += `        "${escapeString(item)}"${i < ch.content.s09.moderate.length - 1 ? ',' : ''}\n`;
  });
  output += `      ]\n`;
  output += `    },\n`;

  output += `    s10: {\n`;
  output += `      humanMust: [\n`;
  ch.content.s10.humanMust.forEach((item, i) => {
    output += `        "${escapeString(item)}"${i < ch.content.s10.humanMust.length - 1 ? ',' : ''}\n`;
  });
  output += `      ],\n`;
  output += `      aiCanDo: [\n`;
  ch.content.s10.aiCanDo.forEach((item, i) => {
    output += `        "${escapeString(item)}"${i < ch.content.s10.aiCanDo.length - 1 ? ',' : ''}\n`;
  });
  output += `      ]\n`;
  output += `    },\n`;

  output += `    s11: {\n`;
  output += `      recommend: "${escapeString(ch.content.s11.recommend)}",\n`;
  output += `      online: "${escapeString(ch.content.s11.online)}",\n`;
  output += `      advanced: "${escapeString(ch.content.s11.advanced)}"\n`;
  output += `    },\n`;

  output += `    s12: [\n`;
  ch.content.s12.forEach((item, i) => {
    output += `      "${escapeString(item)}"${i < ch.content.s12.length - 1 ? ',' : ''}\n`;
  });
  output += `    ]\n`;
  output += `  },\n`;
  output += `\n`;
});

fs.writeFileSync('chapters_11_16_content.js', output);
console.log('Content saved to chapters_11_16_content.js');
