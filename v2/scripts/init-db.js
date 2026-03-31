/**
 * Database Initialization Script
 * Creates the initial database structure with all 66 chapters
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'chapters.json');

// 66 Chapters base data
const CHAPTERS_BASE = [
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

// Section definitions
const SECTIONS = [
  { code: 's01', title: '这是什么', type: 'what_is_it' },
  { code: 's02', title: '做什么', type: 'work_content' },
  { code: 's03', title: '细分有哪些', type: 'subfields' },
  { code: 's04', title: '核心工具/语言', type: 'tools' },
  { code: 's05', title: 'AI 工具清单', type: 'ai_tools' },
  { code: 's06', title: '最小可行知识', type: 'minimum_knowledge' },
  { code: 's07', title: '变现路径', type: 'monetization' },
  { code: 's08', title: 'AI 冲击评估', type: 'ai_impact' },
  { code: 's09', title: '避坑清单', type: 'pitfalls' },
  { code: 's10', title: '掌握路径', type: 'learning_path' },
  { code: 's11', title: '中文最佳资源', type: 'resources' },
  { code: 's12', title: '如何入门', type: 'getting_started' }
];

// Create empty chapter content structure
function createEmptyChapter(base) {
  return {
    ...base,
    content: {
      s01: {
        professional: "",
        simple: "",
        status2026: ""
      },
      s02: [],
      s03: [],
      s04: {
        tools: "",
        aiNative: ""
      },
      s05: [],
      s06: {
        must: [],
        notNeeded: []
      },
      s07: [],
      s08: {
        replaceRisk: "",
        enhanceLevel: "",
        newOpportunities: ""
      },
      s09: {
        fatal: [],
        serious: [],
        moderate: []
      },
      s10: {
        humanMust: [],
        aiCanDo: []
      },
      s11: {
        recommend: "",
        online: "",
        advanced: ""
      },
      s12: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

function initDatabase() {
  console.log('Initializing database...');

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created data directory');
  }

  // Check if database already exists
  if (fs.existsSync(DB_FILE)) {
    console.log('Database already exists at:', DB_FILE);
    console.log('Use --force to recreate');

    if (process.argv.includes('--force')) {
      const backupName = `chapters-backup-${Date.now()}.json`;
      fs.copyFileSync(DB_FILE, path.join(DATA_DIR, backupName));
      console.log('Created backup:', backupName);
    } else {
      return;
    }
  }

  // Create database structure
  const database = {
    meta: {
      version: '2.0.0',
      createdAt: new Date().toISOString(),
      totalChapters: CHAPTERS_BASE.length,
      completedChapters: 0
    },
    sections: SECTIONS,
    chapters: CHAPTERS_BASE.map(createEmptyChapter)
  };

  // Write database file
  fs.writeFileSync(DB_FILE, JSON.stringify(database, null, 2));
  console.log('Database initialized with 66 chapters');
  console.log('Database file:', DB_FILE);
}

// Run initialization
initDatabase();
