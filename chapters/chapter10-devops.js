// 第10章 DevOps开发 完整内容数据
// 可直接插入 coder-landscape.html 的 chapterContent 对象中

10: {
  s01: {
    professional: "DevOps（Development and Operations）是一种融合软件开发（Dev）与IT运维（Ops）的文化、实践和工具集，旨在缩短系统开发生命周期，同时提供持续高质量的软件交付。核心实践包括CI/CD持续集成部署、基础设施即代码（IaC）、容器化、监控告警、自动化测试等，强调开发与运维的协作、自动化和反馈循环。",
    simple: "就像餐厅后厨的流水线和品控——以前是厨师（开发）做完菜直接扔给服务员（运维）端出去，出问题互相甩锅。DevOps是两人一起设计流程：自动洗菜切菜（自动化构建）、每道菜都尝一下（自动化测试）、热菜自动传送到餐桌（自动部署），出问题一起担责。",
    status2026: "2026年DevOps已进入平台工程（Platform Engineering）时代，AI Agent深度融入运维流程：自动生成Terraform配置、智能诊断告警根因、AIOps实现预测性维护。GitOps成为标配，ArgoCD/Flux接管K8s部署。DevSecOps加速普及，安全扫描正成为CI/CD管道的标准实践。多云管理成为刚需，FinOps成本优化受企业重视。"
  },
  s02: [
    "设计并维护CI/CD流水线（代码提交→自动构建→测试→部署）",
    "容器化应用开发（Docker镜像构建、优化、多阶段构建）",
    "Kubernetes集群管理与编排（部署、扩缩容、服务发现）",
    "基础设施即代码（Terraform/Pulumi/CloudFormation编写云资源）",
    "监控告警体系搭建（Prometheus+Grafana/ELK/云监控）",
    "自动化测试集成（单元测试、集成测试、E2E测试嵌入流水线）",
    "版本控制与Git工作流管理（分支策略、代码审查、GitOps）",
    "故障排查与应急响应（日志分析、链路追踪、混沌工程）",
    "云成本优化与资源管理（FinOps实践、自动伸缩策略）",
    "安全合规与审计（密钥管理、漏洞扫描、合规检查）"
  ],
  s03: [
    ["CI/CD工程师", "专注自动化构建、测试、部署流水线设计与优化"],
    ["SRE（站点可靠性工程）", "保障系统稳定性、SLO/SLA管理、故障响应"],
    ["平台工程师", "建设内部开发者平台（IDP），提供自助服务基础设施"],
    ["容器/K8s工程师", "专注容器化、Kubernetes集群运维、Operator开发"],
    ["云架构师", "多云/混合云架构设计、云原生方案选型、成本优化"],
    ["DevSecOps工程师", "安全左移、安全扫描集成、合规自动化"],
    ["运维开发", "开发运维工具、自动化脚本、可观测性平台"],
    ["GitOps工程师", "基于Git的声明式基础设施和应用交付"]
  ],
  s04: {
    tools: "CI/CD: Jenkins, GitLab CI, GitHub Actions, CircleCI, ArgoCD；容器: Docker, containerd, BuildKit；编排: Kubernetes, Helm, Kustomize；IaC: Terraform, Pulumi, Ansible, Chef；监控: Prometheus, Grafana, ELK Stack, Jaeger；云: AWS/Azure/GCP/阿里云CLI和SDK；脚本: Bash, Python, Go；Git: Git, GitHub, GitLab, Bitbucket",
    aiNative: "有。GitHub Copilot可生成CI/CD配置；Terraform AI助手生成HCL代码；K8sGPT智能诊断K8s问题；AIOps平台（Datadog/Dynatrace）AI根因分析；Claude Code可编写复杂基础设施代码"
  },
  s05: [
    ["GitHub Copilot", "生成Dockerfile、CI/CD配置、Terraform代码"],
    ["K8sGPT", "Kubernetes集群问题智能诊断与修复建议"],
    ["Terraform AI", "根据描述生成HCL基础设施代码"],
    ["Claude Code", "复杂部署脚本、多环境配置管理、架构设计"],
    ["Datadog/Dynatrace", "AIOps智能告警、异常检测、根因分析"],
    ["OpsGenie AI", "智能On-call路由、故障影响分析"],
    ["ChatGPT", "编写Shell脚本、排查报错、学习新技术"],
    ["GitLab Duo", "代码审查、CI/CD优化建议、安全扫描"],
    ["Snyk", "依赖漏洞扫描、容器镜像安全检测"],
    ["Claude Dev", "基础设施即代码项目开发、自动化工具编写"]
  ],
  s06: {
    must: [
      "Linux基础（命令行、文件系统、进程管理、权限）",
      "Git版本控制（分支管理、合并冲突、Git工作流）",
      "Docker容器化（镜像构建、容器管理、Docker Compose）",
      "至少一种CI/CD工具（GitHub Actions/GitLab CI/Jenkins）",
      "基础云平台操作（AWS/Azure/阿里云任一）",
      "YAML配置语法（K8s/CI/CD配置都用这个）",
      "基础网络知识（DNS、HTTP、负载均衡、SSL）",
      "使用AI辅助写配置的能力"
    ],
    notNeeded: [
      "深入掌握多种编程语言（会Bash+一门即可）",
      "手写复杂K8s Operator（初期用Helm足够）",
      "自建完整监控体系（先用云厂商托管服务）",
      "精通内核调优（除非做SRE方向）",
      "手写复杂分布式系统（初期用托管服务）",
      "成为所有云平台专家（先精通一个）"
    ]
  },
  s07: [
    ["1", "DevOps平台/工具销售", "开发CI/CD工具、部署自动化工具、监控工具销售", "🔴", "被动", "几千-几十万/年"],
    ["2", "DevOps咨询服务", "企业DevOps转型咨询、CI/CD流程设计、工具链选型", "🔴", "按项目", "5万-50万/单"],
    ["3", "基础设施即代码(IaC)服务", "Terraform/Pulumi基础设施代码编写、云平台架构", "🔴", "1-2月", "5万-30万/单"],
    ["4", "Kubernetes部署服务", "K8s集群搭建、应用容器化、Helm Chart开发", "🔴", "1-3月", "5万-50万/单"],
    ["5", "监控告警平台", "开发或部署Prometheus/Grafana/ELK监控方案", "🔴", "1-2月", "3万-30万/单"],
    ["6", "DevOps培训课程", "Docker/K8s/CI/CD实战课程、认证培训", "🔴", "2-3月", "几千-几十万/年"],
    ["7", "GitOps实施服务", "ArgoCD/Flux GitOps工作流搭建、配置管理", "🔴", "1-2月", "3万-20万/单"],
    ["8", "自动化运维脚本", "开发自动化部署、备份、清理脚本工具", "🔴", "被动", "几百-几万/年"],
    ["9", "DevSecOps安全集成", "安全扫描集成、合规检查、漏洞管理流程", "🔴", "2-3月", "5万-30万/单"],
    ["10", "多云管理平台", "开发跨云资源管理、成本优化、统一监控平台", "🟡", "3-6月", "10万-100万/单"],
    ["11", "SRE运维外包", "为企业提供7x24运维服务、On-call支持", "🟡", "按月", "2万-10万/月"],
    ["12", "混沌工程平台", "开发故障注入、韧性测试、灾备演练平台", "🟡", "3-6月", "10万-50万/单"],
    ["13", "FinOps成本优化", "云成本分析、资源优化、预算管理咨询服务", "🔴", "按月", "1万-5万/月"],
    ["14", "DevOps模板市场", "出售CI/CD模板、Dockerfile模板、K8s YAML模板", "🔴", "被动", "几百-几万/年"],
    ["15", "平台工程咨询", "内部开发者平台(IDP)建设、自助服务门户", "🟡", "3-6月", "20万-100万/单"]
  ],
  s08: {
    replaceRisk: "中——AI可生成基础设施代码和自动化脚本，但架构设计、故障排查、跨团队协作仍需人工；AIOps辅助但不替代SRE判断",
    enhanceLevel: "高——AI大幅提升基础设施代码生成效率，智能诊断缩短MTTR，自动化程度提升让工程师专注高价值工作",
    newOpportunities: "平台工程、AI运维助手、FinOps成本优化、DevSecOps自动化、多云管理平台"
  },
  s09: {
    fatal: [
      "生产环境直接修改配置导致服务中断",
      "未测试备份恢复流程，真正灾难时无法恢复",
      "将密钥/密码硬编码在代码中提交到Git",
      "CI/CD流水线有权限滥用（如生产密钥可被任意Job访问）",
      "生产环境无监控告警，故障全靠用户报告"
    ],
    serious: [
      "忽视安全扫描，镜像包含高危CVE漏洞",
      "K8s RBAC配置过于宽松，权限过大",
      "未设置资源限制导致集群资源耗尽崩溃",
      "日志 retention 策略不当，磁盘满导致服务中断",
      "单点故障（如单节点K8s、单副本数据库）",
      "未做灰度发布，全量部署引发大规模故障",
      "Terraform状态文件管理不当导致基础设施漂移",
      "未记录运维手册，关键流程只有一人掌握",
      "忽视成本管理，云账单失控",
      "未做混沌工程测试，系统韧性未知"
    ],
    moderate: [
      "Docker镜像体积过大，拉取缓慢",
      "日志级别配置不当，信息过多或过少",
      "未使用基础设施即代码，手动配置环境",
      "告警阈值设置不合理，频繁误报或漏报",
      "未做文档自动化，文档与代码不同步"
    ]
  },
  s10: {
    humanMust: [
      "系统架构设计思维（怎么拆分、怎么扩展）",
      "故障排查与根因分析能力（为什么挂了、怎么定位）",
      "安全合规意识（哪里可能泄露、怎么防护）",
      "成本效益权衡（自建vs托管、资源怎么配）",
      "跨团队沟通协作（推动DevOps文化落地）"
    ],
    aiCanDo: [
      "生成Dockerfile和docker-compose配置",
      "编写Terraform/CloudFormation基础设施代码",
      "生成CI/CD流水线配置",
      "辅助排查常见错误和日志分析",
      "生成监控告警规则配置",
      "编写自动化运维脚本",
      "K8s YAML配置生成与验证"
    ]
  },
  s11: {
    recommend: "《凤凰项目》（运维经典小说）+ Kubernetes官方文档（kubernetes.io/docs）+ Terraform官方教程",
    online: "极客时间《DevOps实战笔记》+ 云原生技术社区（Cloud Native Community）+ B站尚硅谷Docker/K8s教程",
    advanced: "《Google SRE手册》+ 《Terraform最佳实践》+ KubeCon演讲视频 + AWS/Azure架构师认证"
  },
  s12: [
    "步骤1：在本地安装Docker，运行第一个Nginx容器，理解镜像、容器、仓库概念",
    "步骤2：用GitHub Actions为你的项目搭建CI流水线（代码提交自动跑测试）",
    "步骤3：用Terraform在云平台（AWS/阿里云）创建一台服务器，体会基础设施即代码",
    "步骤4：在本地用minikube或kind搭建K8s集群，部署一个简单的Web应用"
  ]
}
