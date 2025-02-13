import express from 'express';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';
import 'dotenv/config';

const app = express();
const port = 3020;

// 添加静态文件服务
app.use(express.static('public'));

// 中间件配置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 测试路由
app.post('/chat', async (req, res) => {
  // 设置SSE必要的响应头
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const deepseek = createDeepSeek({
      baseURL: process.env.DEEPSEEK_BASE_URL || '',
      apiKey: process.env.DEEPSEEK_API_KEY || '',
    });
    const result = streamText({
      model: deepseek(process.env.DEEPSEEK_MODEL || ''),
      system: 'you are a helpful assistant',
      messages: [
        {
          role: 'user',
          content: req.body.message || '你好', // 从请求体获取用户消息
        },
      ],
    });

    let enteredReasoning = false;
    let enteredText = false;
    for await (const part of result.fullStream) {
      if (part.type === 'reasoning') {
        if (!enteredReasoning) {
          enteredReasoning = true;
        }
        res.write(
          `${JSON.stringify({
            type: 'reasoning',
            content: part.textDelta,
          })}\n`
        );
      } else if (part.type === 'text-delta') {
        if (!enteredText) {
          enteredText = true;
        }
        res.write(
          `${JSON.stringify({
            type: 'text-delta',
            content: part.textDelta,
          })}\n`
        );
      }
    }
    res.end();
  } catch (error) {
    console.error('Stream error:', error);
    res.write(
      JSON.stringify({
        type: 'error',
        content: 'Stream error occurred',
      })
    );
    res.end();
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
