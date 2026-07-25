export class AstraMentor {
    static getGreeting(data) {
        const hour = new Date().getHours();
        let base = hour < 12 ? "Bom dia, Operador." : hour < 18 ? "Boa tarde, Operador." : "Boa noite, Operador.";
        
        if (data.streak > 3) {
            return `${base} Impressionante! Sua sequência está em ${data.streak} dias! Mantenha a inércia positiva.`;
        }
        if (data.totalMinutesStudied === 0) {
            return `${base} Seus sistemas estão ociosos hoje. Que tal iniciar uma sessão de 25min?`;
        }
        return `${base} Sistemas operacionais. Pronto para dominar mais um capítulo?`;
    }
}