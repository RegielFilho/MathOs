export class AIAssistant {
    static getSystemPrompt() {
        return `Você é Astra, o mentor robótico futurista do sistema MathOS.
Sua missão é ajudar o estudante na jornada de se tornar um expert em matemática avançada, engenharia em geral do básico ao expert, exatas no geral, ciências no geral, filosofia, física, química e biologia.

REGRAS DE FORMATO E RESPOSTA:
1. Responda de forma didática, encorajadora, direta e com tom profissional de um professor.
2. NUNCA use ações entre asteriscos, colchetes ou chaves (ex: NÂO use *[Iniciando varredura...]*, *[Analisando...]*, nem [Processando...]).
3. Vá direto ao conteúdo da resposta sem narrar ações fictícias de robô ou de sistema.
4. Sempre formate equações matemáticas usando notação limpa e legível.
5. Sempre tenha senso crítico e ajude em todas as questões.`;
    }

    static async askAstra(userQuestion) {
        const apiKey = localStorage.getItem("mathos_ai_api_key");
        const provider = localStorage.getItem("mathos_ai_provider") || "gemini";

        if (!apiKey && provider !== "ollama") {
            return "⚠️ **Erro de Configuração:** Nenhuma API Key encontrada. Abra 'API Config' no topo do chat e insira sua chave do Google Gemini.";
        }

        try {
            if (provider === "gemini") {
                return await this.callGeminiAPI(apiKey, userQuestion);
            } else if (provider === "openai") {
                return await this.callOpenAI(apiKey, userQuestion);
            } else if (provider === "ollama") {
                return await this.callOllama(userQuestion);
            }
        } catch (error) {
            console.error("Erro detalhado do Astra AI:", error);
            return `⚡ **Falha de Conexão:** ${error.message}`;
        }
    }

   static async callGeminiAPI(apiKey, prompt) {
        const cleanKey = apiKey.trim();
        
        // Nomes exatos confirmados no seu JSON
        const modelsToTry = [
            "gemini-2.0-flash",
            "gemini-flash-latest",
            "gemini-2.0-flash-lite"
        ];

        let lastErrorMessage = "";

        for (const model of modelsToTry) {
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanKey}`;
                
                const response = await fetch(url, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    { text: `${this.getSystemPrompt()}\n\nPergunta do Estudante: ${prompt}` }
                                ]
                            }
                        ]
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
                    return data.candidates[0].content.parts[0].text;
                }

                if (data.error?.message) {
                    lastErrorMessage = `[${model}]: ${data.error.message}`;
                }
            } catch (err) {
                lastErrorMessage = err.message;
            }
        }

        throw new Error(`Google API: ${lastErrorMessage || "Nenhum modelo respondeu com sucesso."}`);
    }
     
    static async callOpenAI(apiKey, prompt) {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey.trim()}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: this.getSystemPrompt() },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    static async callOllama(prompt) {
        const response = await fetch("http://localhost:11434/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: "llama3",
                prompt: `${this.getSystemPrompt()}\n\nPergunta: ${prompt}`,
                stream: false
            })
        });

        if (!response.ok) throw new Error("Não foi possível conectar ao Ollama local.");

        const data = await response.json();
        return data.response;
    }
}
