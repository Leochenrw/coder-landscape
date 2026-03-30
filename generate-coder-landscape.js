const docx = require('docx');
const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableCell, TableRow, WidthType, BorderStyle, Header, Footer, PageNumber } = docx;

// =====================================================
// 66 Chapters Data
// =====================================================
const chapters = [
  { id: 1, title: "前端开发", subtitle: "Frontend Development", category: "基础开发方向" },
  { id: 2, title: "移动端开发", subtitle: "Mobile Development", category: "基础开发方向" },
  { id: 3, title: "后端开发", subtitle: "Backend Development", category: "基础开发方向" },
  { id: 4, title: "数据库开发", subtitle: "Database Development", category: "基础开发方向" },
  { id: 5, title: "全栈开发", subtitle: "Full Stack Development", category: "基础开发方向" },
  { id: 6, title: "桌面应用开发", subtitle: "Desktop Development", category: "基础开发方向" },
  { id: 7, title: "小程序开发", subtitle: "Mini Program Development", category: "基础开发方向" },
  { id: 8, title: "低代码/无代码", subtitle: "Low Code / No Code", category: "基础开发方向" },
  { id: 9, title: "API开发", subtitle: "API Development", category: "基础开发方向" },
  { id: 10, title: "DevOps开发", subtitle: "DevOps", category: "基础开发方向" },
  { id: 11, title: "游戏开发", subtitle: "Game Development", category: "游戏与娱乐" },
  { id: 12, title: "抖音小游戏", subtitle: "TikTok Mini Games", category: "游戏与娱乐" },
  { id: 13, title: "独立游戏", subtitle: "Indie Game", category: "游戏与娱乐" },
  { id: 14, title: "游戏MOD开发", subtitle: "Game MOD Development", category: "游戏与娱乐" },
  { id: 15, title: "电竞技术", subtitle: "Esports Tech", category: "游戏与娱乐" },
  { id: 16, title: "元宇宙开发", subtitle: "Metaverse Development", category: "游戏与娱乐" },
  { id: 17, title: "机器学习", subtitle: "Machine Learning", category: "人工智能方向" },
  { id: 18, title: "深度学习", subtitle: "Deep Learning", category: "人工智能方向" },
  { id: 19, title: "自然语言处理", subtitle: "NLP", category: "人工智能方向" },
  { id: 20, title: "计算机视觉", subtitle: "Computer Vision", category: "人工智能方向" },
  { id: 21, title: "推荐系统", subtitle: "Recommendation Systems", category: "人工智能方向" },
  { id: 22, title: "具身智能", subtitle: "Embodied AI", category: "人工智能方向" },
  { id: 23, title: "AI应用开发", subtitle: "AI App Development", category: "人工智能方向" },
  { id: 24, title: "大模型微调", subtitle: "LLM Fine-tuning", category: "人工智能方向" },
  { id: 25, title: "数据分析", subtitle: "Data Analysis", category: "数据与商业" },
  { id: 26, title: "商业智能", subtitle: "Business Intelligence", category: "数据与商业" },
  { id: 27, title: "数据工程", subtitle: "Data Engineering", category: "数据与商业" },
  { id: 28, title: "量化交易", subtitle: "Quantitative Trading", category: "数据与商业" },
  { id: 29, title: "增长黑客", subtitle: "Growth Hacking", category: "数据与商业" },
  { id: 30, title: "产品管理", subtitle: "Product Management", category: "数据与商业" },
  { id: 31, title: "技术写作", subtitle: "Technical Writing", category: "数据与商业" },
  { id: 32, title: "技术咨询", subtitle: "Tech Consulting", category: "数据与商业" },
  { id: 33, title: "网络安全", subtitle: "Cybersecurity", category: "安全与系统" },
  { id: 34, title: "渗透测试", subtitle: "Penetration Testing", category: "安全与系统" },
  { id: 35, title: "区块链开发", subtitle: "Blockchain Development", category: "安全与系统" },
  { id: 36, title: "智能合约", subtitle: "Smart Contract", category: "安全与系统" },
  { id: 37, title: "Web3开发", subtitle: "Web3 Development", category: "安全与系统" },
  { id: 38, title: "密码学", subtitle: "Cryptography", category: "安全与系统" },
  { id: 39, title: "云计算", subtitle: "Cloud Computing", category: "云计算与基础设施" },
  { id: 40, title: "云原生", subtitle: "Cloud Native", category: "云计算与基础设施" },
  { id: 41, title: "容器技术", subtitle: "Container Technology", category: "云计算与基础设施" },
  { id: 42, title: "Kubernetes", subtitle: "Kubernetes", category: "云计算与基础设施" },
  { id: 43, title: "Serverless", subtitle: "Serverless", category: "云计算与基础设施" },
  { id: 44, title: "边缘计算", subtitle: "Edge Computing", category: "云计算与基础设施" },
  { id: 45, title: "物联网", subtitle: "IoT", category: "云计算与基础设施" },
  { id: 46, title: "技术视频", subtitle: "Tech Video", category: "内容创作与媒体" },
  { id: 47, title: "技术播客", subtitle: "Tech Podcast", category: "内容创作与媒体" },
  { id: 48, title: "直播技术", subtitle: "Live Streaming", category: "内容创作与媒体" },
  { id: 49, title: "音视频开发", subtitle: "Multimedia Development", category: "内容创作与媒体" },
  { id: 50, title: "3D建模与渲染", subtitle: "3D Graphics", category: "内容创作与媒体" },
  { id: 51, title: "数字人", subtitle: "Digital Human", category: "内容创作与媒体" },
  { id: 52, title: "AI绘画", subtitle: "AI Art", category: "内容创作与媒体" },
  { id: 53, title: "爬虫开发", subtitle: "Web Scraping", category: "自动化与工具" },
  { id: 54, title: "自动化测试", subtitle: "Test Automation", category: "自动化与工具" },
  { id: 55, title: "RPA机器人", subtitle: "RPA", category: "自动化与工具" },
  { id: 56, title: "浏览器插件", subtitle: "Browser Extension", category: "自动化与工具" },
  { id: 57, title: "VSCode插件开发", subtitle: "VSCode Extension", category: "自动化与工具" },
  { id: 58, title: "CLI工具开发", subtitle: "CLI Tools", category: "自动化与工具" },
  { id: 59, title: "机器人编程", subtitle: "Robotics", category: "新兴与前沿" },
  { id: 60, title: "无人机开发", subtitle: "Drone Development", category: "新兴与前沿" },
  { id: 61, title: "嵌入式开发", subtitle: "Embedded Development", category: "新兴与前沿" },
  { id: 62, title: "自动驾驶", subtitle: "Autonomous Driving", category: "新兴与前沿" },
  { id: 63, title: "AR/VR开发", subtitle: "AR/VR Development", category: "新兴与前沿" },
  { id: 64, title: "空间计算", subtitle: "Spatial Computing", category: "新兴与前沿" },
  { id: 65, title: "脑机接口", subtitle: "BCI", category: "新兴与前沿" },
  { id: 66, title: "量子计算", subtitle: "Quantum Computing", category: "新兴与前沿" }
];

// =====================================================
// Helper Functions
// =====================================================
function createHeading(text, level = 1) {
  const headingLevels = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3
  };

  return new Paragraph({
    text: text,
    heading: headingLevels[level] || HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 }
  });
}

function createParagraph(text, options = {}) {
  return new Paragraph({
    children: [new TextRun({ text, bold: options.bold, size: options.size || 22 })],
    spacing: { before: 100, after: 100 },
    alignment: options.alignment || AlignmentType.LEFT
  });
}

function createBullet(text) {
  return new Paragraph({
    text: "• " + text,
    spacing: { before: 50, after: 50 },
    indent: { left: 360 }
  });
}

function createCell(text, width, options = {}) {
  return new TableCell({
    children: [new Paragraph({
      children: [new TextRun({ text, bold: options.bold, size: 20 })],
      alignment: options.center ? AlignmentType.CENTER : AlignmentType.LEFT
    })],
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: options.shading ? { fill: options.shading } : undefined
  });
}

function createSimpleTable(headers, rows, widths) {
  const headerRow = new TableRow({
    children: headers.map((h, i) => createCell(h, widths[i], { bold: true, shading: "E0E0E0", center: true }))
  });

  const dataRows = rows.map(row => new TableRow({
    children: row.map((cell, i) => createCell(cell, widths[i]))
  }));

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE }
  });
}

// =====================================================
// Generate Chapter Content
// =====================================================
function generateChapterContent(chapter) {
  const content = [];

  // Chapter Header
  content.push(createHeading(`${String(chapter.id).padStart(2, '0')} · ${chapter.title} (${chapter.subtitle})`, 1));
  content.push(createParagraph(`【${chapter.category}】`, { alignment: AlignmentType.CENTER }));
  content.push(new Paragraph({ text: "" }));

  // 01. What is this
  content.push(createHeading("01 · 这是什么", 2));
  content.push(createParagraph("专业解释：", { bold: true }));
  content.push(createParagraph(`${chapter.title}是...【此处为章节具体内容，实际使用时需填充详细描述】`));
  content.push(new Paragraph({ text: "" }));
  content.push(createParagraph("大白话解释：", { bold: true }));
  content.push(createParagraph(`就像...【用通俗比喻说明】`));
  content.push(new Paragraph({ text: "" }));
  content.push(createParagraph("2026年现状：", { bold: true }));
  content.push(createParagraph(`【当前行业状态，AI对该领域的影响】`));
  content.push(new Paragraph({ text: "" }));

  // 02. What to do
  content.push(createHeading("02 · 做什么", 2));
  const workItems = [
    "核心功能开发与设计",
    "系统架构与规划",
    "性能优化与调试",
    "与团队协作和代码审查",
    "技术方案选型与评估",
    "文档编写与知识分享"
  ];
  workItems.forEach(item => content.push(createBullet(item)));
  content.push(new Paragraph({ text: "" }));

  // 03. Sub-fields
  content.push(createHeading("03 · 细分有哪些", 2));
  content.push(createSimpleTable(
    ["子方向", "一句话说明"],
    [
      ["方向A", "具体说明..."],
      ["方向B", "具体说明..."],
      ["方向C", "具体说明..."],
      ["方向D", "具体说明..."]
    ],
    [30, 70]
  ));
  content.push(new Paragraph({ text: "" }));

  // 04. Core Tools
  content.push(createHeading("04 · 核心工具/语言", 2));
  content.push(createParagraph("主要技术栈：Tool A, Tool B, Tool C, Tool D, Tool E"));
  content.push(createParagraph("是否有AI原生版本：【说明AI工具支持情况】"));
  content.push(new Paragraph({ text: "" }));

  // 05. AI Tools
  content.push(createHeading("05 · AI 工具清单", 2));
  content.push(createSimpleTable(
    ["AI工具", "用在哪"],
    [
      ["Cursor", "AI原生IDE，代码生成与重构"],
      ["Claude Code", "复杂架构设计、多文件重构"],
      ["GitHub Copilot", "代码补全、单元测试生成"],
      ["ChatGPT/Claude", "技术方案设计、Bug排查"]
    ],
    [30, 70]
  ));
  content.push(new Paragraph({ text: "" }));

  // 06. Minimum Knowledge
  content.push(createHeading("06 · 最小可行知识", 2));
  content.push(createParagraph("必须掌握：", { bold: true }));
  content.push(createBullet("核心概念与基础原理"));
  content.push(createBullet("至少一门主力工具/语言"));
  content.push(createBullet("基础的调试与问题解决能力"));
  content.push(createBullet("使用AI辅助工作的能力"));
  content.push(new Paragraph({ text: "" }));
  content.push(createParagraph("初期不需要：", { bold: true }));
  content.push(createBullet("过于复杂的架构设计"));
  content.push(createBullet("所有工具链的深入细节"));
  content.push(createBullet("大规模系统优化经验"));
  content.push(new Paragraph({ text: "" }));

  // 07. Monetization
  content.push(createHeading("07 · 变现路径", 2));
  content.push(createSimpleTable(
    ["排序", "方式", "说明", "个人", "收入类型", "见效速度", "参考收入"],
    [
      ["1", "产品/服务", "开发工具或SaaS产品", "🔴", "被动", "3-6月", "几千-几十万/年"],
      ["2", "技术咨询", "按小时或项目收费", "🔴", "主动", "1-4周", "1万-10万/单"],
      ["3", "在线课程", "知识付费与教学", "🔴", "混合", "2-3月", "几千-几万/年"],
      ["4", "外包接单", "承接开发项目", "🔴", "主动", "1-2月", "几千-几万"]
    ],
    [8, 18, 30, 10, 10, 12, 17]
  ));
  content.push(new Paragraph({ text: "" }));
  content.push(createParagraph("图例： 🔴 个人可独立搞定 | 🟡 建议小团队 | 🟢 需要团队"));
  content.push(new Paragraph({ text: "" }));

  // 08. AI Impact
  content.push(createHeading("08 · AI 冲击评估", 2));
  content.push(createParagraph("被AI替代风险：【低/中/高】—— 【具体说明】"));
  content.push(createParagraph("被AI增强程度：【低/中/高】—— 【具体说明】"));
  content.push(createParagraph("AI创造的新机会：【有/无】—— 【具体说明】"));
  content.push(new Paragraph({ text: "" }));

  // 09. Pitfalls
  content.push(createHeading("09 · 避坑清单", 2));
  content.push(createParagraph("【致命级】", { bold: true }));
  content.push(createBullet("致命错误1：【说明】"));
  content.push(createBullet("致命错误2：【说明】"));
  content.push(createBullet("致命错误3：【说明】"));
  content.push(createBullet("致命错误4：【说明】"));
  content.push(new Paragraph({ text: "" }));
  content.push(createParagraph("【重伤级】", { bold: true }));
  content.push(createBullet("重伤错误1-10：【详细说明见完整版】"));
  content.push(new Paragraph({ text: "" }));
  content.push(createParagraph("【中伤级】", { bold: true }));
  content.push(createBullet("中伤错误1-5：【详细说明见完整版】"));
  content.push(new Paragraph({ text: "" }));

  // 10. Learning Path
  content.push(createHeading("10 · 掌握路径（AI 时代版）", 2));
  content.push(createParagraph("你必须自己真正理解的（AI替代不了）：", { bold: true }));
  content.push(createBullet("核心原理与底层逻辑"));
  content.push(createBullet("架构设计与技术决策"));
  content.push(createBullet("复杂问题的分析与解决"));
  content.push(new Paragraph({ text: "" }));
  content.push(createParagraph("AI 可以帮你做的：", { bold: true }));
  content.push(createBullet("代码生成与模板编写"));
  content.push(createBullet("测试用例生成"));
  content.push(createBullet("文档编写与注释"));
  content.push(createBullet("常规问题排查"));
  content.push(new Paragraph({ text: "" }));

  // 11. Resources
  content.push(createHeading("11 · 中文最佳资源", 2));
  content.push(createParagraph("首推：【推荐书籍或教程】"));
  content.push(createParagraph("在线：【推荐在线资源】"));
  content.push(createParagraph("进阶：【推荐进阶资料】"));
  content.push(new Paragraph({ text: "" }));

  // 12. First Steps
  content.push(createHeading("12 · 如何入门（第一步）", 2));
  content.push(createBullet("步骤1：环境准备与基础安装"));
  content.push(createBullet("步骤2：完成第一个Hello World"));
  content.push(createBullet("步骤3：跟随教程完成一个小项目"));
  content.push(createBullet("步骤4：用AI辅助解决遇到的问题"));
  content.push(new Paragraph({ text: "" }));

  // Page break after each chapter
  content.push(new Paragraph({ pageBreakBefore: true }));

  return content;
}

// =====================================================
// Main Document Generation
// =====================================================
async function generateDocument() {
  console.log("Generating Programming World Landscape document...");
  console.log(`Total chapters to generate: ${chapters.length}`);

  // Generate all chapter content
  const allContent = [];

  // Title Page
  allContent.push(createHeading("Programming World Landscape", 1));
  allContent.push(createHeading("编程世界全貌指南", 1));
  allContent.push(new Paragraph({ text: "" }));
  allContent.push(createParagraph("2026 Edition | AI时代独立开发者指南", { alignment: AlignmentType.CENTER }));
  allContent.push(new Paragraph({ text: "" }));
  allContent.push(createParagraph(`共 ${chapters.length} 个编程方向全覆盖`, { alignment: AlignmentType.CENTER }));
  allContent.push(new Paragraph({ pageBreakBefore: true }));

  // Table of Contents
  allContent.push(createHeading("目录", 1));
  let currentCategory = "";
  chapters.forEach(ch => {
    if (ch.category !== currentCategory) {
      currentCategory = ch.category;
      allContent.push(createParagraph(`【${currentCategory}】`, { bold: true }));
    }
    allContent.push(createParagraph(`${String(ch.id).padStart(2, '0')} · ${ch.title} (${ch.subtitle})`));
  });
  allContent.push(new Paragraph({ pageBreakBefore: true }));

  // Generate each chapter
  chapters.forEach((chapter, index) => {
    console.log(`Generating chapter ${index + 1}/${chapters.length}: ${chapter.title}`);
    const chapterContent = generateChapterContent(chapter);
    allContent.push(...chapterContent);
  });

  // Create document
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          size: {
            orientation: docx.PageOrientation.LANDSCAPE,
            width: 16838,  // A4 landscape width in DXA
            height: 11906  // A4 landscape height in DXA
          },
          margin: {
            top: 850,
            right: 850,
            bottom: 850,
            left: 850
          }
        },
        column: {
          space: 708,
          count: 2
        }
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({ text: "Programming World Landscape | 编程世界全貌", size: 18 })],
            alignment: AlignmentType.CENTER
          })]
        })
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun({ text: "第 ", size: 18 }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18 }),
              new TextRun({ text: " 页", size: 18 })
            ],
            alignment: AlignmentType.CENTER
          })]
        })
      },
      children: allContent
    }]
  });

  // Save document
  try {
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('coder-landscape-guide.docx', buffer);
    console.log("✅ Document generated successfully: coder-landscape-guide.docx");
  } catch (err) {
    console.error("❌ Failed to save document:", err.message);
    throw err;
  }
}

// Run generation
generateDocument().catch(err => {
  console.error("Error generating document:", err);
  process.exit(1);
});
