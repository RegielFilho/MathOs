import { store } from "../state.js";
import { PomodoroTimer } from "../modules/timer.js";

let timerInstance = null;

export function renderTimer(container) {
    container.innerHTML = `
        <div class="glass-card" style="text-align: center; max-width: 500px; margin: 40px auto;">
            <h2>Cronômetro de Foco Neuro-Aumentado</h2>
            <div id="timer-display" style="font-size: 4.5rem; font-family: var(--font-code); color: var(--neon-cyan); margin: 20px 0;">25:00</div>
            
            <div style="display:flex; justify-content:center; gap:10px; margin-bottom: 20px;">
                <button id="btn-mode-25" class="glass-card" style="cursor:pointer;">25 min</button>
                <button id="btn-mode-50" class="glass-card" style="cursor:pointer;">50 min</button>
            </div>

            <div style="display:flex; justify-content:center; gap:12px;">
                <button id="btn-timer-start" style="padding:12px 24px; background:var(--neon-cyan); border:none; border-radius:8px; font-weight:bold; cursor:pointer;">INICIAR</button>
                <button id="btn-timer-stop" style="padding:12px 24px; background:rgba(255,0,0,0.2); border:1px solid red; color:white; border-radius:8px; cursor:pointer;">PARAR</button>
            </div>
        </div>
    `;

    const display = container.querySelector('#timer-display');
    
    if (!timerInstance) {
        timerInstance = new PomodoroTimer(
            (secondsLeft) => {
                const m = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
                const s = String(secondsLeft % 60).padStart(2, '0');
                if (display) display.innerText = `${m}:${s}`;
            },
            () => {
                store.addXP(70);
                store.addStudyTime(25);
                alert("Sessão Pomodoro concluída! +70 XP creditados.");
            }
        );
    }

    container.querySelector('#btn-timer-start').onclick = () => timerInstance.start();
    container.querySelector('#btn-timer-stop').onclick = () => timerInstance.stop();
    container.querySelector('#btn-mode-25').onclick = () => timerInstance.setMode(25);
    container.querySelector('#btn-mode-50').onclick = () => timerInstance.setMode(50);
}