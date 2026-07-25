import { store } from "../state.js";

export function renderStats(container) {
    const history = store.data.history || {};
    
    let heatmapHTML = '';
    for (let i = 63; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const minutes = history[dateStr] || 0;
        
        let activeClass = '';
        if (minutes > 0 && minutes <= 30) activeClass = 'active-1';
        else if (minutes > 30 && minutes <= 90) activeClass = 'active-2';
        else if (minutes > 90) activeClass = 'active-3';

        heatmapHTML += `<div class="heatmap-cell ${activeClass}" title="${dateStr}: ${minutes} mins"></div>`;
    }

    container.innerHTML = `
        <div class="glass-card">
            <h2>Matriz de Atividade (Heatmap)</h2>
            <p style="color:var(--text-muted); font-size:0.85rem; margin-top:4px;">Seus hábitos de estudo nos últimos dois meses</p>
            <div class="heatmap-container">${heatmapHTML}</div>
        </div>
    `;
}