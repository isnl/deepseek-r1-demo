"use strict";
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deepseek_1 = require("@ai-sdk/deepseek");
const ai_1 = require("ai");
require("dotenv/config");
const app = (0, express_1.default)();
const port = 3020;
// 添加静态文件服务
app.use(express_1.default.static('public'));
// 中间件配置
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 测试路由
app.post('/chat', async (req, res) => {
    var _a, e_1, _b, _c;
    // 设置SSE必要的响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    try {
        const deepseek = (0, deepseek_1.createDeepSeek)({
            baseURL: process.env.DEEPSEEK_BASE_URL || '',
            apiKey: process.env.DEEPSEEK_API_KEY || '',
        });
        const result = (0, ai_1.streamText)({
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
        try {
            for (var _d = true, _e = __asyncValues(result.fullStream), _f; _f = await _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const part = _c;
                if (part.type === 'reasoning') {
                    if (!enteredReasoning) {
                        enteredReasoning = true;
                    }
                    res.write(`${JSON.stringify({
                        type: 'reasoning',
                        content: part.textDelta,
                    })}\n`);
                }
                else if (part.type === 'text-delta') {
                    if (!enteredText) {
                        enteredText = true;
                    }
                    res.write(`${JSON.stringify({
                        type: 'text-delta',
                        content: part.textDelta,
                    })}\n`);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) await _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.end();
    }
    catch (error) {
        console.error('Stream error:', error);
        res.write(JSON.stringify({
            type: 'error',
            content: 'Stream error occurred',
        }));
        res.end();
    }
});
// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
