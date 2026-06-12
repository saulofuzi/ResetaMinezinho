// ============================================
// SISTEMA QUE ACHA AS IMAGENS AUTOMATICAMENTE
// ============================================

// LISTA de possíveis nomes de arquivo (adicione quantos quiser)
const POSSIVEIS_NOMES = {
    dia: [
        "capa-dia.jpg",
        "capa-dia.png",
        "capa-dia.jpeg",
        "capa-dia.jpg.png",  // seu caso!
        "jornal-dia.jpg",
        "edicao-hoje.jpg",
        "dia.jpg"
    ],
    semana: [
        "capa-semana.jpg",
        "capa-semana.png",
        "capa-semana.jpeg",
        "jornal-semana.jpg",
        "edicao-semana.jpg",
        "semana.jpg"
    ]
};

// Títulos bonitos
const TITULOS = {
    dia: { titulo: "📰 Edição de Hoje", descricao: "As últimas notícias do servidor" },
    semana: { titulo: "📆 Edição da Semana", descricao: "Os melhores momentos da semana" }
};

// Função que tenta encontrar a imagem
function encontrarImagem(tipo, tentativa = 0) {
    return new Promise((resolve) => {
        if (tentativa >= POSSIVEIS_NOMES[tipo].length) {
            resolve(null); // não encontrou nenhuma
            return;
        }
        
        const nomeArquivo = POSSIVEIS_NOMES[tipo][tentativa];
        const img = new Image();
        
        img.onload = () => resolve(nomeArquivo);
        img.onerror = () => {
            encontrarImagem(tipo, tentativa + 1).then(resolve);
        };
        
        img.src = nomeArquivo;
    });
}

// Mostrar data
function mostrarData() {
    const data = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = data.toLocaleDateString('pt-BR', options);
    document.getElementById('dataAtual').innerHTML = `📅 ${dataFormatada}`;
}

// Mostrar o jornal
async function mostrarJornal(tipo) {
    const card = document.getElementById('jornalCard');
    
    // Mostrar loading
    card.innerHTML = `
        <div class="jornal-loading">
            <div class="loading-spinner"></div>
            <p>📖 Carregando jornal...</p>
        </div>
    `;
    
    // Tentar encontrar a imagem
    const imagemEncontrada = await encontrarImagem(tipo);
    const titulos = TITULOS[tipo];
    
    if (imagemEncontrada) {
        // ACHOU! Mostra o jornal
        card.innerHTML = `
            <div class="jornal-header">
                <h2>${titulos.titulo}</h2>
                <p>${titulos.descricao}</p>
            </div>
            <div class="jornal-imagem">
                <img src="${imagemEncontrada}" alt="Jornal do Minezinho - ${titulos.titulo}">
            </div>
        `;
    } else {
        // NÃO ACHOU - mostra instruções claras
        card.innerHTML = `
            <div class="jornal-header" style="background: linear-gradient(135deg, #5a3a2a, #2a1a0a);">
                <h2>📭 Nenhum jornal encontrado</h2>
                <p>Vamos resolver isso rapidinho!</p>
            </div>
            <div class="empty-state">
                <div class="empty-icon">📸</div>
                <h3>Como colocar seu jornal?</h3>
                <p>No GitHub, faça upload da sua imagem com UM destes nomes:</p>
                <ul>
                    <li>📄 <code>capa-dia.jpg</code> ou <code>capa-dia.png</code></li>
                    <li>📄 <code>jornal-dia.jpg</code> ou <code>edicao-hoje.jpg</code></li>
                </ul>
                <p style="margin-top: 24px;">
                    🌟 <strong>Já fez upload?</strong> Aguarde 1 minuto e atualize a página!<br>
                    O sistema procura automaticamente por vários nomes diferentes.
                </p>
            </div>
        `;
    }
}

// Atualizar aba ativa
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        mostrarJornal(tab);
    });
});

// Inicializar
mostrarData();
mostrarJornal('dia');
