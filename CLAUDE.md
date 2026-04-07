# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目说明

这是一个《Programming World Landscape》（编程世界全貌）指南项目，面向编程小白和 aspiring indie developers。项目生成两种输出：

1. **coder-landscape.html** - 交互式网页，带侧边导航、进度追踪、AI搜索
2. **generate-coder-landscape.js** - 生成横版A4 Word文档的Node.js脚本

## 运行命令

```bash
# 安装依赖
npm install

# 本地预览网页
npx serve coder-landscape.html

# 生成横版A4 Word文档
node generate-coder-landscape.js
# 输出：coder-landscape-guide.docx

# v2 JSON管道
npm run v2:init       # 初始化空chapters.json
npm run v2:import     # 从HTML提取内容到JSON
npm run v2:build      # 从JSON生成HTML+Word
npm run v2:preview    # 预览v2生成的网页
npm run v2:add-chapter  # CLI添加新章节
```

## 文档规格

### 整体结构

- **总章节数**：66章（见下方完整列表）
- **每章结构**：12个固定板块（见下方）
- **格式**：中文为主，专业术语保留英文
- **AI时代视角**：每章需区分"AI能做的"vs"人必须理解的"

### 12章节标准结构

```
01 · 这是什么         → 专业解释 + 大白话解释 + 2026现状
02 · 做什么           → 5-8条工作内容 bullet list
03 · 细分有哪些       → 表格（子方向 | 一句话说明）
04 · 核心工具/语言    → 工具列表 + 是否有AI原生版本
05 · AI 工具清单      → 表格（AI工具 | 用在哪）
06 · 最小可行知识     → ✅必须掌握 vs ❌不需要（初期）
07 · 变现路径         → 表格（排序|方式|说明|个人能干|变现周期|参考收入）

**变现周期说明**：回答"从小白到能挣到第一笔钱需要多少时间"
- 立即（1周内）：如出售现有技能、接单等
- 短期（1-3个月）：如模板销售、简单插件开发
- 中期（3-6个月）：如在线课程、SaaS产品
- 长期（6-12个月）：如开源赞助、技术IP打造
- 超长期（1年以上）：如技术创业、硬核产品研发
08 · AI 冲击评估     → 替代风险 / 增强程度 / 新机会
09 · 避坑清单         → 【致命级】5条 + 【重伤级】10条 + 【中伤级】5条
10 · 掌握路径        → AI时代版：人必须理解的（大白话+专业）+ AI能做的
11 · 中文最佳资源    → 首推 + 在线 + 进阶（各1-2个）
12 · 如何入门        → 第一步行动清单（4步内）
```

### 变现路径排序算法

**加权排序**：睡后收入权重70% + 收入天花板权重30%

| 排序 | 计算逻辑 |
|------|---------|
| 1 | 高被动收入 + 高收入天花板 → Micro-SaaS, API即服务 |
| 2 | 高被动收入 + 中收入天花板 → 在线课程, 开源赞助 |
| 3 | 中被动收入 + 高收入天花板 → 技术咨询, 架构顾问 |
| 4 | 低被动收入 + 中收入天花板 → 外包接单, 自动化脚本 |

**个人可行性标识**：
- 🔴 个人可独立搞定
- 🟡 建议小团队
- 🟢 需要团队

### 变现路径详尽度要求

**核心原则：不设上限，追求详尽**

1. **数量无限制**：每个章节的变现路径条目不设固定数量，通过调研能找到多少条就写多少条
2. **覆盖维度**：
   - 高被动收入（睡后收入）：开源赞助、模板销售、API服务、SaaS产品等
   - 中被动收入：在线课程、技术书籍、付费社群等
   - 主动收入：外包接单、技术咨询、企业培训等
3. **调研来源**（必须参考）：
   - 国内平台：程序员客栈、码市、猪八戒、知乎、掘金、CSDN、知识星球
   - 国际平台：GitHub Sponsors、Upwork、Freelancer、Gumroad、Patreon、Codecanyon
   - 知识付费：掘金小册、极客时间、稀土掘金课程、微信生态（公众号/视频号）
   - 独立开发：Product Hunt、Indie Hackers、小报童
4. **质量要求**：
   - 每条路径必须基于实际调研，注明参考来源（如"程序员客栈2025数据"）
   - 收入数据用区间表示，反映真实市场行情
   - 优先列出个人独立开发者可执行的变现方式

### 变现路径tooltip内容模板（小白学习路径）

**适用位置**：s07表格每行第8列，对应"变现周期"列的tooltip弹窗内容。

#### 模板结构规范

```
📚 小白学习路径（AI时代约X周/月）

阶段一：阶段名称（第X-Y周）
• 技能名称——传统X周→AI时代Y周：简要说明
• 技能名称——传统X周→AI时代Y周：简要说明

阶段二：阶段名称（第X-Y周）
• 技能名称——传统X周→AI时代Y周：简要说明
• 技能名称——传统X周→AI时代Y周：简要说明

...

⚠️ AI帮不了的关键决策：关键决策点1、关键决策点2、关键决策点3
```

#### 必备元素

1. **总时长标题**：`📚 小白学习路径（AI时代约X周/月）`
2. **阶段划分**：按学习逻辑分2-4个阶段，每个阶段标注时间范围
3. **技能条目格式**：
   - `• 技能名称——传统X周→AI时代Y周：简要说明`
   - 必须包含传统学习时间和AI时代时间的对比
   - 说明要强调"AI可生成代码但人需能读懂/判断"
4. **AI替代提示**：用 `⚠️` 标注AI无法替代的关键决策点（2-4个）

#### 阶段划分原则

| 章节类型 | 推荐阶段 |
|---------|---------|
| 开发类（前后端/全栈/桌面） | 基础→框架→实战→部署 |
| 数据类（数据库/数据分析） | SQL基础→设计/分析→优化→架构 |
| 工具类（API/DevOps/低代码） | 协议/平台→设计/搭建→测试/集成→运维 |
| 移动/小程序 | 基础→框架→原生生态接入→上架 |

#### 时间估算基准（2026年AI工具能力）

- **基础语法/概念**：传统2-4周 → AI时代1-2周
- **框架学习**：传统4-6周 → AI时代2-3周
- **项目实战**：传统4-8周 → AI时代2-4周
- **部署上架**：传统2-4周 → AI时代1-2周

### 颜色编码

- **背景**：#0a0e1a（深蓝黑）
- **强调色**：#00ff88（霓虹绿）
- **正文**：#e0e0e0（浅灰）
- **表格边框**：#1a2332

## 66章完整目录

### 基础开发方向（1-10）
1. 前端开发 Frontend
2. 移动端开发 Mobile
3. 后端开发 Backend
4. 数据库开发 Database
5. 全栈开发 Full Stack
6. 桌面应用开发 Desktop
7. 小程序开发 Mini Program
8. 低代码/无代码 Low Code
9. API开发 API Development
10. DevOps开发 DevOps

### 游戏与娱乐（11-16）
11. 游戏开发 Game Development
12. 抖音小游戏 TikTok Mini Games
13. 独立游戏 Indie Game
14. 游戏MOD开发 Game MOD
15. 电竞技术 Esports Tech
16. 元宇宙开发 Metaverse

### 人工智能方向（17-24）
17. 机器学习 ML
18. 深度学习 Deep Learning
19. 自然语言处理 NLP
20. 计算机视觉 CV
21. 推荐系统 Recommendation
22. 具身智能 Embodied AI
23. AI应用开发 AI App Dev
24. 大模型微调 LLM Fine-tuning

### 数据与商业（25-32）
25. 数据分析 Data Analysis
26. 商业智能 BI
27. 数据工程 Data Engineering
28. 量化交易 Quant Trading
29. 增长黑客 Growth Hacking
30. 产品管理 Product Management
31. 技术写作 Technical Writing
32. 技术咨询 Tech Consulting

### 安全与系统（33-38）
33. 网络安全 Cybersecurity
34. 渗透测试 Penetration Testing
35. 区块链开发 Blockchain
36. 智能合约 Smart Contract
37. Web3开发 Web3 Development
38. 密码学 Cryptography

### 云计算与基础设施（39-45）
39. 云计算 Cloud Computing
40. 云原生 Cloud Native
41. 容器技术 Container
42. Kubernetes
43. Serverless
44. 边缘计算 Edge Computing
45. 物联网 IoT

### 内容创作与媒体（46-52）
46. 技术视频 Tech Video
47. 技术播客 Tech Podcast
48. 直播技术 Live Streaming
49. 音视频开发 Multimedia
50. 3D建模与渲染 3D Graphics
51. 数字人 Digital Human
52. AI绘画 AI Art

### 自动化与工具（53-58）
53. 爬虫开发 Web Scraping
54. 自动化测试 Test Automation
55. RPA机器人 RPA
56. 浏览器插件 Browser Extension
57. VSCode插件开发 VSCode Extension
58. CLI工具开发 CLI Tools

### 新兴与前沿（59-66）
59. 机器人编程 Robotics
60. 无人机开发 Drone
61. 嵌入式开发 Embedded
62. 自动驾驶 Autonomous Driving
63. AR/VR开发 AR/VR
64. 空间计算 Spatial Computing
65. 脑机接口 BCI
66. 量子计算 Quantum Computing

## 关键约定

### 写作风格

1. **大白话必须接地气**：
   - ❌ 错误："RESTful API是一种架构风格"
   - ✅ 正确："就像餐厅菜单——你点啥（请求），厨房做啥（处理），服务员端上来（响应）"

2. **AI能做vs人要做清晰区分**：
   - AI能做的：列出具体场景（如"生成CRUD代码"）
   - 人必须做的：强调为什么AI替代不了（如"架构选型决策"）

3. **变现路径必须带来源**：
   - 每条路径注明参考来源（如"程序员客栈2025"）
   - 收入数据用区间（如"5千-10万/单"）

### 表格格式规范

- 使用ASCII表格，边框用 `┌─┬─┐` 风格
- 表头居中对齐
- 内容左对齐，数字/标识居中
- 换行内容用多行表示

### HTML输出规范

- 响应式设计，支持移动端
- 侧边栏导航（可折叠）
- 阅读进度条
- AI搜索框（调用Claude API，带法律合规提示）
- 收藏/标记功能（LocalStorage）

### Word输出规范

- A4横版（16838×11906 DXA）
- 页边距850 DXA
- 两栏布局（左内容右笔记）
- 页脚居中页码
- 单色调色板（#222222, #333333等）

## AI功能规格

### AI搜索

```javascript
// 搜索框组件
- 位置：顶部固定
- 占位符："询问AI关于本文的问题..."
- 提示文字："AI回答仅供参考，关键决策请核实官方文档"

// API调用
- 使用Claude API（模型ID在代码中配置）
- 携带当前章节内容作为context
- temperature: 0.3（降低幻觉）

// 合规提示
- 首次使用显示："AI生成内容可能不准确，请结合官方文档验证"
- 法律相关内容显示："请咨询专业律师，本文不构成法律建议"
```

### AI目标规划

浮动按钮触发，用户设定目标后AI分析并推荐学习路径。包含输入弹窗、分析动画和结果展示区域。相关CSS类：`ai-float-btn`、`ai-input-modal`、`ai-user-goal`。

## 文件结构

```
coderstudy/
├── CLAUDE.md                         # 本文件
├── README.md                         # 项目说明
├── package.json                      # 依赖 + npm脚本
├── generate-coder-landscape.js       # Word生成脚本（模板内容）
├── coder-landscape.html              # 主网页文件（~9874行）
├── chapters_39_45_content.js         # 外部章节内容（被HTML引用）
├── chapters_46_52_content.js
├── chapters_53_58_content.js
├── chapters_59_66_content.js
├── chapters/                         # 少量草稿文件
│   ├── 04-backend.md
│   └── chapter10-devops.js
├── v2/                               # JSON管道（v2构建系统）
│   ├── package.json
│   ├── data/chapters.json            # 章节JSON数据库（386KB）
│   ├── output/                       # 构建输出目录
│   ├── scripts/
│   │   ├── init-db.js                # 初始化空数据库
│   │   ├── import-data.js            # 从HTML提取内容到JSON
│   │   ├── build.js                  # 从JSON生成HTML+Word
│   │   └── add-chapter.js            # CLI章节管理工具
│   └── templates/                    # HTML模板
└── (根目录大量 check_*.js / diagnose_*.js 为调试脚本，可忽略)
```

## 生成流程

### v1（当前主要方式）

HTML内容直接在 `coder-landscape.html` 内联维护，Word生成器只产生模板占位内容：

1. 手动编辑 `coder-landscape.html` 中的 `chapterContent` 对象
2. 对于39-66章，编辑外部 `chapters_XX_YY_content.js` 文件
3. `generate-coder-landscape.js` 生成Word文档（仅模板骨架）

### v2（JSON管道，实验性）

通过 `v2/` 目录的JSON管道生成两种输出：

1. `npm run v2:import` — 从HTML的 `chapterContent` 提取内容到 `v2/data/chapters.json`
2. 在 `chapters.json` 中编辑章节数据
3. `npm run v2:build` — 从JSON同时生成HTML和Word文档
4. `npm run v2:preview` — 预览生成的v2网页

## HTML架构

`coder-landscape.html`（~9874行）是一个单页应用，结构如下：

| 行号范围 | 内容 |
|---------|------|
| 1-~2394 | CSS（深色主题，CSS变量定义） |
| ~2395-2620 | HTML body（进度条、header、侧边栏、内容区、AI弹窗） |
| 2621-2624 | 外部 `<script>` 引入39-66章内容 |
| 2625-~9874 | 主JS块 |

主JS块包含：
- `chapters` 数组 — 66章元数据（id、标题、分类）
- `chapterContent` 对象 — 1-38章内容内联在此
- `Object.assign(chapterContent, window.chapterContentXXtoYY)` — 合并39-66章外部内容
- `generateChapterHTML(ch)` — 根据内容完整度决定详细渲染还是模板渲染
- LocalStorage — 阅读进度、收藏、标记
- 侧边栏导航渲染、搜索、AI功能

### 内容加载模型

- **1-38章**：内容直接内联在HTML的 `chapterContent` 对象中
- **39-66章**：内容在外部 `chapters_XX_YY_content.js` 文件中，通过 `<script>` 标签加载，用 `Object.assign` 合并
- **渲染判断**：`generateChapterHTML(ch)` 检查 `s01/s02/s03/s05/s06/s07/s09/s10/s12` 字段，齐全则用详细渲染，否则用模板
- **Word生成器**：`generate-coder-landscape.js` 始终使用模板占位内容，不读取HTML中的详细内容

## 注意事项

- 所有引用必须带来源链接
- 收入数据基于2026年市场调研
- AI工具信息需验证最新版本
- 定期更新（建议每季度）
