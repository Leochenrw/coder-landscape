/**
 * Chapter Management CLI Tool
 * Add, edit, or list chapters in the database
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'chapters.json');

function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    console.error('Database not found. Run init-db.js first');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function saveDatabase(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function listChapters(db) {
  console.log('\n=== Chapter List ===\n');
  console.log('ID  | Title                          | Category              | Status');
  console.log('----+--------------------------------+----------------------+----------');

  db.chapters.forEach(ch => {
    const hasContent = ch.content.s01.professional && ch.content.s01.professional.length > 0;
    const hasS07 = ch.content.s07 && ch.content.s07.length > 0;
    const status = hasContent ? 'Complete' : (hasS07 ? 'Partial' : 'Empty');
    const title = ch.title.padEnd(30, ' ').substring(0, 30);
    const category = ch.category.padEnd(20, ' ').substring(0, 20);
    console.log(`${String(ch.id).padStart(2, '0')}  | ${title} | ${category} | ${status}`);
  });

  console.log(`\nTotal: ${db.chapters.length} chapters`);
  const complete = db.chapters.filter(c => c.content.s01.professional && c.content.s01.professional.length > 0).length;
  const partial = db.chapters.filter(c => !c.content.s01.professional && c.content.s07 && c.content.s07.length > 0).length;
  console.log(`Complete: ${complete} | Partial: ${partial} | Empty: ${db.chapters.length - complete - partial}`);
}

function addChapter(db, id, title, category) {
  if (db.chapters.find(c => c.id === id)) {
    console.error(`Chapter ${id} already exists`);
    return;
  }

  const slug = title.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);

  const newChapter = {
    id,
    title,
    subtitle: "",
    category: category || "未分类",
    slug,
    content: {
      s01: { professional: "", simple: "", status2026: "" },
      s02: [],
      s03: [],
      s04: { tools: "", aiNative: "" },
      s05: [],
      s06: { must: [], notNeeded: [] },
      s07: [],
      s08: { replaceRisk: "", enhanceLevel: "", newOpportunities: "" },
      s09: { fatal: [], serious: [], moderate: [] },
      s10: { humanMust: [], aiCanDo: [] },
      s11: { recommend: "", online: "", advanced: "" },
      s12: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.chapters.push(newChapter);
  db.chapters.sort((a, b) => a.id - b.id);
  db.meta.totalChapters = db.chapters.length;

  console.log(`Added chapter ${id}: ${title}`);
}

function editChapter(db, id) {
  const chapter = db.chapters.find(c => c.id === id);
  if (!chapter) {
    console.error(`Chapter ${id} not found`);
    return;
  }

  console.log(`\n=== Editing Chapter ${id}: ${chapter.title} ===\n`);
  console.log('Sections:');
  db.sections.forEach(s => {
    const hasContent = checkSectionContent(chapter.content, s.code);
    console.log(`  ${s.code}: ${s.title} ${hasContent ? '[has data]' : '[empty]'}`);
  });

  console.log('\nTo edit a section, use:');
  console.log(`  node add-chapter.js --edit=${id} --section=s01`);
}

function checkSectionContent(content, sectionCode) {
  const section = content[sectionCode];
  if (!section) return false;
  if (Array.isArray(section)) return section.length > 0;
  if (typeof section === 'object') {
    return Object.values(section).some(v => {
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'string') return v.length > 0;
      return false;
    });
  }
  return false;
}

function showStats(db) {
  console.log('\n=== Database Statistics ===\n');
  console.log(`Total chapters: ${db.chapters.length}`);
  console.log(`Version: ${db.meta.version}`);
  console.log(`Created: ${db.meta.createdAt}`);
  console.log(`Updated: ${db.meta.updatedAt}`);

  const byCategory = {};
  db.chapters.forEach(c => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
  });

  console.log('\nChapters by category:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}`);
  });

  const contentStats = {
    complete: 0,
    partial: 0,
    empty: 0
  };

  db.chapters.forEach(c => {
    const hasS01 = c.content.s01.professional && c.content.s01.professional.length > 0;
    const hasS07 = c.content.s07 && c.content.s07.length > 0;

    if (hasS01) contentStats.complete++;
    else if (hasS07) contentStats.partial++;
    else contentStats.empty++;
  });

  console.log('\nContent status:');
  console.log(`  Complete (s01 filled): ${contentStats.complete}`);
  console.log(`  Partial (s07 only): ${contentStats.partial}`);
  console.log(`  Empty: ${contentStats.empty}`);
}

// Parse command line arguments
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      args[key] = value || true;
    }
  });
  return args;
}

function main() {
  const args = parseArgs();
  const db = loadDatabase();

  if (args.list || Object.keys(args).length === 0) {
    listChapters(db);
    return;
  }

  if (args.stats) {
    showStats(db);
    return;
  }

  if (args.add) {
    const [title, category] = args.add.split(',');
    if (!title) {
      console.error('Usage: --add="Title,Category"');
      process.exit(1);
    }
    const id = parseInt(args.id) || Math.max(...db.chapters.map(c => c.id)) + 1;
    addChapter(db, id, title, category);
    saveDatabase(db);
    return;
  }

  if (args.edit) {
    const id = parseInt(args.edit);
    if (isNaN(id)) {
      console.error('Usage: --edit=1');
      process.exit(1);
    }
    editChapter(db, id);
    return;
  }

  console.log('Unknown command. Usage:');
  console.log('  node add-chapter.js                    # List all chapters');
  console.log('  node add-chapter.js --stats            # Show statistics');
  console.log('  node add-chapter.js --add="Title,Cat"  # Add new chapter');
  console.log('  node add-chapter.js --edit=1           # Edit chapter');
}

main();
