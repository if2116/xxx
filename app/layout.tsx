import { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '智云科技 - 企业级云与智能化解决方案',
  description: '提供企业级云服务、私有化部署、行业解决方案与智能化应用，包括 RAG、Agent、工作流等 AI 能力，快速落地业务价值。',
  keywords: '企业级云服务,私有化部署,AI解决方案,RAG,智能体,工作流编排,数字化转型',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
