/**
 * Enhanced Data Import Script
 * Imports existing chapter data from HTML and JS files into the database
 * Uses a more robust parsing approach
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'chapters.json');
const ROOT_DIR = path.join(__dirname, '..', '..');

// Load database
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    console.error('Database not found. Run init-db.js first');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Save database
function saveDatabase(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

// Safely extract string value - handles multi-line strings
function extractStringValue(text, key) {
  // Pattern to match: key: "..." (handles escaped quotes and newlines)
  const pattern = new RegExp(`${key}:\\s*"([\\s\\S]*?)(?<!\\\\)"`, 'i');
  const match = text.match(pattern);
  if (match) {
    // Unescape quotes
    return match[1].replace(/\\"/g, '"').trim();
  }
  return '';
}

// Alternative: Extract value using index-based approach for complex strings
function extractStringValueRobust(text, key) {
  const keyPattern = new RegExp(`${key}:\\s*"`);
  const match = text.match(keyPattern);
  if (!match) return '';

  const startIndex = match.index + match[0].length;
  let endIndex = startIndex;
  let escaped = false;

  while (endIndex < text.length) {
    const char = text[endIndex];
    if (escaped) {
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === '"') {
      break;
    }
    endIndex++;
  }

  return text.substring(startIndex, endIndex).replace(/\\"/g, '"');
}

// Extract array content
function extractArray(text, key) {
  const keyPattern = new RegExp(`${key}:\\s*\\[`);
  const match = text.match(keyPattern);
  if (!match) return null;

  const startIndex = match.index + match[0].length - 1;
  let depth = 1;
  let i = startIndex + 1;
  let inString = false;
  let escaped = false;

  while (i < text.length && depth > 0) {
    const char = text[i];
    if (escaped) {
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === '"' && !escaped) {
      inString = !inString;
    } else if (!inString) {
      if (char === '[') depth++;
      if (char === ']') depth--;
    }
    i++;
  }

  return text.substring(startIndex + 1, i - 1);
}

// Extract object content
function extractObject(text, key) {
  const keyPattern = new RegExp(`${key}:\\s*\\{`);
  const match = text.match(keyPattern);
  if (!match) return null;

  const startIndex = match.index + match[0].length - 1;
  let depth = 1;
  let i = startIndex + 1;
  let inString = false;
  let escaped = false;

  while (i < text.length && depth > 0) {
    const char = text[i];
    if (escaped) {
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === '"' && !escaped) {
      inString = !inString;
    } else if (!inString) {
      if (char === '{') depth++;
      if (char === '}') depth--;
    }
    i++;
  }

  return text.substring(startIndex + 1, i - 1);
}

// Parse simple string array
function parseStringArray(content) {
  const items = [];
  const regex = /"((?:[^"\\]|\\.)*)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    items.push(match[1].replace(/\\"/g, '"'));
  }
  return items;
}

// Parse nested array (array of arrays)
function parseNestedArray(content) {
  const arrays = [];
  let depth = 0;
  let current = '';
  let inString = false;
  let escaped = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (escaped) {
      current += char;
      escaped = false;
    } else if (char === '\\') {
      current += char;
      escaped = true;
    } else if (char === '"') {
      current += char;
      inString = !inString;
    } else if (!inString) {
      if (char === '[') {
        if (depth === 0) {
          current = '';
        } else {
          current += char;
        }
        depth++;
        continue;
      }
      if (char === ']') {
        depth--;
        if (depth === 0) {
          // Parse the inner array
          const items = [];
          const regex = /"((?:[^"\\]|\\.)*)"/g;
          let match;
          while ((match = regex.exec(current)) !== null) {
            items.push(match[1].replace(/\\"/g, '"'));
          }
          if (items.length > 0) {
            arrays.push(items);
          }
        } else {
          current += char;
        }
        continue;
      }
      if (depth > 0) {
        current += char;
      }
    } else {
      current += char;
    }
  }

  return arrays;
}

// Parse a complete chapter block
function parseChapterBlock(block) {
  const result = {};

  // Extract s01
  const s01Block = extractObject(block, 's01');
  if (s01Block) {
    result.s01 = {
      professional: extractStringValueRobust(s01Block, 'professional'),
      simple: extractStringValueRobust(s01Block, 'simple'),
      status2026: extractStringValueRobust(s01Block, 'status2026')
    };
  }

  // Extract s02
  const s02Block = extractArray(block, 's02');
  if (s02Block) {
    result.s02 = parseStringArray(s02Block);
  }

  // Extract s03
  const s03Block = extractArray(block, 's03');
  if (s03Block) {
    result.s03 = parseNestedArray(s03Block);
  }

  // Extract s04
  const s04Block = extractObject(block, 's04');
  if (s04Block) {
    result.s04 = {
      tools: extractStringValueRobust(s04Block, 'tools'),
      aiNative: extractStringValueRobust(s04Block, 'aiNative')
    };
  }

  // Extract s05
  const s05Block = extractArray(block, 's05');
  if (s05Block) {
    result.s05 = parseNestedArray(s05Block);
  }

  // Extract s06
  const s06Block = extractObject(block, 's06');
  if (s06Block) {
    const mustArray = extractArray(s06Block, 'must');
    const notNeededArray = extractArray(s06Block, 'notNeeded');
    result.s06 = {
      must: mustArray ? parseStringArray(mustArray) : [],
      notNeeded: notNeededArray ? parseStringArray(notNeededArray) : []
    };
  }

  // Extract s07
  const s07Block = extractArray(block, 's07');
  if (s07Block) {
    result.s07 = parseNestedArray(s07Block);
  }

  // Extract s08
  const s08Block = extractObject(block, 's08');
  if (s08Block) {
    result.s08 = {
      replaceRisk: extractStringValueRobust(s08Block, 'replaceRisk'),
      enhanceLevel: extractStringValueRobust(s08Block, 'enhanceLevel'),
      newOpportunities: extractStringValueRobust(s08Block, 'newOpportunities')
    };
  }

  // Extract s09
  const s09Block = extractObject(block, 's09');
  if (s09Block) {
    const fatalArray = extractArray(s09Block, 'fatal');
    const seriousArray = extractArray(s09Block, 'serious');
    const moderateArray = extractArray(s09Block, 'moderate');
    result.s09 = {
      fatal: fatalArray ? parseStringArray(fatalArray) : [],
      serious: seriousArray ? parseStringArray(seriousArray) : [],
      moderate: moderateArray ? parseStringArray(moderateArray) : []
    };
  }

  // Extract s10
  const s10Block = extractObject(block, 's10');
  if (s10Block) {
    const humanMustArray = extractArray(s10Block, 'humanMust');
    const aiCanDoArray = extractArray(s10Block, 'aiCanDo');
    result.s10 = {
      humanMust: humanMustArray ? parseStringArray(humanMustArray) : [],
      aiCanDo: aiCanDoArray ? parseStringArray(aiCanDoArray) : []
    };
  }

  // Extract s11
  const s11Block = extractObject(block, 's11');
  if (s11Block) {
    result.s11 = {
      recommend: extractStringValueRobust(s11Block, 'recommend'),
      online: extractStringValueRobust(s11Block, 'online'),
      advanced: extractStringValueRobust(s11Block, 'advanced')
    };
  }

  // Extract s12
  const s12Block = extractArray(block, 's12');
  if (s12Block) {
    result.s12 = parseStringArray(s12Block);
  }

  return result;
}

// Find the matching closing brace for an opening brace
function findMatchingBrace(str, openIndex) {
  let depth = 1;
  let i = openIndex + 1;
  let inString = false;
  let escaped = false;

  while (i < str.length && depth > 0) {
    const char = str[i];
    if (escaped) {
      escaped = false;
    } else if (char === '\\') {
      escaped = true;
    } else if (char === '"') {
      inString = !inString;
    } else if (!inString) {
      if (char === '{') depth++;
      if (char === '}') depth--;
    }
    i++;
  }
  return i - 1;
}

// Extract chapter content from the HTML file
function extractChapterContentFromHTML() {
  const htmlFile = path.join(ROOT_DIR, 'coder-landscape.html');
  const html = fs.readFileSync(htmlFile, 'utf8');

  // Find the chapterContent object in the HTML
  const startMatch = html.match(/const chapterContent = \{/);
  if (!startMatch) {
    console.error('Could not find chapterContent in HTML');
    return {};
  }

  const startIndex = startMatch.index + startMatch[0].length - 1;
  const endIndex = findMatchingBrace(html, startIndex);
  const contentStr = html.substring(startMatch.index, endIndex + 1);

  // Find all chapter IDs and their content blocks
  const chapters = {};
  const chapterStarts = [];
  const idPattern = /(\d+):\s*\{/g;
  let idMatch;

  while ((idMatch = idPattern.exec(contentStr)) !== null) {
    const id = parseInt(idMatch[1]);
    const braceStart = idMatch.index + idMatch[0].length - 1;
    const braceEnd = findMatchingBrace(contentStr, braceStart);

    chapterStarts.push({
      id: id,
      index: idMatch.index,
      braceStart: braceStart,
      braceEnd: braceEnd
    });
  }

  console.log(`  Found ${chapterStarts.length} chapters in HTML`);

  // Extract each chapter's content
  chapterStarts.forEach((ch) => {
    const chapterBlock = contentStr.substring(ch.braceStart, ch.braceEnd + 1);

    try {
      chapters[ch.id] = parseChapterBlock(chapterBlock);
      if (ch.id <= 3 || ch.id % 10 === 0) {
        console.log(`    Chapter ${ch.id}: s01.professional length = ${(chapters[ch.id].s01?.professional || '').length}`);
      }
    } catch (e) {
      console.error(`    Error parsing chapter ${ch.id}:`, e.message);
    }
  });

  return chapters;
}

// Import s07 data from external JS files
function importS07Data(db) {
  const s07Files = [
    path.join(ROOT_DIR, 'chapters_s07.js'),
    path.join(ROOT_DIR, 'chapters-s07-06-20.js'),
    path.join(ROOT_DIR, 'chapters_s07_21-35.js'),
    path.join(ROOT_DIR, 'chapters_s07_36-50.js'),
    path.join(ROOT_DIR, 's07-chapters-51-66.js')
  ];

  s07Files.forEach(file => {
    if (fs.existsSync(file)) {
      console.log('Importing s07 data from:', path.basename(file));
      const content = fs.readFileSync(file, 'utf8');

      // Extract chapter data - find each chapter and its s07 array
      const chapterRegex = /(\d+):\s*\{[\s\S]*?s07:\s*\[/g;
      let match;

      while ((match = chapterRegex.exec(content)) !== null) {
        const chapterId = parseInt(match[1]);
        const s07StartIndex = match.index + match[0].length - 1;

        // Find the matching closing bracket for s07 array
        let depth = 1;
        let i = s07StartIndex + 1;
        let inString = false;
        let escaped = false;

        while (i < content.length && depth > 0) {
          const char = content[i];
          if (escaped) {
            escaped = false;
          } else if (char === '\\') {
            escaped = true;
          } else if (char === '"' && !escaped) {
            inString = !inString;
          } else if (!inString) {
            if (char === '[') depth++;
            if (char === ']') depth--;
          }
          i++;
        }

        const s07Data = content.substring(s07StartIndex + 1, i - 1);

        const chapter = db.chapters.find(c => c.id === chapterId);
        if (chapter) {
          const parsed = parseNestedArray(s07Data);
          if (parsed.length > 0) {
            chapter.content.s07 = parsed;
            chapter.updatedAt = new Date().toISOString();
            console.log(`  Updated chapter ${chapterId} s07 with ${parsed.length} entries`);
          }
        }
      }
    }
  });
}

// Main import function
function importData() {
  console.log('Starting enhanced data import...\n');

  const db = loadDatabase();

  // Import from HTML
  console.log('Importing chapter content from coder-landscape.html...');
  const htmlContent = extractChapterContentFromHTML();

  let importedCount = 0;
  Object.entries(htmlContent).forEach(([chapterId, content]) => {
    const chapter = db.chapters.find(c => c.id === parseInt(chapterId));
    if (chapter) {
      chapter.content = { ...chapter.content, ...content };
      chapter.updatedAt = new Date().toISOString();
      importedCount++;
    }
  });
  console.log(`  Imported content for ${importedCount} chapters\n`);

  // Import s07 data from external files
  console.log('Importing monetization data from s07 files...');
  importS07Data(db);

  // Update meta
  db.meta.updatedAt = new Date().toISOString();

  // Count completed chapters
  const completedCount = db.chapters.filter(c =>
    c.content.s01 && c.content.s01.professional && c.content.s01.professional.length > 0
  ).length;
  db.meta.completedChapters = completedCount;

  // Save database
  saveDatabase(db);

  console.log(`\nImport complete!`);
  console.log(`Total chapters: ${db.chapters.length}`);
  console.log(`Chapters with content: ${completedCount}`);
  console.log(`Chapters with s07 data: ${db.chapters.filter(c => c.content.s07 && c.content.s07.length > 0).length}`);
}

// Run import
importData();
