export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method !== "POST") return res.status(405).json({ error: "Sadece POST" });

  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Mesaj boş" });

  const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: "You are a friendly Discord bot assistant. Always reply in the same language the user writes in. Give detailed helpful answers." },
        { role: "user", content: message }
      ],
      max_tokens: 800
    })
  });

  const data = await groqRes.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) return res.status(500).json({ error: "Groq cevap vermedi" });

  res.status(200).json({ reply });
}
