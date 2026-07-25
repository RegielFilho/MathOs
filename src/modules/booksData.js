// Módulo de Gerenciamento de Livros e Materiais do MathOS

const DEFAULT_BOOKS = [
    {
        id: "1",
        titulo: "Cálculo Vol. 1",
        categoria: "Matemática",
        autor: "James Stewart",
        modulos: ["Limites e Continuidade", "Regras de Derivação", "Integrais Definidas"]
    },
    {
        id: "2",
        titulo: "Física Universitária",
        categoria: "Física",
        autor: "Sears & Zemansky",
        modulos: ["Vetores e Cinemática", "Leis de Newton", "Trabalho e Energia"]
    }
];

export class BooksManager {
    static getBooks() {
        const saved = localStorage.getItem("mathos_custom_books");
        return saved ? JSON.parse(saved) : DEFAULT_BOOKS;
    }

    static saveBooks(books) {
        localStorage.setItem("mathos_custom_books", JSON.stringify(books));
    }

    static addBook(titulo, categoria, autor, modulosArray) {
        const books = this.getBooks();
        const newBook = {
            id: Date.now().toString(),
            titulo,
            categoria,
            autor,
            modulos: modulosArray
        };
        books.push(newBook);
        this.saveBooks(books);
        this.render();
    }

    static deleteBook(id) {
        let books = this.getBooks();
        books = books.filter(b => b.id !== id);
        this.saveBooks(books);
        this.render();
    }

    static render() {
        const container = document.getElementById("tab-books");
        if (!container) return;

        const books = this.getBooks();

        // Injeta a estrutura completa do HTML dentro da aba de Livros
        container.innerHTML = `
            <div class="section-title" style="margin-bottom: 20px;">
                <h2 style="color: #00f2fe; font-family: 'Orbitron', sans-serif;"><i data-lucide="book-open"></i> BIBLIOTECA & TRILHA DE ESTUDOS</h2>
                <p style="color: #9ca3af;">Gerencie seus livros, apostilas e módulos de estudo integrados ao MathOS.</p>
            </div>

            <!-- Formulário de Cadastro Cyberpunk -->
            <div class="glass-card add-book-panel" style="margin-bottom: 25px; padding: 20px; background: rgba(17, 24, 39, 0.8); border: 1px solid rgba(0, 242, 254, 0.2); border-radius: 10px;">
                <h3 style="margin-top: 0; color: #00f2fe; font-family: 'Orbitron', sans-serif;">➕ Cadastrar Novo Material</h3>
                <form id="material-form" style="display: flex; flex-direction: column; gap: 12px; margin-top: 15px;">
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <input type="text" id="mat-title" placeholder="Título (ex: Biologia Celular)" required style="flex: 1; min-width: 200px; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 6px;">
                        <input type="text" id="mat-category" placeholder="Categoria (ex: Biologia, Física)" required style="flex: 1; min-width: 150px; padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 6px;">
                    </div>
                    <input type="text" id="mat-author" placeholder="Autor / Professor (ex: Bruce Alberts)" required style="padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 6px;">
                    <textarea id="mat-modules" placeholder="Módulos / Capítulos (separe por vírgula. Ex: Células, DNA, Mitocôndria)" rows="3" required style="padding: 10px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 6px; font-family: inherit;"></textarea>
                    <button type="submit" style="padding: 12px; background: linear-gradient(135deg, #00f2fe, #4facfe); border: none; color: #000; font-weight: bold; border-radius: 6px; cursor: pointer;">
                        ✨ Adicionar à Biblioteca
                    </button>
                </form>
            </div>

            <h3 style="color: #fff; font-family: 'Orbitron', sans-serif;">📖 Materiais Cadastrados</h3>
            <div id="materials-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 15px; margin-top: 15px;">
                ${books.length === 0 ? '<p style="color: #9ca3af;">Nenhum livro cadastrado. Adicione um acima!</p>' : ''}
                ${books.map(b => `
                    <div class="glass-card book-card" style="background: rgba(17, 24, 39, 0.6); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; display: flex; flex-direction: column; justify-content: space-between;">
                        <div>
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="background: rgba(0,242,254,0.15); color: #00f2fe; border: 1px solid #00f2fe; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">
                                    ${b.categoria}
                                </span>
                                <button onclick="window.deleteBook('${b.id}')" style="background: transparent; border: none; color: #ff4757; cursor: pointer; font-size: 1rem;" title="Excluir">🗑️</button>
                            </div>
                            <h4 style="margin: 5px 0; color: #fff; font-size: 1.1rem;">${b.titulo}</h4>
                            <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 0.85rem;">👤 ${b.autor}</p>
                        </div>
                        <details style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px; font-size: 0.85rem;">
                            <summary style="cursor: pointer; color: #00f2fe; font-weight: bold;">📖 Ver Módulos (${b.modulos.length})</summary>
                            <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #d1d5db;">
                                ${b.modulos.map(m => `<li>${m.trim()}</li>`).join('')}
                            </ul>
                        </details>
                    </div>
                `).join('')}
            </div>
        `;

        // Re-vincula os eventos do formulário e dos ícones
        this.bindEvents();
        if (window.lucide) window.lucide.createIcons();
    }

    static bindEvents() {
        const form = document.getElementById("material-form");
        if (!form) return;

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const title = document.getElementById("mat-title").value;
            const category = document.getElementById("mat-category").value;
            const author = document.getElementById("mat-author").value;
            const modulesRaw = document.getElementById("mat-modules").value;

            const modulesList = modulesRaw.split(",").map(m => m.trim()).filter(m => m.length > 0);

            this.addBook(title, category, author, modulesList);
        });

        window.deleteBook = (id) => this.deleteBook(id);
    }
}
