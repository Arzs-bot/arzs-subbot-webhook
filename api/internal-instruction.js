export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const body = req.body;

    // 模擬 GPT 的結構分析（未來你會從 GPT API 接這些值）
    const gptResult = {
      date: "2025/05/18",
      employee: "哲恩",              // or 俊宏
      action: "交貨",
      orderNo: "240518-001",
      customer: "創悅",
      location: "富祥",
      issue: "富祥無人應門",
      kpiImpact: "-1"
    };

    // Google Apps Script Webhook URL
    const webhookUrl = "https://script.google.com/macros/s/AKfycbx72WN8pPQTMQylgM1d2S3KFJWHCM9cmFdE8ORU3nDWwM0-EXdeLLPTZjL8izH_BL9Kxw/exec";

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gptResult),
    });

    const webhookText = await webhookResponse.text();

    return res.status(200).send(`✅ 寫入完成：${webhookText}`);
  } catch (error) {
    console.error("❌ 寫入錯誤：", error);
    return res.status(500).send("Internal Server Error");
  }
}
feat: 加入 GPT 結果寫入 Google Sheets 的功能
