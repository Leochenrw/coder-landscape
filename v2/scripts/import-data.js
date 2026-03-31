/**
 * Data Import Script
 * Imports existing chapter data from HTML and JS files into the database
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

// Extract chapter content from the HTML file
function extractChapterContentFromHTML() {
  const htmlFile = path.join(ROOT_DIR, 'coder-landscape.html');
  const html = fs.readFileSync(htmlFile, 'utf8');

  // Find the chapterContent object in the HTML
  // Look for "const chapterContent = {" and find its matching closing brace
  const startMatch = html.match(/const chapterContent = \{/);
  if (!startMatch) {
    console.error('Could not find chapterContent in HTML');
    return {};
  }

  const startIndex = startMatch.index + startMatch[0].length - 1;
  const endIndex = findMatchingBrace(html, startIndex);
  const contentStr = html.substring(startMatch.index, endIndex + 1);

  // Create a safer extraction using multi-pass parsing
  const chapters = {};

  // First pass: identify all chapter IDs and their content blocks
  // Find all occurrences of "{number}: {" patterns
  const chapterStarts = [];
  const idPattern = /(\d+):\s*\{/g;
  let idMatch;

  while ((idMatch = idPattern.exec(contentStr)) !== null) {
    chapterStarts.push({
      id: parseInt(idMatch[1]),
      index: idMatch.index,
      endBrace: findMatchingBrace(contentStr, idMatch.index + idMatch[0].length - 1)
    });
  }

  // Extract each chapter's content
  chapterStarts.forEach((ch, i) => {
    const nextCh = chapterStarts[i + 1];
    const endIndex = nextCh ? nextCh.index - 1 : contentStr.length - 2;
    const chapterBlock = contentStr.substring(ch.index, endIndex);

    try {
      chapters[ch.id] = parseChapterBlock(chapterBlock);
    } catch (e) {
      console.error(`Error parsing chapter ${ch.id}:`, e.message);
    }
  });

  return chapters;
}

// Find the matching closing brace for an opening brace
function findMatchingBrace(str, openIndex) {
  let depth = 1;
  let i = openIndex + 1;
  while (i < str.length && depth > 0) {
    if (str[i] === '{') depth++;
    if (str[i] === '}') depth--;
    i++;
  }
  return i - 1;
}

// Parse a complete chapter block
function parseChapterBlock(block) {
  const result = {};

  // Extract s01
  const s01Block = extractSectionBlock(block, 's01');
  if (s01Block) {
    result.s01 = {
      professional: extractStringValueSafe(s01Block, 'professional'),
      simple: extractStringValueSafe(s01Block, 'simple'),
      status2026: extractStringValueSafe(s01Block, 'status2026')
    };
  }

  // Extract s02
  const s02Block = extractArrayBlock(block, 's02');
  if (s02Block) {
    result.s02 = parseStringArray(s02Block);
  }

  // Extract s03
  const s03Block = extractArrayBlock(block, 's03');
  if (s03Block) {
    result.s03 = parseNestedArray(s03Block);
  }

  // Extract s04
  const s04Block = extractSectionBlock(block, 's04');
  if (s04Block) {
    result.s04 = {
      tools: extractStringValueSafe(s04Block, 'tools'),
      aiNative: extractStringValueSafe(s04Block, 'aiNative')
    };
  }

  // Extract s05
  const s05Block = extractArrayBlock(block, 's05');
  if (s05Block) {
    result.s05 = parseNestedArray(s05Block);
  }

  // Extract s06
  const s06Block = extractSectionBlock(block, 's06');
  if (s06Block) {
    result.s06 = {
      must: parseStringArray(extractArrayBlock(s06Block, 'must') || ''),
      notNeeded: parseStringArray(extractArrayBlock(s06Block, 'notNeeded') || '')
    };
  }

  // Extract s07
  const s07Block = extractArrayBlock(block, 's07');
  if (s07Block) {
    result.s07 = parseNestedArray(s07Block);
  }

  // Extract s08
  const s08Block = extractSectionBlock(block, 's08');
  if (s08Block) {
    result.s08 = {
      replaceRisk: extractStringValueSafe(s08Block, 'replaceRisk'),
      enhanceLevel: extractStringValueSafe(s08Block, 'enhanceLevel'),
      newOpportunities: extractStringValueSafe(s08Block, 'newOpportunities')
    };
  }

  // Extract s09
  const s09Block = extractSectionBlock(block, 's09');
  if (s09Block) {
    result.s09 = {
      fatal: parseStringArray(extractArrayBlock(s09Block, 'fatal') || ''),
      serious: parseStringArray(extractArrayBlock(s09Block, 'serious') || ''),
      moderate: parseStringArray(extractArrayBlock(s09Block, 'moderate') || '')
    };
  }

  // Extract s10
  const s10Block = extractSectionBlock(block, 's10');
  if (s10Block) {
    result.s10 = {
      humanMust: parseStringArray(extractArrayBlock(s10Block, 'humanMust') || ''),
      aiCanDo: parseStringArray(extractArrayBlock(s10Block, 'aiCanDo') || '')
    };
  }

  // Extract s11
  const s11Block = extractSectionBlock(block, 's11');
  if (s11Block) {
    result.s11 = {
      recommend: extractStringValueSafe(s11Block, 'recommend'),
      online: extractStringValueSafe(s11Block, 'online'),
      advanced: extractStringValueSafe(s11Block, 'advanced')
    };
  }

  // Extract s12
  const s12Block = extractArrayBlock(block, 's12');
  if (s12Block) {
    result.s12 = parseStringArray(s12Block);
  }

  return result;
}

// Extract a section block (content between braces)
function extractSectionBlock(text, sectionName) {
  const pattern = new RegExp(`${sectionName}:\s*\\{`);
  const match = text.match(pattern);
  if (!match) return null;

  const start = match.index + match[0].length - 1;
  const end = findMatchingBrace(text, start);
  return text.substring(start + 1, end);
}

// Extract an array block
function extractArrayBlock(text, sectionName) {
  const pattern = new RegExp(`${sectionName}:\s*\\[`);
  const match = text.match(pattern);
  if (!match) return null;

  const start = match.index + match[0].length - 1;
  let depth = 1;
  let i = start + 1;
  while (i < text.length && depth > 0) {
    if (text[i] === '[') depth++;
    if (text[i] === ']') depth--;
    i++;
  }
  return text.substring(start + 1, i - 1);
}

// Safely extract string value
function extractStringValueSafe(text, key) {
  const pattern = new RegExp(`${key}:\\s*"([^"]*)"`, 'i');
  const match = text.match(pattern);
  return match ? match[1] : '';
}

// Parse string array
function parseStringArray(text) {
  const items = [];
  const pattern = /"([^"]*)"/g;
  let match;
  while ((match = pattern.exec(text)) !== null) {
    if (match[1].trim()) {
      items.push(match[1]);
    }
  }
  return items;
}

// Parse nested array (array of arrays)
function parseNestedArray(text) {
  const arrays = [];
  let depth = 0;
  let current = '';
  let inString = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"' && text[i - 1] !== '\\') {
      inString = !inString;
    }

    if (!inString) {
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
          const pattern = /"([^"]*)"/g;
          let match;
          while ((match = pattern.exec(current)) !== null) {
            items.push(match[1]);
          }
          if (items.length > 0) {
            arrays.push(items);
          }
        } else {
          current += char;
        }
        continue;
      }
    }

    if (depth > 0) {
      current += char;
    }
  }

  return arrays;
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
        while (i < content.length && depth > 0) {
          if (content[i] === '[') depth++;
          if (content[i] === ']') depth--;
          i++;
        }

        const s07Data = content.substring(s07StartIndex + 1, i - 1);

        const chapter = db.chapters.find(c => c.id === chapterId);
        if (chapter) {
          chapter.content.s07 = parseNestedArray(s07Data);
          chapter.updatedAt = new Date().toISOString();
          console.log(`  Updated chapter ${chapterId} s07 with ${chapter.content.s07.length} entries`);
        }
      }
    }
  });
}

// Main import function
function importData() {
  console.log('Starting data import...\n');

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
      console.log(`  Imported chapter ${chapterId}: ${chapter.title}`);
    }
  });

  // Import s07 data from external files
  console.log('\nImporting monetization data from s07 files...');
  importS07Data(db);

  // Update meta
  db.meta.updatedAt = new Date().toISOString();

  // Count completed chapters
  const completedCount = db.chapters.filter(c =>
    c.content.s01.professional && c.content.s01.professional.length > 0
  ).length;
  db.meta.completedChapters = completedCount;

  // Save database
  saveDatabase(db);

  console.log(`\nImport complete!`);
  console.log(`Total chapters: ${db.chapters.length}`);
  console.log(`Chapters with full content: ${completedCount}`);
  console.log(`Chapters with s07 data: ${db.chapters.filter(c => c.content.s07.length > 0).length}`);
}

// Run import
importData();
