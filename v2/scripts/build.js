/**
 * V2 Build Script
 * Generates HTML and Word documents from chapters.json
 */

const fs = require('fs');
const path = require('path');
const docx = require('docx');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle, PageNumber } = docx;

const DATA_DIR = path.join(__dirname, '..', 'data');
const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const DB_FILE = path.join(DATA_DIR, 'chapters.json');

// Load database
function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    console.error('Database not found. Run init-db.js first');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Ensure output directory exists
function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

// Generate HTML file
function generateHTML(db) {
  console.log('\nGenerating HTML...');

  const chapters = db.chapters;
  const sections = db.sections;

  // Group chapters by category
  const categories = {};
  chapters.forEach(ch => {
    if (!categories[ch.category]) {
      categories[ch.category] = [];
    }
    categories[ch.category].push(ch);
  });

  // Generate chapter content JavaScript
  const chapterContentJS = generateChapterContentJS(chapters);

  // Generate HTML
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Programming World Landscape v2 | 编程世界全貌指南</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-primary: #0a0e1a;
            --bg-secondary: #0d1224;
            --bg-tertiary: #111827;
            --bg-sidebar: #080c18;
            --accent: #00ff88;
            --accent-dim: #00cc6a;
            --accent-glow: rgba(0, 255, 136, 0.15);
            --text-primary: #e0e0e0;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --border: #1a2332;
            --border-accent: rgba(0, 255, 136, 0.3);
            --sidebar-width: 300px;
            --header-height: 60px;
            --progress-height: 3px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.7;
            min-height: 100vh;
        }

        /* Progress Bar */
        .progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: var(--progress-height);
            background: var(--border);
            z-index: 1000;
        }

        .progress-bar .progress {
            height: 100%;
            background: var(--accent);
            box-shadow: 0 0 10px var(--accent);
            width: 0%;
            transition: width 0.1s;
        }

        /* Header */
        .header {
            position: fixed;
            top: var(--progress-height);
            left: 0;
            right: 0;
            height: var(--header-height);
            background: rgba(10, 14, 26, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid var(--border);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            z-index: 999;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .menu-toggle {
            background: none;
            border: none;
            color: var(--text-primary);
            font-size: 24px;
            cursor: pointer;
            padding: 5px;
            display: none;
        }

        .header-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--accent);
        }

        .header-subtitle {
            font-size: 12px;
            color: var(--text-muted);
            margin-left: 10px;
        }

        /* AI Search Box */
        .ai-search {
            display: flex;
            align-items: center;
            gap: 10px;
            flex: 1;
            max-width: 500px;
            margin: 0 20px;
        }

        .ai-search input {
            flex: 1;
            background: var(--bg-tertiary);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 10px 15px;
            color: var(--text-primary);
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s;
        }

        .ai-search input:focus {
            border-color: var(--accent);
        }

        .ai-search input::placeholder {
            color: var(--text-muted);
        }

        .ai-search button {
            background: var(--accent);
            color: var(--bg-primary);
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }

        .ai-search button:hover {
            background: var(--accent-dim);
            transform: translateY(-1px);
        }

        .header-stats {
            display: flex;
            gap: 20px;
            font-size: 12px;
            color: var(--text-muted);
        }

        .header-stats span {
            color: var(--accent);
            font-weight: 600;
        }

        /* Sidebar */
        .sidebar {
            position: fixed;
            top: calc(var(--header-height) + var(--progress-height));
            left: 0;
            width: var(--sidebar-width);
            height: calc(100vh - var(--header-height) - var(--progress-height));
            background: var(--bg-sidebar);
            border-right: 1px solid var(--border);
            overflow-y: auto;
            z-index: 998;
            padding: 20px 0;
        }

        .sidebar-category {
            margin-bottom: 20px;
        }

        .sidebar-category-title {
            padding: 10px 20px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .sidebar-item {
            display: block;
            padding: 10px 20px 10px 30px;
            color: var(--text-secondary);
            text-decoration: none;
            font-size: 13px;
            border-left: 2px solid transparent;
            transition: all 0.2s;
        }

        .sidebar-item:hover {
            color: var(--text-primary);
            background: rgba(255, 255, 255, 0.02);
        }

        .sidebar-item.active {
            color: var(--accent);
            border-left-color: var(--accent);
            background: var(--accent-glow);
        }

        .sidebar-item-id {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            opacity: 0.5;
            margin-right: 8px;
        }

        /* Main Content */
        .main {
            margin-left: var(--sidebar-width);
            margin-top: calc(var(--header-height) + var(--progress-height));
            padding: 40px;
            max-width: 900px;
        }

        /* Chapter */
        .chapter {
            margin-bottom: 80px;
            padding-bottom: 60px;
            border-bottom: 1px solid var(--border);
        }

        .chapter:last-child {
            border-bottom: none;
        }

        .chapter-header {
            margin-bottom: 30px;
        }

        .chapter-category {
            font-size: 11px;
            font-weight: 600;
            color: var(--accent);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }

        .chapter-title {
            font-size: 36px;
            font-weight: 700;
            margin-bottom: 5px;
            background: linear-gradient(135deg, #fff 0%, var(--text-secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .chapter-subtitle {
            font-size: 16px;
            color: var(--text-muted);
            font-weight: 400;
        }

        .chapter-progress {
            display: flex;
            gap: 10px;
            margin-top: 20px;
        }

        .chapter-progress-item {
            width: 30px;
            height: 4px;
            background: var(--border);
            border-radius: 2px;
        }

        .chapter-progress-item.completed {
            background: var(--accent);
        }

        /* Section */
        .section {
            margin-bottom: 40px;
        }

        .section-title {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-number {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            color: var(--accent);
            background: var(--accent-glow);
            padding: 4px 10px;
            border-radius: 4px;
        }

        .section-content {
            padding-left: 20px;
        }

        .section-empty {
            color: var(--text-muted);
            font-style: italic;
            padding: 20px;
            background: var(--bg-tertiary);
            border-radius: 8px;
            border: 1px dashed var(--border);
        }

        /* Content Styles */
        .content-text {
            margin-bottom: 15px;
            color: var(--text-secondary);
        }

        .content-list {
            list-style: none;
            padding: 0;
        }

        .content-list li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: var(--text-secondary);
        }

        .content-list li::before {
            content: '•';
            position: absolute;
            left: 0;
            color: var(--accent);
        }

        /* Table */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }

        .data-table th {
            background: var(--bg-tertiary);
            padding: 12px;
            text-align: left;
            font-weight: 600;
            color: var(--text-primary);
            border-bottom: 2px solid var(--accent);
        }

        .data-table td {
            padding: 12px;
            border-bottom: 1px solid var(--border);
            color: var(--text-secondary);
        }

        .data-table tr:hover td {
            background: rgba(255, 255, 255, 0.02);
        }

        /* Status Tags */
        .tag {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }

        .tag-success {
            background: rgba(0, 255, 136, 0.1);
            color: var(--accent);
        }

        .tag-warning {
            background: rgba(255, 193, 7, 0.1);
            color: #ffc107;
        }

        .tag-danger {
            background: rgba(244, 67, 54, 0.1);
            color: #f44336;
        }

        .tag-info {
            background: rgba(33, 150, 243, 0.1);
            color: #2196f3;
        }

        /* Pitfall Levels */
        .pitfall-fatal {
            border-left: 3px solid #f44336;
            padding-left: 15px;
            margin: 10px 0;
        }

        .pitfall-serious {
            border-left: 3px solid #ff9800;
            padding-left: 15px;
            margin: 10px 0;
        }

        .pitfall-moderate {
            border-left: 3px solid #ffc107;
            padding-left: 15px;
            margin: 10px 0;
        }

        /* Completion Indicator */
        .completion-badge {
            display: inline-flex;
            align-items: center;
            gap: 5px;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
        }

        .completion-badge.complete {
            background: rgba(0, 255, 136, 0.1);
            color: var(--accent);
        }

        .completion-badge.partial {
            background: rgba(255, 193, 7, 0.1);
            color: #ffc107;
        }

        .completion-badge.empty {
            background: rgba(100, 116, 139, 0.1);
            color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 1024px) {
            .sidebar {
                transform: translateX(-100%);
                transition: transform 0.3s;
            }

            .sidebar.open {
                transform: translateX(0);
            }

            .main {
                margin-left: 0;
            }

            .menu-toggle {
                display: block;
            }

            .ai-search {
                display: none;
            }
        }

        @media (max-width: 640px) {
            .main {
                padding: 20px;
            }

            .chapter-title {
                font-size: 28px;
            }
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-primary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
        }

        /* Print Styles */
        @media print {
            .sidebar, .header, .progress-bar {
                display: none;
            }

            .main {
                margin-left: 0;
                margin-top: 0;
            }

            .chapter {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>
    <!-- Progress Bar -->
    <div class="progress-bar">
        <div class="progress" id="progressBar"></div>
    </div>

    <!-- Header -->
    <header class="header">
        <div class="header-left">
            <button class="menu-toggle" onclick="toggleSidebar()">☰</button>
            <span class="header-title">Programming World Landscape</span>
            <span class="header-subtitle">v2.0</span>
        </div>
        <div class="ai-search">
            <input type="text" id="aiSearch" placeholder="询问AI关于本文的问题...">
            <button onclick="askAI()">询问AI</button>
        </div>
        <div class="header-stats">
            <div>章节: <span>${chapters.filter(c => c.content.s01.professional).length}</span>/${chapters.length}</div>
            <div>变现: <span>${chapters.filter(c => c.content.s07.length > 0).length}</span>/${chapters.length}</div>
        </div>
    </header>

    <!-- Sidebar -->
    <nav class="sidebar" id="sidebar">
        ${generateSidebarHTML(categories, chapters)}
    </nav>

    <!-- Main Content -->
    <main class="main">
        ${generateChaptersHTML(chapters, sections)}
    </main>

    <script>
        // Chapter Content Data
        ${chapterContentJS}

        // Progress Bar
        function updateProgress() {
            const main = document.querySelector('.main');
            const scrolled = window.scrollY - main.offsetTop;
            const height = main.scrollHeight - window.innerHeight + main.offsetTop;
            const progress = Math.max(0, Math.min(100, (scrolled / height) * 100));
            document.getElementById('progressBar').style.width = progress + '%';
        }

        window.addEventListener('scroll', updateProgress);
        updateProgress();

        // Active Navigation
        function updateActiveNav() {
            const chapters = document.querySelectorAll('.chapter');
            const sidebarItems = document.querySelectorAll('.sidebar-item');

            let activeId = '';
            chapters.forEach(ch => {
                const rect = ch.getBoundingClientRect();
                if (rect.top <= 200) {
                    activeId = ch.id;
                }
            });

            sidebarItems.forEach(item => {
                item.classList.toggle('active', item.getAttribute('href') === '#' + activeId);
            });
        }

        window.addEventListener('scroll', updateActiveNav);

        // Mobile Sidebar Toggle
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('open');
        }

        // AI Search (Placeholder)
        function askAI() {
            const query = document.getElementById('aiSearch').value;
            if (!query) return;
            alert('AI搜索功能需要配置API密钥。\n\n查询: ' + query);
        }

        // Enter key for search
        document.getElementById('aiSearch')?.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') askAI();
        });
    </script>
</body>
</html>`;

  // Write HTML file
  const outputPath = path.join(OUTPUT_DIR, 'coder-landscape-v2.html');
  fs.writeFileSync(outputPath, html);
  console.log(`  ✓ HTML generated: ${outputPath}`);

  return outputPath;
}

// Generate sidebar HTML
function generateSidebarHTML(categories, chapters) {
  let html = '';
  for (const [category, items] of Object.entries(categories)) {
    html += `
        <div class="sidebar-category">
            <div class="sidebar-category-title">${category}</div>
            ${items.map(ch => {
              const hasContent = ch.content.s01.professional;
              const hasMonetization = ch.content.s07.length > 0;
              return `<a href="#chapter-${ch.id}" class="sidebar-item ${!hasContent ? 'empty' : ''}">
                <span class="sidebar-item-id">${String(ch.id).padStart(2, '0')}</span>${ch.title}
            </a>`;
            }).join('')}
        </div>`;
  }
  return html;
}

// Generate chapters HTML
function generateChaptersHTML(chapters, sections) {
  return chapters.map(ch => {
    const hasContent = ch.content.s01.professional;
    const completionStatus = getCompletionStatus(ch);

    return `
        <article class="chapter" id="chapter-${ch.id}">
            <div class="chapter-header">
                <div class="chapter-category">${ch.category}</div>
                <h1 class="chapter-title">${ch.title}</h1>
                <h2 class="chapter-subtitle">${ch.subtitle}</h2>
                <div class="chapter-progress">
                    ${sections.map((s, i) => {
                      const completed = isSectionComplete(ch, s.code);
                      return `<div class="chapter-progress-item ${completed ? 'completed' : ''}"></div>`;
                    }).join('')}
                </div>
            </div>

            ${sections.map((s, i) => generateSectionHTML(ch, s, i + 1)).join('')}
        </article>`;
  }).join('');
}

// Generate section HTML
function generateSectionHTML(chapter, section, index) {
  const content = chapter.content[section.code];
  const isComplete = isSectionComplete(chapter, section.code);

  let contentHTML = '';

  if (!content || isEmpty(content)) {
    contentHTML = `<div class="section-empty">暂无内容</div>`;
  } else {
    contentHTML = renderSectionContent(section.code, content);
  }

  return `
            <section class="section" id="chapter-${chapter.id}-${section.code}">
                <h3 class="section-title">
                    <span class="section-number">${String(index).padStart(2, '0')}</span>
                    ${section.title}
                </h3>
                <div class="section-content">
                    ${contentHTML}
                </div>
            </section>`;
}

// Render section content based on type
function renderSectionContent(code, content) {
  switch (code) {
    case 's01': // 这是什么
      return `
                    <div class="content-text"><strong>专业解释：</strong> ${content.professional || '暂无'}</div>
                    <div class="content-text"><strong>大白话：</strong> ${content.simple || '暂无'}</div>
                    <div class="content-text"><strong>2026现状：</strong> ${content.status2026 || '暂无'}</div>`;

    case 's02': // 做什么
      return `<ul class="content-list">${content.map(item => `<li>${item}</li>`).join('')}</ul>`;

    case 's03': // 细分有哪些
      if (!Array.isArray(content) || content.length === 0) return '<div class="section-empty">暂无内容</div>';
      return `<table class="data-table">
                        <thead>
                            <tr><th>子方向</th><th>一句话说明</th></tr>
                        </thead>
                        <tbody>
                            ${content.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>`;

    case 's05': // AI工具清单
      if (!Array.isArray(content) || content.length === 0) return '<div class="section-empty">暂无内容</div>';
      return `<table class="data-table">
                        <thead>
                            <tr><th>AI工具</th><th>用在哪</th></tr>
                        </thead>
                        <tbody>
                            ${content.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>`;

    case 's07': // 变现路径
      if (!Array.isArray(content) || content.length === 0) return '<div class="section-empty">暂无内容</div>';
      return `<table class="data-table">
                        <thead>
                            <tr><th>排序</th><th>方式</th><th>说明</th><th>个人能干</th><th>见效速度</th><th>参考收入</th></tr>
                        </thead>
                        <tbody>
                            ${content.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
                        </tbody>
                    </table>`;

    case 's04': // 核心工具
      return `
                    <div class="content-text"><strong>核心工具：</strong> ${content.tools || '暂无'}</div>
                    <div class="content-text"><strong>AI原生版本：</strong> ${content.aiNative || '暂无'}</div>`;

    case 's06': // 最小可行知识
      return `
                    <div class="content-text"><span class="tag tag-success">✓ 必须掌握</span></div>
                    <ul class="content-list">${(content.must || []).map(item => `<li>${item}</li>`).join('')}</ul>
                    <div class="content-text"><span class="tag tag-warning">✗ 不需要（初期）</span></div>
                    <ul class="content-list">${(content.notNeeded || []).map(item => `<li>${item}</li>`).join('')}</ul>`;

    case 's08': // AI冲击评估
      return `
                    <div class="content-text"><span class="tag tag-info">替代风险：</span> ${content.replaceRisk || '暂无'}</div>
                    <div class="content-text"><span class="tag tag-info">增强程度：</span> ${content.enhanceLevel || '暂无'}</div>
                    <div class="content-text"><span class="tag tag-info">新机会：</span> ${content.newOpportunities || '暂无'}</div>`;

    case 's09': // 避坑清单
      return `
                    <div class="pitfall-fatal"><span class="tag tag-danger">致命级</span></div>
                    <ul class="content-list">${(content.fatal || []).map(item => `<li>${item}</li>`).join('')}</ul>
                    <div class="pitfall-serious"><span class="tag tag-warning">重伤级</span></div>
                    <ul class="content-list">${(content.serious || []).map(item => `<li>${item}</li>`).join('')}</ul>
                    <div class="pitfall-moderate"><span class="tag tag-info">中伤级</span></div>
                    <ul class="content-list">${(content.moderate || []).map(item => `<li>${item}</li>`).join('')}</ul>`;

    case 's10': // 掌握路径
      return `
                    <div class="content-text"><span class="tag tag-success">人必须理解的</span></div>
                    <ul class="content-list">${(content.humanMust || []).map(item => `<li>${item}</li>`).join('')}</ul>
                    <div class="content-text"><span class="tag tag-info">AI能做的</span></div>
                    <ul class="content-list">${(content.aiCanDo || []).map(item => `<li>${item}</li>`).join('')}</ul>`;

    case 's11': // 中文最佳资源
      return `
                    <div class="content-text"><span class="tag tag-success">首推：</span> ${content.recommend || '暂无'}</div>
                    <div class="content-text"><span class="tag tag-info">在线：</span> ${content.online || '暂无'}</div>
                    <div class="content-text"><span class="tag tag-warning">进阶：</span> ${content.advanced || '暂无'}</div>`;

    case 's12': // 如何入门
      return `<ul class="content-list">${(content || []).map((item, i) => `<li><strong>步骤 ${i + 1}：</strong>${item}</li>`).join('')}</ul>`;

    default:
      return `<div class="content-text">${JSON.stringify(content)}</div>`;
  }
}

// Check if section is complete
function isSectionComplete(chapter, sectionCode) {
  const content = chapter.content[sectionCode];
  if (!content) return false;

  if (typeof content === 'string') return content.length > 0;
  if (Array.isArray(content)) return content.length > 0;
  if (typeof content === 'object') {
    return Object.values(content).some(v => {
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === 'string') return v.length > 0;
      return false;
    });
  }
  return false;
}

// Get completion status
function getCompletionStatus(chapter) {
  const sections = Object.values(chapter.content);
  const completedSections = sections.filter(s => {
    if (typeof s === 'string') return s.length > 0;
    if (Array.isArray(s)) return s.length > 0;
    if (typeof s === 'object') {
      return Object.values(s).some(v => {
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === 'string') return v.length > 0;
        return false;
      });
    }
    return false;
  });

  if (completedSections.length === 0) return 'empty';
  if (completedSections.length === sections.length) return 'complete';
  return 'partial';
}

// Check if content is empty
function isEmpty(content) {
  if (!content) return true;
  if (typeof content === 'string') return content.length === 0;
  if (Array.isArray(content)) return content.length === 0;
  if (typeof content === 'object') {
    return Object.values(content).every(v => isEmpty(v));
  }
  return false;
}

// Generate chapter content JavaScript
function generateChapterContentJS(chapters) {
  const content = {};
  chapters.forEach(ch => {
    content[ch.id] = ch.content;
  });
  return `const chapterContent = ${JSON.stringify(content, null, 2)};`;
}

// Generate Word document
async function generateWord(db) {
  console.log('\nGenerating Word document...');

  const chapters = db.chapters;
  const sections = db.sections;

  // Create document
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: docx.PageOrientation.LANDSCAPE,
            width: 16838, // A4 landscape in twips
            height: 11906
          },
          margin: {
            top: 850,
            right: 850,
            bottom: 850,
            left: 850
          }
        }
      },
      children: [
        // Title Page
        new Paragraph({
          text: 'Programming World Landscape',
          heading: HeadingLevel.HEADING_1,
          alignment: AlignmentType.CENTER,
          spacing: { before: 2000, after: 400 }
        }),
        new Paragraph({
          text: '编程世界全貌指南 v2.0',
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 200 }
        }),
        new Paragraph({
          children: [new TextRun({ text: `共 ${chapters.length} 个方向 | ${chapters.filter(c => c.content.s01.professional).length} 个已完成`, size: 24 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 600 }
        }),
        new Paragraph({ text: '', spacing: { before: 2000 } }),
        new Paragraph({
          children: [new TextRun({ text: '2026 Edition', size: 22, color: '666666' })],
          alignment: AlignmentType.CENTER
        }),

        // Page break after title
        new Paragraph({ pageBreakBefore: true }),

        // Table of Contents
        new Paragraph({
          text: '目录',
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 400 }
        }),
        ...generateTOC(chapters),

        // Chapters
        ...chapters.flatMap(ch => generateChapterDocx(ch, sections))
      ]
    }],
    footers: {
      default: new docx.Footer({
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({ children: [PageNumber.CURRENT] })
            ]
          })
        ]
      })
    }
  });

  // Generate buffer
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(OUTPUT_DIR, 'coder-landscape-guide-v2.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log(`  ✓ Word document generated: ${outputPath}`);

  return outputPath;
}

// Generate Table of Contents
function generateTOC(chapters) {
  const categories = {};
  chapters.forEach(ch => {
    if (!categories[ch.category]) {
      categories[ch.category] = [];
    }
    categories[ch.category].push(ch);
  });

  const paragraphs = [];
  for (const [category, items] of Object.entries(categories)) {
    paragraphs.push(
      new Paragraph({
        text: category,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 }
      })
    );
    items.forEach(ch => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `${String(ch.id).padStart(2, '0')}. ${ch.title} - ${ch.subtitle}`, size: 20 })],
          spacing: { before: 60, after: 60 },
          indent: { left: 400 }
        })
      );
    });
  }
  return paragraphs;
}

// Generate chapter content for Word
function generateChapterDocx(chapter, sections) {
  const paragraphs = [];

  // Chapter header
  paragraphs.push(new Paragraph({ pageBreakBefore: true }));
  paragraphs.push(
    new Paragraph({
      text: `${String(chapter.id).padStart(2, '0')}. ${chapter.title}`,
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 100 }
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: chapter.subtitle, size: 24, color: '666666' })],
      spacing: { before: 0, after: 200 }
    })
  );
  paragraphs.push(
    new Paragraph({
      children: [new TextRun({ text: chapter.category, size: 20, color: '999999' })],
      spacing: { before: 0, after: 400 }
    })
  );

  // Sections
  sections.forEach((section, index) => {
    const content = chapter.content[section.code];
    if (!content || isEmpty(content)) return;

    paragraphs.push(
      new Paragraph({
        text: `${String(index + 1).padStart(2, '0')} · ${section.title}`,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      })
    );

    paragraphs.push(...renderSectionDocx(section.code, content));
  });

  return paragraphs;
}

// Render section content for Word
function renderSectionDocx(code, content) {
  const paragraphs = [];

  switch (code) {
    case 's01':
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '专业解释：', bold: true }), new TextRun(content.professional || '暂无')], spacing: { before: 100, after: 100 } }));
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '大白话：', bold: true }), new TextRun(content.simple || '暂无')], spacing: { before: 100, after: 100 } }));
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '2026现状：', bold: true }), new TextRun(content.status2026 || '暂无')], spacing: { before: 100, after: 100 } }));
      break;

    case 's02':
      content.forEach(item => {
        paragraphs.push(new Paragraph({ text: `• ${item}`, spacing: { before: 60, after: 60 } }));
      });
      break;

    case 's03':
      if (Array.isArray(content) && content.length > 0) {
        const headerRow = new TableRow({
          children: ['子方向', '一句话说明'].map(h => new TableCell({
            children: [new Paragraph({ text: h, size: 20 })],
            shading: { fill: '333333' }
          }))
        });
        const dataRows = content.map(row => new TableRow({
          children: row.map(cell => new TableCell({
            children: [new Paragraph({ text: String(cell), size: 20 })]
          }))
        }));
        paragraphs.push(new Table({ rows: [headerRow, ...dataRows] }));
      }
      break;

    case 's05':
      if (Array.isArray(content) && content.length > 0) {
        const headerRow = new TableRow({
          children: ['AI工具', '用在哪'].map(h => new TableCell({
            children: [new Paragraph({ text: h, size: 20 })],
            shading: { fill: '333333' }
          }))
        });
        const dataRows = content.map(row => new TableRow({
          children: row.map(cell => new TableCell({
            children: [new Paragraph({ text: String(cell), size: 20 })]
          }))
        }));
        paragraphs.push(new Table({ rows: [headerRow, ...dataRows] }));
      }
      break;

    case 's07':
      if (Array.isArray(content) && content.length > 0) {
        const headerRow = new TableRow({
          children: ['排序', '方式', '说明', '个人能干', '见效速度', '参考收入'].map(h => new TableCell({
            children: [new Paragraph({ text: h, size: 20 })],
            shading: { fill: '333333' }
          }))
        });
        const dataRows = content.map(row => new TableRow({
          children: row.map(cell => new TableCell({
            children: [new Paragraph({ text: String(cell), size: 20 })]
          }))
        }));
        paragraphs.push(new Table({ rows: [headerRow, ...dataRows] }));
      }
      break;

    case 's06':
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '必须掌握：', bold: true })], spacing: { before: 200 } }));
      (content.must || []).forEach(item => {
        paragraphs.push(new Paragraph({ text: `✓ ${item}`, spacing: { before: 40, after: 40 } }));
      });
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '不需要（初期）：', bold: true })], spacing: { before: 200 } }));
      (content.notNeeded || []).forEach(item => {
        paragraphs.push(new Paragraph({ text: `✗ ${item}`, spacing: { before: 40, after: 40 } }));
      });
      break;

    case 's08':
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '替代风险：', bold: true }), new TextRun(content.replaceRisk || '暂无')], spacing: { before: 100, after: 100 } }));
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '增强程度：', bold: true }), new TextRun(content.enhanceLevel || '暂无')], spacing: { before: 100, after: 100 } }));
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '新机会：', bold: true }), new TextRun(content.newOpportunities || '暂无')], spacing: { before: 100, after: 100 } }));
      break;

    case 's09':
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '【致命级】', bold: true, color: 'CC0000' })], spacing: { before: 200 } }));
      (content.fatal || []).forEach(item => {
        paragraphs.push(new Paragraph({ text: `• ${item}`, spacing: { before: 40, after: 40 } }));
      });
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '【重伤级】', bold: true, color: 'FF6600' })], spacing: { before: 200 } }));
      (content.serious || []).forEach(item => {
        paragraphs.push(new Paragraph({ text: `• ${item}`, spacing: { before: 40, after: 40 } }));
      });
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '【中伤级】', bold: true, color: 'CC9900' })], spacing: { before: 200 } }));
      (content.moderate || []).forEach(item => {
        paragraphs.push(new Paragraph({ text: `• ${item}`, spacing: { before: 40, after: 40 } }));
      });
      break;

    case 's10':
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '人必须理解的：', bold: true })], spacing: { before: 200 } }));
      (content.humanMust || []).forEach(item => {
        paragraphs.push(new Paragraph({ text: `• ${item}`, spacing: { before: 40, after: 40 } }));
      });
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: 'AI能做的：', bold: true })], spacing: { before: 200 } }));
      (content.aiCanDo || []).forEach(item => {
        paragraphs.push(new Paragraph({ text: `• ${item}`, spacing: { before: 40, after: 40 } }));
      });
      break;

    case 's11':
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '首推：', bold: true }), new TextRun(content.recommend || '暂无')], spacing: { before: 100, after: 100 } }));
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '在线：', bold: true }), new TextRun(content.online || '暂无')], spacing: { before: 100, after: 100 } }));
      paragraphs.push(new Paragraph({ children: [new TextRun({ text: '进阶：', bold: true }), new TextRun(content.advanced || '暂无')], spacing: { before: 100, after: 100 } }));
      break;

    case 's12':
      (content || []).forEach((item, i) => {
        paragraphs.push(new Paragraph({ text: `${i + 1}. ${item}`, spacing: { before: 60, after: 60 } }));
      });
      break;
  }

  return paragraphs;
}

// Main build function
async function build() {
  console.log('=== Building Coder Landscape v2 ===\n');

  // Load database
  const db = loadDatabase();
  console.log(`Loaded ${db.chapters.length} chapters`);
  console.log(`Completed: ${db.chapters.filter(c => c.content.s01.professional).length} chapters`);
  console.log(`With monetization: ${db.chapters.filter(c => c.content.s07.length > 0).length} chapters`);

  // Ensure output directory
  ensureOutputDir();

  // Generate outputs
  const htmlPath = generateHTML(db);
  const wordPath = await generateWord(db);

  // Update meta
  db.meta.updatedAt = new Date().toISOString();
  db.meta.lastBuild = {
    timestamp: new Date().toISOString(),
    htmlPath,
    wordPath
  };
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  console.log('\n=== Build Complete ===');
  console.log(`HTML: ${htmlPath}`);
  console.log(`Word: ${wordPath}`);
}

// Run build
build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
