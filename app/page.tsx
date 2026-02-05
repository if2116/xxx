'use client';

import { useState, useEffect, useRef } from 'react';

// ==================== 类型定义 ====================
interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  inScope: boolean;
  category?: 'product' | 'solution' | 'delivery' | 'contact';
  answer: string;
  suggestions?: string[];
}

// ==================== 图标组件 ====================
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const ArrowUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

// ==================== 智能客服组件 ====================
const quickQuestions = [
  '你们能做什么？',
  '私有化部署支持吗？',
  '交付周期多长？',
  '有哪些行业方案？',
  '如何对接我们的系统？',
  '预约演示怎么约？',
];

const fallbackSuggestions = [
  '介绍一下你们的产品能力',
  '有金融行业解决方案吗？',
  '从需求到交付大概需要多久',
  '如何联系你们预约演示',
];

const chatKnowledgeBase: Record<string, ChatResponse> = {
  // 产品与能力
  '产品能力': {
    inScope: true,
    category: 'product',
    answer: '我们提供八大核心能力：\n\n• 云资源与成本治理：统一管理多云资源，优化成本支出\n• 统一身份与权限审计：细粒度权限控制，全程操作审计\n• 知识库/RAG检索增强：企业级知识管理，智能问答\n• 多智能体/工作流编排：AI Agent 协同，自动化业务流程\n• 智能客服与工单联动：7×24小时在线服务，工单自动流转\n• API集成与数据连接：标准化接口，快速对接现有系统\n• 可观测性与日志追踪：全链路监控，问题快速定位\n• 私有化/离线部署：支持本地化部署，数据完全可控',
    suggestions: ['私有化部署支持吗？', '如何对接我们的系统？'],
  },
  'RAG': {
    inScope: true,
    category: 'product',
    answer: '我们的 RAG（检索增强生成）能力支持：\n\n• 多源数据接入：文档、网页、数据库、API 等\n• 智能分块与向量化：自动识别文档结构，优化检索效果\n• 混合检索：结合关键词检索和语义检索，提升召回准确率\n• 企业级知识库：支持百万级文档，秒级响应\n• 多模态支持：文本、图片、表格等多种内容类型',
    suggestions: ['如何对接我们的系统？', '预约演示怎么约？'],
  },
  '智能体': {
    inScope: true,
    category: 'product',
    answer: '我们的多智能体（Agent）平台提供：\n\n• 可视化编排：拖拽式设计工作流，零代码搭建 AI 应用\n• 多 Agent 协同：支持多个智能体分工协作，完成复杂任务\n• 工具调用：内置 100+ 常用工具，支持自定义工具扩展\n• 记忆管理：长期记忆与短期记忆结合，上下文连贯\n• 企业级部署：支持私有化部署，数据安全可控',
    suggestions: ['私有化部署支持吗？', '预约演示怎么约？'],
  },
  '工作流': {
    inScope: true,
    category: 'product',
    answer: '工作流编排引擎支持：\n\n• 可视化流程设计：直观的流程图界面，业务人员也能配置\n• 条件分支与循环：支持复杂的业务逻辑\n• 集成能力：内置各种 API、数据库、消息队列连接器\n• 定时任务：支持 Cron 表达式，自动化执行\n• 监控告警：实时监控流程状态，异常自动告警',
    suggestions: ['如何对接我们的系统？', '有哪些行业方案？'],
  },
  '私有化部署': {
    inScope: true,
    category: 'product',
    answer: '我们完全支持私有化部署：\n\n• 部署方式：支持本地服务器、私有云、混合云等多种模式\n• 硬件要求：最低 4 核 CPU、16GB 内存即可运行 Demo\n• 离线环境：支持完全离线部署，无需外网访问\n• 数据安全：所有数据存储在本地，完全自主可控\n• 快速交付：标准环境 3-5 天完成部署，定制化环境 2-4 周',
    suggestions: ['交付周期多长？', '预约演示怎么约？'],
  },
  '对接': {
    inScope: true,
    category: 'product',
    answer: '我们提供多种系统集成方式：\n\n• REST API：标准 RESTful 接口，支持所有主流编程语言\n• SDK 支持：提供 Python、Java、Go 等语言 SDK\n• Webhook：支持事件回调，实时推送数据\n• 数据库直连：支持 MySQL、PostgreSQL、Oracle 等主流数据库\n• SSO 集成：支持 LDAP、OAuth2、SAML 等单点登录协议\n• 消息队列：支持 Kafka、RabbitMQ 等消息中间件',
    suggestions: ['私有化部署支持吗？', '预约演示怎么约？'],
  },

  // 行业解决方案
  '金融': {
    inScope: true,
    category: 'solution',
    answer: '金融行业解决方案包括：\n\n• 智能风控：AI 驱动的风险评估与预警，降低信贷风险\n• 智能客服：7×24小时在线服务，降低人工成本\n• 合规审计：自动化合规检查，满足监管要求\n• 数据治理：统一数据标准，提升数据质量\n• 典型案例：某城商行部署后，客服效率提升 60%，风险识别准确率提升 40%',
    suggestions: ['你们能做什么？', '预约演示怎么约？'],
  },
  '政务': {
    inScope: true,
    category: 'solution',
    answer: '政务解决方案包括：\n\n• 一网通办：整合政务服务，实现"最多跑一次"\n• 智能审批：AI 辅助审批，缩短办理时限\n• 政务知识库：政策文件智能检索，精准问答\n• 数据共享：打破数据孤岛，实现跨部门协同\n• 典型案例：某地级市部署后，事项办理时限平均缩短 50%',
    suggestions: ['交付周期多长？', '预约演示怎么约？'],
  },
  '医疗': {
    inScope: true,
    category: 'solution',
    answer: '医疗行业解决方案包括：\n\n• 智能导诊：AI 症状分析，精准推荐科室\n• 病历结构化：自动提取病历关键信息\n• 医学知识库：临床指南、药物说明书智能检索\n• 科研辅助：文献检索、数据统计分析\n• 典型案例：某三甲医院部署后，导诊准确率达 92%',
    suggestions: ['私有化部署支持吗？', '预约演示怎么约？'],
  },
  '制造业': {
    inScope: true,
    category: 'solution',
    answer: '制造业解决方案包括：\n\n• 设备预测性维护：AI 分析设备数据，提前预警故障\n• 质量检测：计算机视觉辅助质检，提升良品率\n• 供应链优化：智能排产，降低库存成本\n• 知识管理：工艺文档、维修经验智能检索\n• 典型案例：某汽车零部件厂部署后，设备故障率降低 35%',
    suggestions: ['交付周期多长？', '如何对接我们的系统？'],
  },
  '能源': {
    inScope: true,
    category: 'solution',
    answer: '能源行业解决方案包括：\n\n• 智能调度：AI 优化电力调度，提升电网稳定性\n• 负荷预测：精准预测用电负荷，优化发电计划\n• 设备运维：预测性维护，减少停机时间\n• 安全巡检：计算机视觉辅助巡检，提升效率\n• 典型案例：某能源企业部署后，调度效率提升 25%',
    suggestions: ['私有化部署支持吗？', '预约演示怎么约？'],
  },

  // 交付流程
  '交付周期': {
    inScope: true,
    category: 'delivery',
    answer: '我们的交付流程高效透明：\n\n【Demo 阶段】\n• 需求沟通：1-2 天，明确业务场景和核心需求\n• 方案设计：1-2 天，输出技术方案和实施计划\n• 快速搭建：3-5 天，完成 Demo 环境部署\n• Demo 演示：1 天，展示核心功能效果\n\n【正式交付】\n• 标准项目：4-8 周，包含需求分析、系统设计、开发实施、测试验收\n• 定制化项目：8-16 周，根据复杂度评估\n\n优势：小团队即可交付（1-2 名工程师），快速迭代，敏捷响应',
    suggestions: ['你们能做什么？', '预约演示怎么约？'],
  },
  '交付流程': {
    inScope: true,
    category: 'delivery',
    answer: '标准交付流程如下：\n\n① 需求澄清（3-5 天）\n   - 业务调研与场景分析\n   - 技术可行性评估\n   - 项目范围与工作量评估\n\n② 方案设计（5-7 天）\n   - 架构设计与技术选型\n   - 数据方案与接口设计\n   - 实施计划与里程碑制定\n\n③ 快速搭建（3-5 天）\n   - Demo 环境部署\n   - 核心功能验证\n   - Demo 演示与反馈\n\n④ 联调试运行（2-4 周）\n   - 系统集成与联调\n   - 用户测试与培训\n   - 问题修复与优化\n\n⑤ 交付运维（持续）\n   - 正式上线与验收\n   - 运维支持与保障\n   - 持续优化与迭代',
    suggestions: ['交付周期多长？', '私有化部署支持吗？'],
  },

  // 联系与预约
  '预约演示': {
    inScope: true,
    category: 'contact',
    answer: '预约演示非常简单，您可以：\n\n【在线预约】\n• 点击页面"预约演示"按钮，填写基本信息\n• 我们会在 1 个工作日内联系您\n• 根据您的业务场景定制演示内容\n\n【直接联系】\n• 客服热线：400-888-9999\n• 商务邮箱：business@zhiyun.tech\n• 工作时间：周一至周五 9:00-18:00\n\n演示内容可根据您的需求定制，包括：产品功能演示、行业案例分享、技术方案交流等',
    suggestions: ['你们能做什么？', '有哪些行业方案？'],
  },
  '联系方式': {
    inScope: true,
    category: 'contact',
    answer: '您可以通过以下方式联系我们：\n\n【商务咨询】\n• 客服热线：400-888-9999\n• 商务邮箱：business@zhiyun.tech\n• 微信公众号：智云科技\n\n【技术支持】\n• 技术邮箱：support@zhiyun.tech\n• 工单系统：support.zhiyun.tech\n\n【公司地址】\n• 总部：北京市海淀区中关村科技园区 88 号\n• 分公司：上海、深圳、成都、武汉\n\n我们承诺：1 个工作日内响应您的咨询',
    suggestions: ['预约演示怎么约？', '你们能做什么？'],
  },
  '价格': {
    inScope: true,
    category: 'contact',
    answer: '我们提供灵活的定价方案：\n\n【标准版】\n• 适合中小企业\n• 按用户数或调用量计费\n• 起步价 ¥50,000/年起\n\n【企业版】\n• 适合大型企业\n• 包含私有化部署\n• 具体报价根据需求评估\n\n【定制版】\n• 适合特殊需求场景\n• 包含定制开发服务\n• 项目制报价\n\n建议您预约演示，我们会根据您的具体需求提供精准报价。',
    suggestions: ['预约演示怎么约？', '你们能做什么？'],
  },

  // 综合问题
  '你们能做什么': {
    inScope: true,
    category: 'product',
    answer: '智云科技是一家专注于企业级云与智能化解决方案的科技公司，我们的核心能力包括：\n\n【云服务平台】\n• 多云统一管理、成本治理、资源调度\n\n【智能化能力】\n• RAG 知识库检索、AI Agent 智能体、工作流编排\n• 智能客服、数据分析、预测性维护\n\n【行业解决方案】\n• 金融、政务、医疗、制造业、能源等多个行业\n\n【交付优势】\n• 私有化部署、快速交付（3-5 天 Demo）\n• 1-2 人小团队即可实施\n\n欢迎预约演示，我们将根据您的业务场景详细介绍。',
    suggestions: ['有哪些行业方案？', '私有化部署支持吗？', '预约演示怎么约？'],
  },
};

const processUserQuery = (query: string): ChatResponse => {
  const normalizedQuery = query.toLowerCase().replace(/[？?！!。.\s]/g, '');

  // 精确匹配
  for (const [key, value] of Object.entries(chatKnowledgeBase)) {
    if (normalizedQuery.includes(key.toLowerCase())) {
      return value;
    }
  }

  // 关键词匹配
  const keywords: Record<string, ChatResponse> = {
    // 产品关键词
    '云资源|成本治理|资源管理': chatKnowledgeBase['产品能力'],
    '权限|审计|身份认证': chatKnowledgeBase['产品能力'],
    '知识库|检索|文档|问答': chatKnowledgeBase['RAG'],
    'agent|智能体|代理': chatKnowledgeBase['智能体'],
    '工作流|流程|编排': chatKnowledgeBase['工作流'],
    '私有化|本地部署|离线|内网': chatKnowledgeBase['私有化部署'],
    '对接|接口|api|集成|sdk': chatKnowledgeBase['对接'],
    '客服|机器人': chatKnowledgeBase['产品能力'],

    // 行业关键词
    '银行|证券|保险|金融': chatKnowledgeBase['金融'],
    '政府|政务|公安|交通': chatKnowledgeBase['政务'],
    '医院|医疗|诊所|健康': chatKnowledgeBase['医疗'],
    '工厂|制造|生产|质量': chatKnowledgeBase['制造业'],
    '电力|石油|燃气|能源': chatKnowledgeBase['能源'],

    // 交付关键词
    '多久|周期|时间|交付|部署|上线': chatKnowledgeBase['交付周期'],
    '流程|步骤|阶段': chatKnowledgeBase['交付流程'],

    // 联系关键词
    '演示|体验|试用|预约|约': chatKnowledgeBase['预约演示'],
    '电话|邮箱|地址|联系|商务|合作': chatKnowledgeBase['联系方式'],
    '价格|费用|报价|钱': chatKnowledgeBase['价格'],
  };

  for (const [pattern, response] of Object.entries(keywords)) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(normalizedQuery)) {
      return response;
    }
  }

  // 超出范围
  return {
    inScope: false,
    answer: '我目前主要支持以下内容：\n\n① 产品与能力介绍\n② 行业解决方案\n③ 交付流程与周期\n④ 预约演示与联系方式\n\n您可以尝试点击下方的快捷问题，或直接咨询：400-888-9999',
    suggestions: fallbackSuggestions,
  };
};

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: '您好！我是智云科技的智能助手，很高兴为您服务。\n\n我可以帮您了解：\n• 产品与能力\n• 行业解决方案\n• 交付流程与周期\n• 预约演示与联系方式\n\n请问有什么可以帮到您？',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // TODO: 切换到真实后端 API 时，替换为以下调用
    // const response = await fetch('/api/chat', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message: content })
    // });
    // const data = await response.json();

    // 模拟网络延迟
    await new Promise((resolve) => setTimeout(resolve, 800));

    const chatResponse = processUserQuery(content);

    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: chatResponse.answer,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleQuickQuestion = (question: string) => {
    handleSendMessage(question);
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group"
          aria-label="打开智能客服"
        >
          <ChatIcon />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            智能客服
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <ChatIcon />
              </div>
              <div>
                <h3 className="font-semibold">智能客服</h3>
                <p className="text-xs text-blue-100">在线 · 平均响应时间 &lt; 30秒</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
              aria-label="关闭"
            >
              <XIcon />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 py-3 bg-white border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">您可能想问：</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="请输入您的问题..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-xl transition-colors"
                aria-label="发送"
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ==================== 导航栏组件 ====================
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: '产品与能力', href: '#capabilities' },
    { name: '行业解决方案', href: '#solutions' },
    { name: '客户与案例', href: '#cases' },
    { name: '交付流程', href: '#delivery' },
    { name: '安全与合规', href: '#security' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg ${isScrolled ? 'bg-blue-600' : 'bg-white'} flex items-center justify-center`}>
              <svg
                className={isScrolled ? 'text-white' : 'text-blue-600'}
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              智云科技
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  isScrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              联系我们
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <XIcon />
            ) : (
              <MenuIcon />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-700 font-medium"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block bg-blue-600 text-white text-center py-3 rounded-lg font-medium"
            >
              联系我们
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ==================== Hero 组件 ====================
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3),transparent_50%)]" />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm">企业级 · 私有化 · 快速交付</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              企业级云与智能化平台
              <span className="block text-blue-400">快速落地业务价值</span>
            </h1>

            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              安全合规 · 私有化部署 · 快速交付 · 深度可定制
              <br />
              为金融、政务、医疗、制造业等行业提供一站式智能化解决方案
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
              >
                预约演示
                <ArrowRightIcon />
              </a>
              <a
                href="#capabilities"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/20 px-8 py-4 rounded-xl font-medium transition-all"
              >
                查看能力清单
                <ChevronDownIcon />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-white">200+</div>
                <div className="text-sm text-gray-400 mt-1">企业客户</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-sm text-gray-400 mt-1">服务可用性</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">3-5天</div>
                <div className="text-sm text-gray-400 mt-1">Demo交付</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="hidden lg:block relative">
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                {/* Abstract Dashboard */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-300 mb-2">活跃用户</div>
                      <div className="text-2xl font-bold text-white">12,845</div>
                      <div className="text-xs text-green-400 mt-1">↑ 12.5%</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <div className="text-sm text-gray-300 mb-2">API调用</div>
                      <div className="text-2xl font-bold text-white">1.2M</div>
                      <div className="text-xs text-green-400 mt-1">↑ 8.3%</div>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-sm text-gray-300 mb-3">智能体工作流</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-xs">1</div>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-4/5 bg-blue-500 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-cyan-500 flex items-center justify-center text-xs">2</div>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-3/5 bg-cyan-500 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-purple-500 flex items-center justify-center text-xs">3</div>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-purple-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 shadow-xl">
                <ShieldIcon />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-4 shadow-xl">
                <CheckIcon />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDownIcon />
      </div>
    </section>
  );
}

// ==================== 能力展示组件 ====================
const capabilities = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: '云资源与成本治理',
    description: '统一管理多云环境，实现资源可视化与成本优化',
    features: ['多云资源统一纳管', '成本分析与优化建议', '资源使用率监控'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    title: '统一身份与权限审计',
    description: '企业级身份认证体系，全链路操作可追溯',
    features: ['SSO单点登录集成', '细粒度权限控制', '操作日志审计'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: '知识库/RAG检索增强',
    description: '企业级知识管理平台，智能问答与文档检索',
    features: ['多源数据接入', '混合检索算法', '引用溯源'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    ),
    title: '多智能体/工作流编排',
    description: 'AI Agent 协同工作，可视化流程编排引擎',
    features: ['可视化流程设计', '多Agent协同', '工具调用集成'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: '智能客服与工单联动',
    description: '7×24小时在线服务，工单自动流转与处理',
    features: ['意图识别准确率95%+', '工单自动创建', '知识库推荐回复'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6" />
        <path d="m5.6 5.6 4.2 4.2m4.4 4.4 4.2 4.2" />
        <path d="M1 12h6m6 0h6" />
        <path d="m5.6 18.4 4.2-4.2m4.4-4.4 4.2-4.2" />
      </svg>
    ),
    title: 'API集成与数据连接',
    description: '标准化接口体系，快速对接企业现有系统',
    features: ['RESTful API', '多语言SDK', 'Webhook回调'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: '可观测性与日志追踪',
    description: '全链路监控告警，问题快速定位与排查',
    features: ['实时性能监控', '分布式链路追踪', '智能告警'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    title: '私有化/离线部署',
    description: '支持本地化部署，数据完全自主可控',
    features: ['完全离线运行', '数据私有化', '信创环境适配'],
  },
];

function Capabilities() {
  return (
    <section id="capabilities" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">核心能力</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-6">
            全栈智能化解决方案
          </h2>
          <p className="text-lg text-gray-600">
            从云资源管理到 AI 智能体，提供企业级全链路能力支持
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="group p-6 bg-white border border-gray-200 rounded-2xl hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-600 rounded-xl flex items-center justify-center text-blue-600 group-hover:text-white transition-colors mb-4">
                {capability.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {capability.title}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {capability.description}
              </p>
              <ul className="space-y-2">
                {capability.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-500">
                    <span className="text-blue-600 mt-0.5">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== 解决方案组件 ====================
const solutions = [
  {
    name: '金融',
    icon: '💰',
    color: 'from-blue-500 to-blue-600',
    painPoints: ['客户服务成本高', '风控效率低', '合规压力大'],
    deliverables: ['智能客服机器人', 'AI风控引擎', '合规审计系统'],
  },
  {
    name: '政务',
    icon: '🏛️',
    color: 'from-red-500 to-red-600',
    painPoints: ['办事流程复杂', '数据不互通', '群众满意度低'],
    deliverables: ['一网通办平台', '智能审批系统', '政务知识库'],
  },
  {
    name: '医疗',
    icon: '🏥',
    color: 'from-green-500 to-green-600',
    painPoints: ['导诊效率低', '病历检索难', '科研数据分散'],
    deliverables: ['智能导诊系统', '病历结构化平台', '医学知识库'],
  },
  {
    name: '制造业',
    icon: '🏭',
    color: 'from-orange-500 to-orange-600',
    painPoints: ['设备故障损失大', '质检依赖人工', '知识传承难'],
    deliverables: ['预测性维护系统', 'AI质检方案', '工艺知识库'],
  },
  {
    name: '能源',
    icon: '⚡',
    color: 'from-yellow-500 to-yellow-600',
    painPoints: ['调度效率低', '负荷预测不准', '巡检风险高'],
    deliverables: ['智能调度系统', '负荷预测平台', 'AI巡检方案'],
  },
];

function Solutions() {
  return (
    <section id="solutions" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">行业解决方案</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-6">
            深度行业know-how，精准匹配业务场景
          </h2>
          <p className="text-lg text-gray-600">
            覆盖金融、政务、医疗、制造业、能源等多个行业，提供端到端解决方案
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${solution.color} p-6`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{solution.icon}</span>
                  <h3 className="text-xl font-bold text-white">{solution.name}行业解决方案</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">核心痛点</h4>
                  <div className="flex flex-wrap gap-2">
                    {solution.painPoints.map((point, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full"
                      >
                        {point}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">方案交付物</h4>
                  <ul className="space-y-2">
                    {solution.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== 客户案例组件 ====================
const clientLogos = [
  { name: '某国有银行', color: 'from-blue-600 to-blue-800' },
  { name: '某省级政府', color: 'from-red-600 to-red-800' },
  { name: '某三甲医院', color: 'from-green-600 to-green-800' },
  { name: '某汽车集团', color: 'from-orange-600 to-orange-800' },
  { name: '某能源央企', color: 'from-yellow-600 to-yellow-800' },
  { name: '某保险公司', color: 'from-purple-600 to-purple-800' },
];

const cases = [
  {
    title: '某城商行智能客服升级',
    industry: '金融',
    background: '某城市商业银行原有客服系统人工成本高，夜间服务无法覆盖，客户满意度偏低。',
    challenge: '• 客服团队50+人，成本压力大\n• 夜间无人工服务，投诉率高\n• 重复性问题占比70%以上',
    solution: '部署智能客服系统，集成知识库与工单系统，实现7×24小时在线服务。',
    result: '• 客服成本降低60%\n• 问题解决率提升至85%\n• 客户满意度提升30分',
    metric: '60%',
    metricLabel: '成本降低',
  },
  {
    title: '某市政府一网通办平台',
    industry: '政务',
    background: '某地级市政务服务事项分散，群众办事"多次跑、来回跑"，体验不佳。',
    challenge: '• 30+个系统独立运行\n• 数据不互通，需要重复提交\n• 办事平均耗时3.5天',
    solution: '建设统一的一网通办平台，整合各部门系统，实现数据共享与智能审批。',
    result: '• 办事时限缩短50%\n• 事项网上可办率100%\n• 群众满意度达92分',
    metric: '50%',
    metricLabel: '时限缩短',
  },
  {
    title: '某制造企业设备预测性维护',
    industry: '制造业',
    background: '某汽车零部件企业设备突发故障导致停产损失大，计划性维护成本高。',
    challenge: '• 年均故障停产损失超千万\n• 过度维护造成成本浪费\n• 设备知识依赖老师傅',
    solution: '部署IoT数据采集平台，结合AI算法实现设备健康度预测与故障预警。',
    result: '• 设备故障率降低35%\n• 维护成本降低40%\n• 知识库沉淀经验1000+条',
    metric: '35%',
    metricLabel: '故障率降低',
  },
];

function Cases() {
  return (
    <section id="cases" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">客户与案例</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-6">
            200+ 企业客户的共同选择
          </h2>
          <p className="text-lg text-gray-600">
            服务金融、政务、医疗、制造业等多个行业头部客户
          </p>
        </div>

        {/* Client Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
          {clientLogos.map((client, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 flex items-center justify-center h-24 hover:shadow-md transition-shadow"
            >
              <div className={`text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r ${client.color}`}>
                {client.name}
              </div>
            </div>
          ))}
        </div>

        {/* Cases */}
        <div className="grid lg:grid-cols-3 gap-8">
          {cases.map((caseItem, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Metric */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-center">
                <div className="text-5xl font-bold text-white mb-2">{caseItem.metric}</div>
                <div className="text-blue-100">{caseItem.metricLabel}</div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {caseItem.industry}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-4">{caseItem.title}</h3>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">背景：</span>
                    <span className="text-gray-600">{caseItem.background}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">挑战：</span>
                    <div className="text-gray-600 whitespace-pre-line">{caseItem.challenge}</div>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">方案：</span>
                    <span className="text-gray-600">{caseItem.solution}</span>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-700">成果：</span>
                    <div className="text-green-600 whitespace-pre-line">{caseItem.result}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== 交付流程组件 ====================
const deliverySteps = [
  {
    step: '01',
    title: '需求澄清',
    description: '业务调研与场景分析',
    duration: '3-5天',
    details: ['业务场景梳理', '技术可行性评估', '项目范围界定'],
  },
  {
    step: '02',
    title: '方案设计',
    description: '架构设计与技术选型',
    duration: '5-7天',
    details: ['系统架构设计', '数据方案设计', '实施计划制定'],
  },
  {
    step: '03',
    title: '快速搭建',
    description: 'Demo环境部署与验证',
    duration: '3-5天',
    details: ['Demo环境部署', '核心功能实现', '效果验证'],
  },
  {
    step: '04',
    title: '联调试运行',
    description: '系统集成与用户测试',
    duration: '2-4周',
    details: ['系统集成联调', '用户测试培训', '问题修复优化'],
  },
  {
    step: '05',
    title: '交付运维',
    description: '正式上线与持续保障',
    duration: '持续',
    details: ['正式上线验收', '运维支持保障', '持续优化迭代'],
  },
];

function DeliveryProcess() {
  return (
    <section id="delivery" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">交付流程</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-6">
            简单清晰，快速见效
          </h2>
          <p className="text-lg text-gray-600">
            标准化交付流程，1-2 人团队即可完成实施
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 -translate-x-1/2" />

          {/* Steps */}
          <div className="space-y-8 lg:space-y-0">
            {deliverySteps.map((step, index) => (
              <div
                key={index}
                className={`relative lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center ${
                  index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                }`}
              >
                <div className={`lg:text-${index % 2 === 0 ? 'right' : 'left'}`}>
                  <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-3xl font-bold text-blue-600/20">{step.step}</div>
                        <h3 className="text-xl font-bold text-gray-900 mt-2">{step.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{step.description}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                        ⏱ {step.duration}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckIcon />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Center Dot */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white" />
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">3-5天</div>
              <div className="text-blue-100">Demo快速交付</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1-2人</div>
              <div className="text-blue-100">小团队即可实施</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4-8周</div>
              <div className="text-blue-100">标准项目交付周期</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== 安全合规组件 ====================
const securityItems = [
  {
    icon: <LockIcon />,
    title: '数据安全',
    description: '全链路加密存储与传输，数据隐私严格保护',
    features: ['传输加密 TLS 1.3', '存储加密 AES-256', '敏感数据脱敏'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: '权限控制',
    description: '细粒度权限管理体系，确保数据访问可控',
    features: ['RBAC角色权限', '数据行级权限', '操作审计日志'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: '合规认证',
    description: '通过多项权威认证，满足行业合规要求',
    features: ['等保三级认证', 'ISO 27001', '可信云认证'],
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
        <line x1="12" y1="2" x2="12" y2="22" />
        <line x1="2" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: '私有化部署',
    description: '支持本地化部署，数据完全自主可控',
    features: ['本地服务器部署', '私有云部署', '离线环境支持'],
  },
];

function SecurityCompliance() {
  return (
    <section id="security" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">安全与合规</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-4 mb-6">
            企业级安全保障体系
          </h2>
          <p className="text-lg text-gray-600">
            从数据加密到合规认证，全方位保障您的业务安全
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {securityItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4">
                {item.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{item.description}</p>
              <ul className="space-y-1">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="text-xs text-gray-500">• {feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">权威资质认证</h3>
            <p className="text-gray-400">通过多项国家级安全认证，值得信赖</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['等保三级认证', 'ISO 27001', '可信云服务', '信创产品认证'].map((cert, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-3">
                  <ShieldIcon />
                </div>
                <div className="text-sm font-medium">{cert}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== CTA 组件 ====================
function CTA() {
  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
          准备开始您的智能化转型之旅？
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          预约演示，了解我们的产品如何帮助您的业务
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="tel:400-888-9999"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
          >
            <PhoneIcon />
            400-888-9999
          </a>
          <a
            href="mailto:business@zhiyun.tech"
            className="inline-flex items-center justify-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-400 transition-colors"
          >
            <MailIcon />
            business@zhiyun.tech
          </a>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div>
            <div className="text-3xl font-bold text-white">1h</div>
            <div className="text-sm text-blue-200 mt-1">响应时间</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">3-5天</div>
            <div className="text-sm text-blue-200 mt-1">Demo交付</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">7×24</div>
            <div className="text-sm text-blue-200 mt-1">技术支持</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ==================== Footer 组件 ====================
function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">智云科技</span>
            </div>
            <p className="text-sm mb-4 max-w-md">
              企业级云与智能化解决方案提供商，助力企业数字化转型，创造可持续的商业价值。
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#capabilities" className="hover:text-white transition-colors">产品能力</a></li>
              <li><a href="#solutions" className="hover:text-white transition-colors">解决方案</a></li>
              <li><a href="#" className="hover:text-white transition-colors">技术文档</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API参考</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">公司</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#cases" className="hover:text-white transition-colors">客户案例</a></li>
              <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
              <li><a href="#" className="hover:text-white transition-colors">新闻动态</a></li>
              <li><a href="#" className="hover:text-white transition-colors">加入我们</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">联系</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <PhoneIcon />
                <span>400-888-9999</span>
              </li>
              <li className="flex items-start gap-2">
                <MailIcon />
                <span>business@zhiyun.tech</span>
              </li>
              <li className="flex items-start gap-2">
                <LocationIcon />
                <span>北京市海淀区中关村科技园区88号</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            © 2024 智云科技 · 京ICP备2024000000号 · 京公网安备 11010802000000号
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">隐私政策</a>
            <a href="#" className="hover:text-white transition-colors">服务条款</a>
            <a href="#" className="hover:text-white transition-colors">法律声明</a>
          </div>
        </div>
      </div>

      {/* Back to Top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 left-6 bg-gray-800 hover:bg-blue-600 text-white p-3 rounded-full transition-colors z-40"
        aria-label="回到顶部"
      >
        <ArrowUpIcon />
      </button>
    </footer>
  );
}

// ==================== 主页面 ====================
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Capabilities />
      <Solutions />
      <Cases />
      <DeliveryProcess />
      <SecurityCompliance />
      <CTA />
      <Footer />
      <ChatWidget />
    </main>
  );
}
