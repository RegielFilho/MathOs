import { StorageEngine } from "./db.js";
import { MATH_ROADMAP } from "./modules/booksData.js";

const DEFAULT_STATE = {
    xp: 0,
    level: 1,
    streak: 0,
    lastStudyDate: null,
    totalMinutesStudied: 0,
    books: MATH_ROADMAP,
    dailyGoalMinutes: 60,
    history: {}
};

class StateManager {
    constructor() {
        this.data = { ...DEFAULT_STATE };
        this.listeners = [];
    }

    async init() {
        const saved = await StorageEngine.load("app_state");
        if (saved) {
            this.data = { ...DEFAULT_STATE, ...saved };
        }
        this.verifyStreak();
        await this.save();
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    notify() {
        this.listeners.forEach(fn => fn(this.data));
    }

    async save() {
        await StorageEngine.save("app_state", this.data);
        this.notify();
    }

    addXP(amount) {
        this.data.xp += amount;
        this.save();
    }

    addStudyTime(minutes) {
        this.data.totalMinutesStudied += minutes;
        const today = new Date().toISOString().split('T')[0];
        
        this.data.history[today] = (this.data.history[today] || 0) + minutes;
        this.updateStreak(today);
        this.save();
    }

    updateStreak(todayStr) {
        if (!this.data.lastStudyDate) {
            this.data.streak = 1;
            this.data.lastStudyDate = todayStr;
            return;
        }

        const last = new Date(this.data.lastStudyDate);
        const current = new Date(todayStr);
        const diffDays = Math.floor((current - last) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            this.data.streak += 1;
            this.data.lastStudyDate = todayStr;
        } else if (diffDays > 1) {
            this.data.streak = 1;
            this.data.lastStudyDate = todayStr;
        }
    }

    verifyStreak() {
        if (!this.data.lastStudyDate) return;
        const last = new Date(this.data.lastStudyDate);
        const today = new Date();
        const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
        if (diffDays > 1) {
            this.data.streak = 0;
        }
    }
}

export const store = new StateManager();