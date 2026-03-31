/**
 * VM-based Data Import Script
 * Uses Node.js vm module to safely evaluate chapterContent object
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

// Parse nested array from string (for s07 files)
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

// Extract chapter content from the HTML file using VM
function extractChapterContentFromHTML() {
  const htmlFile = path.join(ROOT_DIR, 'coder-landscape.html');
  const html = fs.readFileSync(htmlFile, 'utf8');

  // Find the chapterContent object
  const startMatch = html.match(/const chapterContent = \{/);
  if (!startMatch) {
    console.error('Could not find chapterContent in HTML');
    return {};
  }

  // Find the matching closing brace
  let depth = 1;
  let i = startMatch.index + startMatch[0].length;
  let inString = false;
  let escaped = false;

  while (i < html.length && depth > 0) {
    const char = html[i];
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

  const contentStr = html.substring(startMatch.index, i);

  // Replace 'const chapterContent' with just 'chapterContent' so it gets added to context
  const modifiedContent = contentStr.replace('const chapterContent', 'chapterContent');

  // Create a safe context and evaluate
  const context = {};
  vm.createContext(context);

  try {
    vm.runInContext(modifiedContent, context);
    console.log(`  Successfully parsed chapterContent`);
    const chapters = context.chapterContent || {};
    console.log(`  Found ${Object.keys(chapters).length} chapters`);
    return chapters;
  } catch (e) {
    console.error('  Error parsing chapterContent:', e.message);
    return {};
  }
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

      // Create context for this file
      const context = {};
      vm.createContext(context);

      // Wrap in parentheses to make it a valid expression
      const wrappedContent = `({${content}})`;

      try {
        const chapters = vm.runInContext(wrappedContent, context);

        Object.entries(chapters).forEach(([chapterId, data]) => {
          const chapter = db.chapters.find(c => c.id === parseInt(chapterId));
          if (chapter && data.s07) {
            chapter.content.s07 = data.s07;
            chapter.updatedAt = new Date().toISOString();
            console.log(`  Updated chapter ${chapterId} s07 with ${data.s07.length} entries`);
          }
        });
      } catch (e) {
        // Fallback to regex parsing
        const chapterRegex = /(\d+):\s*\{[\s\S]*?s07:\s*\[/g;
        let match;

        while ((match = chapterRegex.exec(content)) !== null) {
          const chapterId = parseInt(match[1]);
          const s07StartIndex = match.index + match[0].length - 1;

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
    }
  });
}

// Main import function
function importData() {
  console.log('Starting VM-based data import...\n');

  const db = loadDatabase();

  // Import from HTML
  console.log('Importing chapter content from coder-landscape.html...');
  const htmlContent = extractChapterContentFromHTML();

  let importedCount = 0;
  let sectionsCount = 0;

  Object.entries(htmlContent).forEach(([chapterId, content]) => {
    const chapter = db.chapters.find(c => c.id === parseInt(chapterId));
    if (chapter && content) {
      // Merge content, keeping existing s07 if not in HTML
      const existingS07 = chapter.content.s07;
      chapter.content = { ...chapter.content, ...content };
      if (existingS07 && existingS07.length > 0 && (!content.s07 || content.s07.length === 0)) {
        chapter.content.s07 = existingS07;
      }
      chapter.updatedAt = new Date().toISOString();
      importedCount++;

      // Count sections
      const sectionCount = Object.values(content).filter(v => {
        if (typeof v === 'string') return v.length > 0;
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === 'object') {
          return Object.values(v).some(x => {
            if (typeof x === 'string') return x.length > 0;
            if (Array.isArray(x)) return x.length > 0;
            return false;
          });
        }
        return false;
      }).length;
      sectionsCount += sectionCount;

      if (importedCount <= 5 || importedCount % 10 === 0) {
        console.log(`  Imported chapter ${chapterId}: ${chapter.title} (${sectionCount} sections)`);
      }
    }
  });

  console.log(`  Total: ${importedCount} chapters, ~${sectionsCount} sections\n`);

  // Import s07 data from external files (for chapters not in HTML)
  console.log('Importing monetization data from s07 files...');
  importS07Data(db);

  // Update meta
  db.meta.updatedAt = new Date().toISOString();

  // Count completed chapters
  const completedCount = db.chapters.filter(c =>
    c.content.s01 && c.content.s01.professional && c.content.s01.professional.length > 0
  ).length;
  db.meta.completedChapters = completedCount;

  // Count sections per chapter
  const sectionStats = {};
  db.chapters.forEach(c => {
    const filledSections = Object.entries(c.content).filter(([key, value]) => {
      if (key === 's01' || key === 's04' || key === 's08' || key === 's11') {
        return value && Object.values(value).some(v => v && v.length > 0);
      }
      if (key === 's06' || key === 's09' || key === 's10') {
        return value && (value.must?.length > 0 || value.fatal?.length > 0 || value.humanMust?.length > 0);
      }
      return Array.isArray(value) && value.length > 0;
    }).length;
    sectionStats[filledSections] = (sectionStats[filledSections] || 0) + 1;
  });

  // Save database
  saveDatabase(db);

  console.log(`\nImport complete!`);
  console.log(`Total chapters: ${db.chapters.length}`);
  console.log(`Chapters with content: ${completedCount}`);
  console.log(`Chapters with s07 data: ${db.chapters.filter(c => c.content.s07 && c.content.s07.length > 0).length}`);
  console.log('\nSection completion distribution:');
  Object.entries(sectionStats).sort((a, b) => parseInt(a) - parseInt(b)).forEach(([sections, count]) => {
    console.log(`  ${sections} sections: ${count} chapters`);
  });
}

// Run import
importData();
