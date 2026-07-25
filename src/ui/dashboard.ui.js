import { store } from "../state.js";
import { AstraMentor } from "../modules/astra.js";

export function renderDashboard(container) {
    const data = store.data;
    const hours = (data.totalMinutesStudied / 60).toFixed(1);
    const greeting = AstraMentor.getGreeting(data);

    container.innerHTML = `
        <div class="dashboard-grid">
            <div class="glass-card" style="grid-column: span 2;">
                <h2>MathOS // System Operational Status</h2>
                <p style="color: var(--text-muted); margin-top: 8px;">${greeting}</p>
            </div>

            <div class="glass-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color: var(--text-muted);">Horas de Foco</span>
                    <i data-lucide="clock" class="text-cyan"></i>
                </div>
                <h1 style="font-size: 2.5rem; margin-top: 10px; font-family: var(--font-orbitron);">${hours}h</h1>
            </div>

            <div class="glass-card">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color: var(--text-muted);">Sequência Atual</span>
                    <i data-lucide="flame" class="streak-flame"></i>
                </div>
                <h1 style="font-size: 2.5rem; margin-top: 10px; font-family: var(--font-orbitron);">${data.streak} <span style="font-size: 1rem;">dias</span></h1>
            </div>
        </div>
    `;
    lucide.createIcons();
}