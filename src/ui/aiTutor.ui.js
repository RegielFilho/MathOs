import { AIAssistant } from "../modules/ai.js";

export function renderAITutor(container) {
    container.innerHTML = `
        <div class="glass-card" style="display: flex; flex-direction: column; height: calc(100vh - 160px); padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 240, 255, 0.2); padding-bottom: 12px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div class="astra-avatar" style="width: 38px; height: 38px;">
                        <div class="astra-eye left"></div>
                        <div class="astra-eye right"></div>
                    </div>
                    <div>
                        <h2 style="font-size: 1.2rem; color: var(--neon-cyan);">ASTRA // Terminal de Suporte Teórico</h2>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Tutor de Inteligência Artificial Integrado ao MathOS</span>
                    </div>
                </div>
                <button id="btn-ai-config" class="glass-card" style="padding: 6px 12px; font-size: 0.8rem; cursor: pointer; border-color: rgba(112, 0, 255, 0.4);">
                    <i data-lucide="settings"></i> API Config
                </button>
            </div>

            <!-- Painel de Configuração da API -->
            <div id="ai-config-panel" class="hidden glass-card" style="margin-bottom: 16px; background: rgba(3, 7, 18, 0.95); border: 1px solid var(--neon-purple);">
                <h4 style="margin-bottom: 8px; color: var(--neon-purple);">Configuração da Inteligência Artificial</h4>
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <select id="ai-provider-select" style="background: #0f172a; color: white; border: 1px solid var(--panel-border); padding: 8px; border-radius: 6px;">
                        <option value="gemini">Google Gemini API (Recomendado/Grátis)</option>
                        <option value="openai">OpenAI (GPT-4o-mini)</option>
                        <option value="ollama">Ollama Local (Offline / Grátis)</option>
                    </select>
                    <input type="password" id="ai-key-input" placeholder="Cole sua API Key aqui" style="flex: 1; background: #0f172a; color: white; border: 1px solid var(--panel-border); padding: 8px; border-radius: 6px;" />
                    <button id="btn-save-ai-config" style="padding: 8px 16px; background: var(--neon-purple); color: white; border: none; border-radius: 6px; cursor: pointer;">Salvar</button>
                </div>
            </div>

            <!-- Histórico -->
            <div id="chat-history" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-right: 8px;">
                <div class="glass-card" style="align-self: flex-start; max-width: 80%; border-color: rgba(0,240,255,0.3); background: rgba(15, 23, 42, 0.8);">
                    <strong style="color: var(--neon-cyan);">ASTRA:</strong>
                    <p style="margin-top: 4px; font-size: 0.9rem;">Saudações! Com qual assunto da sua trilha matemática você precisa de suporte hoje? Dúvidas em Derivadas, Integrais, Grafos ou Espaços Vetoriais?</p>
                </div>
            </div>

            <!-- Entrada de Texto -->
            <div style="display: flex; gap: 10px; margin-top: 16px;">
                <input type="text" id="chat-input" placeholder="Digite sua dúvida ou cole um exercício aqui..." style="flex: 1; background: rgba(15, 23, 42, 0.8); border: 1px solid var(--panel-border); border-radius: 10px; padding: 12px; color: white; font-family: var(--font-inter);" />
                <button id="btn-send-chat" style="padding: 12px 24px; background: linear-gradient(135deg, var(--neon-purple), var(--neon-cyan)); border: none; border-radius: 10px; color: white; font-weight: bold; cursor: pointer;">
                    Enviar
                </button>
            </div>
        </div>
    `;

    lucide.createIcons();

    const configPanel = container.querySelector("#ai-config-panel");
    const keyInput = container.querySelector("#ai-key-input");
    const providerSelect = container.querySelector("#ai-provider-select");
    const chatHistory = container.querySelector("#chat-history");
    const chatInput = container.querySelector("#chat-input");

    keyInput.value = localStorage.getItem("mathos_ai_api_key") || "";
    providerSelect.value = localStorage.getItem("mathos_ai_provider") || "gemini";

    container.querySelector("#btn-ai-config").onclick = () => configPanel.classList.toggle("hidden");

    container.querySelector("#btn-save-ai-config").onclick = () => {
        localStorage.setItem("mathos_ai_api_key", keyInput.value.trim());
        localStorage.setItem("mathos_ai_provider", providerSelect.value);
        configPanel.classList.add("hidden");
        alert("Configuração de IA salva com sucesso!");
    };

    const sendMessage = async () => {
        const text = chatInput.value.trim();
        if (!text) return;

        chatHistory.innerHTML += `
            <div class="glass-card" style="align-self: flex-end; max-width: 80%; background: rgba(112, 0, 255, 0.2); border-color: rgba(112, 0, 255, 0.4);">
                <strong style="color: var(--neon-purple);">Você:</strong>
                <p style="margin-top: 4px; font-size: 0.9rem;">${text}</p>
            </div>
        `;

        chatInput.value = "";
        chatHistory.scrollTop = chatHistory.scrollHeight;

        const loadingId = `loading-${Date.now()}`;
        chatHistory.innerHTML += `
            <div id="${loadingId}" class="glass-card" style="align-self: flex-start; max-width: 80%; border-color: rgba(0,240,255,0.3); background: rgba(15, 23, 42, 0.8);">
                <strong style="color: var(--neon-cyan);">ASTRA:</strong>
                <p style="margin-top: 4px; font-size: 0.9rem; color: var(--text-muted);">Processando algoritmos matemáticos...</p>
            </div>
        `;
        chatHistory.scrollTop = chatHistory.scrollHeight;

        const response = await AIAssistant.askAstra(text);
        
        const loadingElem = document.getElementById(loadingId);
        if (loadingElem) {
            loadingElem.innerHTML = `
                <strong style="color: var(--neon-cyan);">ASTRA:</strong>
                <p style="margin-top: 4px; font-size: 0.9rem; white-space: pre-line;">${response}</p>
            `;
        }
        chatHistory.scrollTop = chatHistory.scrollHeight;
    };

    container.querySelector("#btn-send-chat").onclick = sendMessage;
    chatInput.onkeydown = (e) => { if (e.key === "Enter") sendMessage(); };
}