// ============================================
// SISTEMA DE JORNAL DO MINEZINHO
// ============================================

// Lista de possíveis nomes de arquivo (adicione quantos quiser)
const POSSIVEIS_NOMES = {
    dia: [
        "capa-dia.jpg",
        "capa-dia.png",
        "capa-dia.jpeg",
        "capa-dia.jpg.png",
        "jornal-dia.jpg",
        "edicao-hoje.jpg",
        "dia.jpg",
        "capa.jpg"
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
    dia: { 
        titulo: "📰 Edição de Hoje", 
        descricao: "As últimas notícias do servidor - Fique por dentro de tudo!" 
    },
    semana: { 
        titulo: "📆 Edição da Semana", 
        descricao: "Os melhores momentos da semana - Resumo completo" 
    }
};

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

function mostrarData() {
    const data = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = data.toLocaleDateString('pt-BR', options);
    const dataElement = document.getElementById('dataAtual');
    if (dataElement) {
        dataElement.innerHTML = `${dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1)}`;
    }
}

function encontrarImagem(tipo, tentativa = 0) {
    return new Promise((resolve) => {
        if (tentativa >= POSSIVEIS_NOMES[tipo].length) {
            resolve(null);
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

async function mostrarJornal(tipo) {
    const card = document.getElementById('jornalCard');
    if (!card) return;
    
    // Mostrar loading
    card.innerHTML = `
        <div class="skeleton-loader">
            <div class="skeleton-header"></div>
            <div class="skeleton-image"></div>
        </div>
    `;
    
    const imagemEncontrada = await encontrarImagem(tipo);
    const titulos = TITULOS[tipo];
    
    if (imagemEncontrada) {
        card.innerHTML = `
            <div class="jornal-header">
                <h2>${titulos.titulo}</h2>
                <p>${titulos.descricao}</p>
            </div>
            <div class="jornal-imagem">
                <img src="${imagemEncontrada}" alt="Jornal do Minezinho - ${titulos.titulo}">
            </div>
        `;
        adicionarHintZoom();
    } else {
        card.innerHTML = `
            <div class="jornal-header" style="background: rgba(90, 58, 42, 0.5);">
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
                    <li>📄 <code>capa-semana.jpg</code> ou <code>jornal-semana.jpg</code></li>
                </ul>
                <p style="margin-top: 24px;">
                    🌟 <strong>Já fez upload?</strong> Aguarde 1 minuto e atualize a página!<br>
                    O sistema procura automaticamente por vários nomes diferentes.
                </p>
            </div>
        `;
    }
}

// ============================================
// SISTEMA DE LUPA E ZOOM
// ============================================

let zoomImagemAtual = null;
let zoomLevel = 2;

const btnLupa = document.getElementById('btnLupa');
const zoomModal = document.getElementById('zoomModal');
const zoomClose = document.getElementById('zoomClose');
const zoomImage = document.getElementById('zoomImage');
const zoomInBtn = document.getElementById('zoomInBtn');
const zoomOutBtn = document.getElementById('zoomOutBtn');
const zoomResetBtn = document.getElementById('zoomResetBtn');
const zoomFullscreen = document.getElementById('zoomFullscreen');
const zoomLevelSpan = document.getElementById('zoomLevel');

function abrirLupa() {
    const imagemAtual = document.querySelector('.jornal-imagem img');
    
    if (!imagemAtual) {
        mostrarToast('Nenhum jornal aberto para visualizar!', 'warning');
        return;
    }
    
    zoomImagemAtual = imagemAtual.src;
    zoomImage.src = zoomImagemAtual;
    zoomLevel = 2;
    atualizarZoom();
    zoomModal.classList.add('active');
}

function atualizarZoom() {
    const percentual = Math.round(zoomLevel * 100);
    zoomImage.style.transform = `scale(${zoomLevel})`;
    if (zoomLevelSpan) zoomLevelSpan.textContent = `${percentual}%`;
}

function zoomIn() {
    if (zoomLevel < 4) {
        zoomLevel += 0.25;
        atualizarZoom();
    } else {
        mostrarToast('Zoom máximo atingido! (400%)', 'info');
    }
}

function zoomOut() {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.25;
        atualizarZoom();
    } else {
        mostrarToast('Zoom mínimo atingido! (50%)', 'info');
    }
}

function resetZoom() {
    zoomLevel = 2;
    atualizarZoom();
    mostrarToast('Zoom resetado para 200%', 'info');
}

function toggleFullscreen() {
    const modalContent = document.querySelector('.zoom-modal-content');
    if (!document.fullscreenElement) {
        modalContent.requestFullscreen();
        if (zoomFullscreen) zoomFullscreen.innerHTML = '<i class="fas fa-compress"></i> Sair';
    } else {
        document.exitFullscreen();
        if (zoomFullscreen) zoomFullscreen.innerHTML = '<i class="fas fa-expand"></i> Tela Cheia';
    }
}

function fecharLupa() {
    zoomModal.classList.remove('active');
}

function mostrarToast(mensagem, tipo = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.innerHTML = `<i class="fas ${tipo === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i><span>${mensagem}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function copiarIP() {
    const ip = 'play.minezinho.com';
    navigator.clipboard.writeText(ip);
    mostrarToast('IP copiado! play.minezinho.com');
}

function adicionarHintZoom() {
    const jornalImagem = document.querySelector('.jornal-imagem');
    if (jornalImagem && !document.querySelector('.zoom-hint')) {
        const hint = document.createElement('div');
        hint.className = 'zoom-hint';
        hint.innerHTML = '<i class="fas fa-search-plus"></i> Clique na lupa para ampliar';
        jornalImagem.style.position = 'relative';
        jornalImagem.appendChild(hint);
        
        setTimeout(() => {
            hint.style.opacity = '0';
            setTimeout(() => hint.remove(), 500);
        }, 5000);
    }
}

// ============================================
// PARTICLES BACKGROUND
// ============================================

function criarParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = '#6aaf4e';
        particle.style.borderRadius = '50%';
        particle.style.opacity = Math.random() * 0.3;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.pointerEvents = 'none';
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// CUSTOM CURSOR
// ============================================

const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '1';
    });
}

// ============================================
// EVENTOS
// ============================================

// Navegação das abas
document.querySelectorAll('.nav-item[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        
        document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        mostrarJornal(tab);
    });
});

// Botão Destaques
const btnDestaques = document.getElementById('btnDestaques');
if (btnDestaques) {
    btnDestaques.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.nav-item[data-tab="semana"]').click();
    });
}

// Botão Arquivo
document.querySelectorAll('#btnArquivo, #btnArquivoFooter').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarToast('📚 Arquivo em breve! Em breve você verá todas as edições antigas.', 'info');
        });
    }
});

// Eventos da Lupa
if (btnLupa) btnLupa.addEventListener('click', abrirLupa);
if (zoomClose) zoomClose.addEventListener('click', fecharLupa);
if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);
if (zoomFullscreen) zoomFullscreen.addEventListener('click', toggleFullscreen);

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && zoomModal && zoomModal.classList.contains('active')) {
        fecharLupa();
    }
});

// Fechar clicando fora
if (zoomModal) {
    zoomModal.addEventListener('click', (e) => {
        if (e.target === zoomModal) {
            fecharLupa();
        }
    });
}

// Observer para adicionar hint quando o jornal mudar
const observer = new MutationObserver(() => {
    adicionarHintZoom();
});

const jornalCard = document.getElementById('jornalCard');
if (jornalCard) {
    observer.observe(jornalCard, { childList: true, subtree: true });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    mostrarData();
    mostrarJornal('dia');
    criarParticles();
    
    // Estilo para animação das partículas
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-100px); }
            100% { transform: translateY(0px); }
        }
    `;
    document.head.appendChild(style);
});

console.log('✅ Jornal do Minezinho carregado!');
console.log('🔍 Clique no botão verde com lupa para ampliar o jornal');
