import fetch from 'node-fetch';
import { appendToSheet } from './sheetsLogger.js';

export async function handleSubBotEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') return;

  const input = event.message.text;
  const userId = event.source.userId || event.source.groupId;

  const prompt = [
    { role: 'system', content: '你是 ARZS 工務助理，請判斷以下訊息是否與訂單、布料、交期、打樣、追加有關，並簡單分類。' },
    { role: 'user', content: `訊息：「${input}」請幫我分類：` }
  ];

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: prompt
    })
  });

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content || '無法分類';
  const tokens = data.usage?.total_tokens || 150;
  const cost = (tokens / 1000 * 0.0005).toFixed(6);

  await appendToSheet({
    timestamp: new Date().toISOString(),
    source: "副帳號",
    userId,
    content: input,
    gptReply: reply,
    tokens,
    cost
  });

  return { type: "text", text: `✅ 已分類訊息：${reply}` };
}