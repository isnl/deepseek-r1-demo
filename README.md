当前文档基于 `Cursor` 生成，模型为：`claude-3.5-sonnet`

# AI 助手对话应用

![](https://static.iiter.cn/article/9caac4214d11796eebb16e7ddd4bf2a2.png)

基于 Express + DeepSeek_R1 的智能对话应用，支持流式响应和思维链展示

## 功能特性

- 🚀 实时流式响应交互体验
- 🧠 可视化展示 AI 思维链推理过程
- 📝 支持 Markdown 格式内容渲染
- 💬 美观的聊天界面设计
- ⚡ 前后端分离架构
- 🛡️ 完善的错误处理机制

## 快速开始

### 环境要求
- Node.js 18+
- npm 9+

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/isnl/deepseek-r1-demo
   cd deepseek-r1-demo
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量  
   复制 `.env.example` 为 `.env` 并填写你的 DeepSeek API 密钥：
   ```env
   DEEPSEEK_API_KEY=your_api_key_here
   DEEPSEEK_BASE_URL=your_base_url_here
   ```

### 启动服务

```bash
npm run dev
```

访问 [http://localhost:3020](http://localhost:3020) 开始使用

## 项目结构

项目结构  
├── src/  
│ └── index.ts # 后端主入口文件  
├── public/  
│ └── index.html # 前端界面  
├── package.json  
└── .env.example # 环境变量示例  


## 技术栈
- **后端**: Express + DeepSeek SDK
- **前端**: Marked.js
- **流式处理**: Server-Sent Events (SSE)
- **样式**: 原生 CSS 实现响应式布局

## 配置说明
环境变量配置项：
- `DEEPSEEK_API_KEY`: DeepSeek API 密钥
- `DEEPSEEK_BASE_URL`: DeepSeek API 基础 URL
- `DEEPSEEK_MODEL`: DeepSeek 模型名称

## 核心功能
- 实时对话：基于 SSE 实现流式响应
- 思维链展示：展示 AI 推理过程
- Markdown 渲染：支持代码块、列表等格式化展示
- 错误处理：完善的错误提示和重试机制

## 注意事项
1. 确保网络可以访问 DeepSeek API 端点
2. 免费版 API 有速率限制，生产环境建议升级
3. 前端使用原生 EventSource 实现，兼容现代浏览器
4. 建议在反向代理后部署生产环境

## 许可证
MIT License