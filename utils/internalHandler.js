import fetch from 'node-fetch';
import { appendToSheet } from './sheetsWriter.js';

export async function handleInternalMessage(event) {
  if (event.type !== 'message' || !['text', 'image'].includes(event.message.type)) return;

  const userId = event.source.userId || '群組';
  const messageType = event.message.type;
  let content = '';

  if (messageType === 'text') {
    content = event.message.text;
  } else if (messageType === 'image') {
    content = '[圖片訊息]';
  }

  // 呼叫 GPT 判斷分類（你可以加入更強提示）
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "你是 ARZS 工務助理，負責協助辨識 LINE 群組中的訂單或訊息是否與交期、款式、布料有關。" },
        { role: "user", content: `訊息內容如下：「${content}」
請用一句話分類這則訊息的性質。` }
      ]
    })
  });

  const data = await response.json();
  const gptReply = data.choices?.[0]?.message?.content || '無法判斷';

  await appendToSheet({
    timestamp: new Date().toISOString(),
    userId,
    content,
    classification: gptReply
  });

  return { type: 'text', text: `✅ 已記錄訊息並分類：${gptReply}` };
}