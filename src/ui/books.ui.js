import { store } from "../state.js";

export function renderBooks(container) {
    const data = store.data;

    const html = data.books.map(book => {
        const completedCh = book.chapters.filter(c => c.status === 'completed').length;
        const progressPercent = Math.round((completedCh / book.totalChapters) * 100);

        return `
            <div class="glass-card" style="margin-bottom: 16px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="color: var(--neon-cyan);">${book.title}</h3>
                        <p style="font-size: 0.85rem; color: var(--text-muted);">${book.author} — ${book.category}</p>
                    </div>
                    <span style="font-family: var(--font-code); font-weight: 600;">${progressPercent}%</span>
                </div>

                <div class="progress-bar-track" style="margin: 12px 0;">
                    <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                </div>

                <details>
                    <summary style="cursor:pointer; font-size:0.9rem; color:var(--text-muted);">Ver Capítulos (${completedCh}/${book.totalChapters})</summary>
                    <div style="margin-top: 10px; display:flex; flex-direction:column; gap:8px;">
                        ${book.chapters.map(ch => `
                            <div style="display:flex; justify-content:space-between; background:rgba(0,0,0,0.2); padding:8px 12px; border-radius:8px;">
                                <span>Cap. ${ch.id} - ${ch.title}</span>
                                <button class="btn-complete-ch" data-book="${book.id}" data-ch="${ch.id}" style="background:transparent; border:1px solid var(--neon-cyan); color:var(--neon-cyan); padding:2px 8px; border-radius:4px; cursor:pointer;">
                                    ${ch.status === 'completed' ? '✓ Concluído' : '+ Finalizar (+300 XP)'}
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </details>
            </div>
        `;
    }).join('');

    container.innerHTML = `<h2>Trilha do Conhecimento Matemático</h2><div style="margin-top:16px;">${html}</div>`;

    container.querySelectorAll('.btn-complete-ch').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const bookId = e.target.dataset.book;
            const chId = parseInt(e.target.dataset.ch);
            
            const book = store.data.books.find(b => b.id === bookId);
            const ch = book.chapters.find(c => c.id === chId);
            
            if (ch.status !== 'completed') {
                ch.status = 'completed';
                store.addXP(300);
                store.save();
                renderBooks(container);
            }
        });
    });
}