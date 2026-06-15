// ----------------------------- 案例数据库（按 PDF 顺序：HBN → Champion 情人节 → Champion 裴珠泫）--------------------------------
const caseGroups = [
    {
        id: "hbn_618",
        groupNum: "01",
        brand: "HBN 护家科技",
        title: "HBN 发光水 · 微博 618 大促投放",
        period: "2025.03 - 2025.09",
        role: "产品营销实习生（独立操盘）",
        summary: "618 大促整体 ROI 达 3.65，实习期累计操盘 70w+ 预算，深度下钻 LGBTQ 圈层",
        brandColor: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        cover: "assets/cases/hbn/2.png",
        // 图片元数据:用于展示前的简介标注
        imageMeta: {
            "2.png": { caption: "案例封面 · HBN 发光水", hint: "1920×1080 · 16:9", tag: "封面" },
            "3.png": { caption: "HBN 投放策略总览", hint: "20W 投放 / 6400W+ 曝光 / 180% GMV 增长 / 93.22% ROI", tag: "策略" },
            "4.png": { caption: "双内容框架:老号主力 + 新号破圈", hint: "魔性种草撬动 Z 世代", tag: "内容" },
            "5.png": { caption: "LGBTQ 圈层下钻:场景定制", hint: "熬夜急救 → 约会提亮", tag: "圈层" },
            "6.png": { caption: "经验沉淀:四步可复用方法论", hint: "新号比例 / 圈层洞察 / 测试迭代 / 模板化", tag: "复盘" }
        },
        images: [
            "assets/cases/hbn/2.png",
            "assets/cases/hbn/3.png",
            "assets/cases/hbn/4.png",
            "assets/cases/hbn/5.png",
            "assets/cases/hbn/6.png"
        ],
        metrics: [
            { label: "季度预算", value: "70w+" },
            { label: "合作 KOL", value: "280+" },
            { label: "大促 ROI", value: "3.65" },
            { label: "投流 ROI", value: "4.8" }
        ],
        challenge: "核心爆品发光水已是品牌主力，但在微博渠道 618 大促期面临两大问题：1）ROI 增长匮乏；2）用户圈层固化（集中在老客），需要找到破圈人群种草植入心智。",
        strategy: "双内容框架驱动：老号主力转化 + 新号魔性破圈。预售期分两波集中曝光打认知，超长现货期持续捞转破圈，狠抓摇摆客。同时下钻 LGBTQ 圈层定制场景。",
        execution: [
            "分两波预售集中爆发：第一波预售打认知、第二波预售收转化，超长现货期持续捞转摇摆客",
            "老号主力三步走：【一眼看懂的促销机制】+【真实使用体验】+【沙利文销量背书】",
            "新号破圈：魔性种草「路过的蚂蚁都得买两支装发光水」，用情绪化重复+活人感碎碎念洗脑 Z 世代",
            "下钻 LGBTQ 圈层：从评论区挖掘真实需求，将熬夜打游戏场景转向约会急救提亮，强调去黄气、精致感",
            "沉淀「金句+场景+痛点」投流模板，实时盯盘调优，从 0-1 搭建微博投流机制"
        ],
        results: "618 大促整体 ROI 达 3.65，实习期累计操盘 70w+ 预算，深度下钻时尚/情感/LGBTQ 圈层，大促节点集中收割转化 ROI 达 1.63，平销期投流 ROI 4.8。",
        insights: [
            "保持新号比例，发挥破圈优势：通过内容挑选、数据筛选挖出有潜力的新博主",
            "从关键词、评论中提取真实痛点和语境，定制化内容产出",
            "快速测试迭代：预售期小预算测试魔性内容，验证后大促期放大",
            "「金句+场景+痛点」可复用模板，能有效提升热门率与进店率"
        ],
        tableData: {
            title: "阶段数据拆解",
            headers: ["阶段", "核心动作", "KOL 数量", "ROI"],
            rows: [
                ["预售期", "老号主力促销+新号测试", "120+", "3.2"],
                ["现货期", "集中捞转摇摆客", "160+", "4.1"],
                ["平销期", "投流模板复用", "—", "4.8"]
            ]
        }
    },
    {
        id: "champion_valentine",
        groupNum: "02",
        brand: "Champion 市场部",
        title: "Champion 情人节 · 产品营销 Campaign",
        period: "2025.09 - 2026.02",
        role: "产品营销实习生",
        summary: "情人节单期 600w 曝光、5w+ 互动、CPE 5.8，引流超 4.2w 进店 UV",
        brandColor: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        cover: "assets/cases/champion-valentine/7.png",
        imageMeta: {
            "7.png":  { caption: "案例封面 · Champion 情人节", hint: "1920×1080 · 16:9", tag: "封面" },
            "8.png":  { caption: "「爱要马不停蹄」故事概念", hint: "马蹄铁符号 × 双向奔赴叙事", tag: "创意" },
            "9.png":  { caption: "内容种草规划:话题 + 内容公式", hint: "主话题 #我们的爱从不止步#", tag: "规划" },
            "10.png": { caption: "穿搭风格参考 + 内容 demo", hint: "复古运动风 · 低饱和度色彩", tag: "Demo" }
        },
        images: [
            "assets/cases/champion-valentine/7.png",
            "assets/cases/champion-valentine/8.png",
            "assets/cases/champion-valentine/9.png",
            "assets/cases/champion-valentine/10.png"
        ],
        metrics: [
            { label: "曝光量", value: "600w+" },
            { label: "互动量", value: "5w+" },
            { label: "CPE", value: "5.8" },
            { label: "进店 UV", value: "4.2w" }
        ],
        challenge: "参与 2025 年赛车鞋、经典冠贝鞋、情人节等 5 场核心营销 Campaign，需在情人节节点将经典鞋款与情感价值深度绑定，提升年轻用户购买欲。",
        strategy: "情感共鸣切入+情侣穿搭 fitcheck，结合马蹄铁细节营造「双向奔赴」叙事；优化脚本、封面、引流路径提升 KOL 内容质量。",
        execution: [
            "小红书+抖音达人矩阵：围绕情侣日常、旅行、共同成长等情感场景",
            "内容公式：复古运动风 + 低饱和度色彩 + 互动动作展示鞋子",
            "话题 #我们的爱从不止步# 引导 UGC，激发用户二次传播",
            "前置参与 2027 年新品主题设计，为研发团队提供 10+ 产品设计创意"
        ],
        results: "单期项目达到近 600w 曝光与 5w+ 互动量，CPE 5.8，高效引流超 4.2w 进店 UV，鞋子品类搜索量提升明显。",
        insights: [
            "情感营销必须与产品细节强关联（马蹄铁符号就是品牌钩子）",
            "达人内容必须露出穿搭场景而非硬广",
            "复古运动风贴合 Z 世代审美，是产品破圈的关键抓手",
            "Brief 标准化能显著降低多达人执行偏差"
        ],
        tableData: {
            title: "平台分发拆解",
            headers: ["平台", "达人数量", "总互动", "进店率"],
            rows: [
                ["小红书", "25", "3.2w", "2.8%"],
                ["抖音", "15", "1.8w", "2.1%"]
            ]
        }
    },
    {
        id: "champion_artist",
        groupNum: "03",
        brand: "Champion 市场部",
        title: "Champion 艺人 Seeding · 明星同款营销",
        period: "2025.12 - 2026.02",
        role: "明星营销负责人",
        summary: "借势 Irene 杂志曝光撬动粉圈流量，策划话题+社媒矩阵转化品牌资产",
        brandColor: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        cover: "assets/cases/champion-xiu/11.png",
        imageMeta: {
            "11.png": { caption: "案例封面 · 裴珠泫明星同款", hint: "1920×1080 · 16:9", tag: "封面" },
            "12.png": { caption: "营销号内容投放规划", hint: "颜值 + 带货双重话题多角度铺量", tag: "投放" },
            "13.png": { caption: "博主矩阵:明星同款 / 潮流 / 时尚", hint: "裴珠泫同款引爆销量", tag: "矩阵" }
        },
        // 14.png 已正确归类至 实习经历 模块,不再属于本案例
        images: [
            "assets/cases/champion-xiu/11.png",
            "assets/cases/champion-xiu/12.png",
            "assets/cases/champion-xiu/13.png"
        ],
        metrics: [
            { label: "艺人曝光", value: "200w+" },
            { label: "话题阅读", value: "800w" },
            { label: "进店 UV", value: "2w+" }
        ],
        challenge: "Champion 融合赛车运动与芭蕾美学推出「羽翼薄底鞋」，主打「运动少女风」，需快速建立明星同款心智、撬动粉圈流量。",
        strategy: "主动策划裴珠泫 Irene 的《Purple Pearl》杂志拍摄植入，借势杂志曝光，策划话题+社媒矩阵，将明星流量转化为品牌资产，带动进店转化。",
        execution: [
            "确定 Irene 为封面明星，提前锁定鞋款在拍摄中的露出位",
            "营销号统一输出「颜值+带货」双重话题，多角度铺量",
            "小红书+微博矩阵同步发酵，引导粉丝晒单冲话题榜",
            "私域社群二次分发同款素材，缩短从种草到转化的链路"
        ],
        results: "借势杂志曝光撬动粉圈流量，营销号内容累计进店 2w+，成功将明星流量转化为品牌资产，带动同款薄底鞋售罄。",
        insights: [
            "艺人合作要前置植入到内容拍摄中，不能等成片再补",
            "粉圈营销需要多个营销号同时铺量不同角度，形成信息密度",
            "同款素材要快速分发至私域社群，缩短转化链路",
            "明星调性必须与产品风格高度匹配（Irene 优雅 + 运动少女风）"
        ],
        tableData: {
            title: "明星同款传播矩阵",
            headers: ["渠道", "内容条数", "总互动", "转化"],
            rows: [
                ["微博营销号", "12", "15w", "进店 2w+"],
                ["小红书", "8", "4w", "晒单 / 收藏"]
            ]
        }
    }
];

// ----------------------------- 实习经历模块数据（个人介绍页作为视觉主体）--------------------------------
const internshipData = {
    title: "实习经历",
    subtitle: "1 年媒介投放实战经验 · 累计操盘 100w+ 预算",
    // 品牌色:用于卡片左上角 4px 色条 + 数字徽章底色
    brandColors: {
        hbn: "#ff8a65",       // 暖橙(HBN 调性:发光水/精华)
        champion: "#5b8def",  // 蓝(Champion 调性:运动潮牌)
        oppo: "#66bb6a"       // 绿(OPPO 调性:科技)
    },
    // 顶部"能力图谱"六维评分(0-100),用于雷达图 + 数字徽章
    radar: [
        { label: "内容力",   score: 95 },
        { label: "创意力",   score: 92 },
        { label: "转化力",   score: 88 },
        { label: "营销力",   score: 90 },
        { label: "达人资源", score: 93 },
        { label: "人群洞察", score: 89 }
    ],
    // 顶部"running tagline"数据条
    taglineStats: [
        { value: "100w+", label: "操盘预算" },
        { value: "5w+",   label: "单期互动" },
        { value: "280+",  label: "合作 KOL" },
        { value: "1.63",  label: "大促 ROI" }
    ],
    // 3 段经历,每段含量化锚点(三段并列布局,中间位置放置 HBN,排序:Champion - HBN - OPPO)
    items: [
        // 左卡:Champion
        {
            brand: "Champion 市场部",
            role: "产品营销实习生",
            period: "2025.09 - 2026.02",
            brandKey: "champion",
            headline: "情人节单期 600w 曝光 · 5w+ 互动 · CPE 5.8",
            metrics: [
                { value: "600w",   label: "单期曝光",   highlight: true },
                { value: "5w+",    label: "互动量" },
                { value: "5.8",    label: "CPE" },
                { value: "4.2w",   label: "进店 UV" },
                { value: "5",      label: "核心 Campaign" },
                { value: "10+",    label: "产品创意" }
            ],
            summary: [
                { icon: "🎯", tag: "核心职责", text: "参与 5 场核心 Campaign(赛车鞋/情人节等),把控 Brief、脚本、封面与引流全链路" },
                { icon: "⚡", tag: "关键成果", text: "情人节单期 600w 曝光 / 5w+ 互动 / CPE 5.8,引流 4.2w 进店 UV" },
                { icon: "🎯", tag: "核心职责", text: "独立负责马嘉祺/丁禹兮/Irene 裴珠泫等明星同款营销,矩阵化深度绑定品牌" }
            ]
        },
        // 中卡:HBN(中间位置,视觉重心)
        {
            brand: "HBN 护家科技",
            role: "产品营销实习生",
            period: "2025.03 - 2025.09",
            brandKey: "hbn",
            headline: "618 大促整体 ROI 3.65 · 实习期操盘 70w+ 预算",
            metrics: [
                { value: "3.65",   label: "618 大促 ROI",   highlight: true },
                { value: "1.63",   label: "节点种草 ROI" },
                { value: "4.8",    label: "平销投流 ROI" },
                { value: "70w+",   label: "季度预算" },
                { value: "280+",   label: "触达 KOL" },
                { value: "150+",   label: "热门内容" }
            ],
            summary: [
                { icon: "🎯", tag: "核心职责", text: "独立操盘微博渠道 618 大促全链路,统筹 50+ 达人选号、内容与挂链,大促整体 ROI 冲到 3.65" },
                { icon: "⚡", tag: "关键成果", text: "定制 Seeding Brief 深耕时尚/情感/LGBTQ 圈层,产出 150+ 热门内容,种草 ROI 1.63" },
                { icon: "🔄", tag: "方法沉淀", text: "0-1 搭建微博投流机制,实时盯盘沉淀「金句+场景+痛点」模板,平销期投流 ROI 4.8" }
            ]
        },
        // 右卡:OPPO
        {
            brand: "OPPO · KOL 运营",
            role: "媒介投放实习生",
            period: "2024.12 - 2025.03",
            brandKey: "oppo",
            headline: "运营 500+ 红人社群 · 输出 30+ 创意方向",
            metrics: [
                { value: "500+",   label: "红人社群",   highlight: true },
                { value: "30+",    label: "创意方向" },
                { value: "3",      label: "3C 数码垂类" },
                { value: "3",      label: "传播阶段" }
            ],
            summary: [
                { icon: "🎯", tag: "核心职责", text: "操盘抖音/小红书预热-发布-首销三阶段传播规划,输出 30+ 条创意方向并落地" },
                { icon: "🔄", tag: "方法沉淀", text: "深耕巨量星图/云图数据,精细化推流;按账号规模分级运营 500+ 红人社群" }
            ]
        }
    ]
};

// ----------------------------- 校园经历模块数据(深圳大学宣传部 · 数据卡片墙布局)--------------------------------
const campusData = {
    title: "校园经历",
    subtitle: "深圳大学宣传部 · 新媒体运营主编",
    period: "2023.09 - 2025.12",
    role: "新媒体运营主编",
    brandColors: {
        szu: "#1976d2"  // 深大蓝
    },
    // 顶部 tagline 数据条
    taglineStats: [
        { value: "30w+",  label: "@深圳大学 涨粉" },
        { value: "50w+",  label: "活动话题浏览" },
        { value: "1200+", label: "UGC 用户参与" },
        { value: "1500+", label: "线下参与人数" }
    ],
    items: [
        {
            brand: "深圳大学宣传部",
            role: "新媒体运营主编",
            period: "2023.09 - 2025.12",
            brandKey: "szu",
            headline: "@深圳大学 官方微博涨粉 30w+ · 策划 FIRST 主动放映深大站",
            metrics: [
                { value: "30w+",  label: "账号涨粉",   highlight: true },
                { value: "+20%",  label: "平均阅读量" },
                { value: "1200+", label: "UGC 用户" },
                { value: "50w+",  label: "活动浏览" },
                { value: "1500+", label: "线下参与" }
            ],
            summary: [
                { icon: "🎯", tag: "核心职责", text: "负责 @深圳大学 官方微博运营,联动校园社媒矩阵,在任涨粉 30w+,阅读量 +20%" },
                { icon: "⚡", tag: "关键成果", text: "策划毕业季/开学季热点话题,引导 1200+ UGC,OPPO/VIVO/腾讯音乐商业化热搜" },
                { icon: "🔄", tag: "方法沉淀", text: "主导 FIRST 主动放映深大站,话题 #FIRST 主动放映深大站# 50w+ 浏览,1500+ 线下参与" }
            ]
        }
    ]
};

// 兼容旧引用（如有）
const projects = caseGroups;

// ----------------------------- 个人特质关键词(从简历「自我评价」提炼)--------------------------------
const traitKeywords = [
    "深耕潮流社区",
    "Z 世代圈层洞察",
    "美妆 · 影视 · 综艺 · 亚文化",
    "全平台内容逻辑",
    "数据驱动内容迭代",
    "创意拆解热点",
    "多任务执行能力"
];
