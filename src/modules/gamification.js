export const RANKS = [
    { minLevel: 1, title: "Iniciante", icon: "code", color: "#94a3b8" },
    { minLevel: 5, title: "Aprendiz de Gauss", icon: "book-open", color: "#38bdf8" },
    { minLevel: 10, title: "Calculista", icon: "cpu", color: "#00f0ff" },
    { minLevel: 20, title: "Engenheiro de Derivadas", icon: "terminal", color: "#7000ff" },
    { minLevel: 35, title: "Especialista em Vetores", icon: "shield", color: "#ff007f" },
    { minLevel: 50, title: "Mestre Stewart", icon: "award", color: "#ffb700" },
    { minLevel: 75, title: "Mestre Kreyszig", icon: "zap", color: "#00ff66" },
    { minLevel: 100, title: "Arquiteto Matemático", icon: "crown", color: "#ffffff" }
];

export class GamificationEngine {
    static getRequiredXPForLevel(level) {
        return Math.floor(50 * Math.pow(level, 1.5) + 100);
    }

    static calculateLevelProgress(totalXP) {
        let level = 1;
        let accumulatedXP = 0;

        while (true) {
            const req = this.getRequiredXPForLevel(level);
            if (totalXP < accumulatedXP + req) {
                const currentLevelXP = totalXP - accumulatedXP;
                return {
                    level,
                    currentLevelXP,
                    nextLevelXP: req,
                    progressPercent: Math.min(100, (currentLevelXP / req) * 100)
                };
            }
            accumulatedXP += req;
            level++;
        }
    }

    static getRank(level) {
        return RANKS.slice().reverse().find(r => level >= r.minLevel) || RANKS[0];
    }
}