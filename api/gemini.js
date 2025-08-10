// api/gemini.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // ou seu domínio específico
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { promptPayload } = req.body || {}; // Next/Vercel parseia JSON automaticamente
    if (!promptPayload) return res.status(400).json({ error: 'promptPayload ausente' });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Chave da API não configurada' });

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/` +
                   `gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const r = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptPayload),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error('Erro Gemini:', data);
      return res.status(502).json({ error: 'Erro na API do Gemini', details: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Erro no proxy:', err);
    return res.status(500).json({ error: 'Falha ao contatar a API do Gemini' });
  }
}
