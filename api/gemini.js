// api/gemini.js
// Este arquivo atua como um intermediário seguro (proxy).

export default async function handler(request, response) {
  // 1. Pega os dados (prompt, idade, idioma) que o jogo enviou do navegador.
  const { promptPayload } = await request.json();

  // 2. Pega a chave da API em segurança do ambiente da Vercel.
  // A chave NUNCA fica exposta aqui. Ela é configurada no painel da Vercel.
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: "Chave da API não configurada no servidor." });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  try {
    // 3. O servidor faz a chamada para a API do Gemini de forma segura.
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promptPayload) // Usa o payload original do seu jogo
    });

    if (!geminiResponse.ok) {
      console.error("Erro da API do Gemini:", await geminiResponse.text());
      throw new Error(`Erro na API do Gemini: ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();
    
    // 4. Devolve a resposta da IA para o seu jogo no navegador.
    return response.status(200).json(data);

  } catch (error) {
    console.error("Erro no proxy da API:", error);
    return response.status(500).json({ error: "Falha ao contatar a API do Gemini." });
  }
}
