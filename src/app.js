import { store } from "./state.js";
import { GamificationEngine } from "./modules/gamification.js";
import { renderDashboard } from "./ui/dashboard.ui.js";
import { renderBooks } from "./ui/books.ui.js";
import { renderTimer } from "./ui/timer.ui.js";
import { renderStats } from "./ui/stats.ui.js";
import { renderAITutor } from "./ui/aiTutor.ui.js";

class Application {
    constructor() {
        this.tabContainers = {
            dashboard: document.getElementById('tab-dashboard'),
            books: document.getElementById('tab-books'),
            timer: document.getElementById('tab-timer'),
            stats: document.getElementById('tab-stats'),
            aiTutor: document.getElementById('tab-ai-tutor')
        };
    }

    async bootstrap() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js').catch(console.warn);
        }

        await store.init();
        store.subscribe((data) => this.updateHeaderUI(data));

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.currentTarget.dataset.tab;
                this.switchTab(tabName);
            });
        });

        this.updateHeaderUI(store.data);
        this.switchTab('dashboard');
    }

    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        const activeNav = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeNav) activeNav.classList.add('active');

        Object.keys(this.tabContainers).forEach(key => {
            const containerName = key === 'aiTutor' ? 'ai-tutor' : key;
            if (containerName === tabName) {
                this.tabContainers[key].classList.remove('hidden');
                this.renderTabContent(key);
            } else {
                this.tabContainers[key].classList.add('hidden');
            }
        });
    }

    renderTabContent(key) {
        if (key === 'dashboard') renderDashboard(this.tabContainers.dashboard);
        if (key === 'books') renderBooks(this.tabContainers.books);
        if (key === 'timer') renderTimer(this.tabContainers.timer);
        if (key === 'stats') renderStats(this.tabContainers.stats);
        if (key === 'aiTutor') renderAITutor(this.tabContainers.aiTutor);
    }

    updateHeaderUI(data) {
        const stats = GamificationEngine.calculateLevelProgress(data.xp);
        const rank = GamificationEngine.getRank(stats.level);

        document.getElementById('user-level-val').innerText = stats.level;
        document.getElementById('xp-current').innerText = stats.currentLevelXP;
        document.getElementById('xp-next').innerText = stats.nextLevelXP;
        document.getElementById('xp-bar-fill').style.width = `${stats.progressPercent}%`;
        
        document.getElementById('rank-title').innerText = rank.title;
        document.getElementById('sidebar-streak').innerText = data.streak;
        
        const rankIconNode = document.getElementById('rank-icon');
        if (rankIconNode) {
            rankIconNode.setAttribute('data-lucide', rank.icon);
            lucide.createIcons();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new Application();
    app.bootstrap();
});