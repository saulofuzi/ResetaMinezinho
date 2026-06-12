// ============================================
// JORNAL DO MINEZINHO - SISTEMA COMPLETO
// ============================================

// CONFIGURAÇÃO DOS SERVIDORES
const SERVERS = {
    global: {
        nome: "Global",
        icon: "🌍",
        cor: "#6aaf4e",
        corBg: "rgba(106, 175, 78, 0.2)"
    },
    legacy: {
        nome: "Survival Legacy",
        icon: "🟢🌲",
        cor: "#48bb48",
        corBg: "rgba(72, 187, 72, 0.2)"
    },
    magis: {
        nome: "Survival Magis",
        icon: "🟣✨",
        cor: "#a048bb",
        corBg: "rgba(160, 72, 187, 0.2)"
    }
};

// ============================================
// ⚠️ IMPORTANTE: COLOQUE O NOME EXATO DAS SUAS IMAGENS AQUI!
// ============================================
// Olhe no GitHub o nome dos seus arquivos e coloque abaixo:
// Exemplo: se sua imagem chama "capa-legacy.png" coloque legacy: "capa-legacy.png"
// ============================================

const MINHAS_IMAGENS = {
    global: "global.jpg",      // ← MUDE para o nome da sua imagem GLOBAL
    legacy: "legacy.jpg",      // ← MUDE para o nome da sua imagem LEGACY
    magis: "magis.jpg"         // ← MUDE para o nome da sua imagem MAGIS
};

// ============================================
// NÃO MUDE NADA DAQUI PARA BAIXO
// ============================================

let servidorAtivo = "global";

// Mostrar data atual
function mostrarData() {
    const data = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = data.toLocaleDateString('pt-BR', options);
    const dataElement = document.getElementById('dataAtual');
    if (dataElement) {
        dataElement.innerHTML = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    }
}

// Atualizar contador de online
function atualizarOnlineCount() {
    const total = Math.floor(Math.random() * 50) + 120;
    const onlineSpan = document.getElementById('onlineCount');
    if (onlineSpan) onlineSpan.innerHTML = `${total} online`;
}

// Mostrar o jornal
async function mostrarJornal(server) {
    const card = document.getElementById('jornalCard');
    if (!card) return;
    
    servidorAtivo = server;
    const serverInfo = SERVERS[server];
    
    // Atualizar UI
    atualizarUI(server);
    
    // Mostrar loading
    card.innerHTML = `
        <div class="skeleton-loader">
            <div class="skeleton-header"></div>
            <div class="skeleton-image"></div>
        </div>
    `;
    
    const nomeImagem = MINHAS_IMAGENS[server];
    
    if (!nomeImagem) {
        card.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚙️</div>
                <h3>Configure o nome da imagem</h3>
                <p>No arquivo <strong>script.js</strong>, encontre <code>MINHAS_IMAGENS</code> e coloque o nome do seu arquivo.</p>
            </div>
        `;
        return;
    }
    
    const img = new Image();
    
    img.onload = function() {
        card.innerHTML = `
            <div class="jornal-header" style="border-bottom-color: ${serverInfo.cor}">
                <h2 style="color: ${serverInfo.cor}">
                    ${serverInfo.icon} ${serverInfo.nome}
                </h2>
                <p>As últimas notícias do servidor - Fique por dentro de tudo!</p>
            </div>
            <div class="jornal-imagem">
                <img src="${nomeImagem}" alt="Jornal do Minezinho - ${serverInfo.nome}">
            </div>
        `;
        adicionarHintZoom();
    };
    
    img.onerror = function() {
        card.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📭</div>
                <h3>Imagem não encontrada</h3>
                <p>Não consegui encontrar o arquivo: <code>${nomeImagem}</code></p>
                <p>Verifique se o nome está correto no GitHub.</p>
                <ul>
                    <li>O arquivo existe no GitHub?</li>
                    <li>O nome está escrito igual? (maiúsculas/minúsculas)</li>
                    <li>Está na mesma pasta do site?</li>
                </ul>
            </div>
        `;
    };
    
    img.src = nomeImagem;
}

// Atualizar interface
function atualizarUI(server) {
    const serverInfo = SERVERS[server];
    
    const badge = document.getElementById('serverBadge');
    if (badge) {
        badge.innerHTML = `<i class="fas ${server === 'global' ? 'fa-globe' : (server === 'legacy' ? 'fa-tree' : 'fa-magic')}"></i> SERVIDOR ${serverInfo.nome.toUpperCase()}`;
        badge.style.background = serverInfo.corBg;
        badge.style.color = serverInfo.cor;
        badge.style.border = `1px solid ${serverInfo.cor}`;
    }
    
    const edicao = document.getElementById('edicaoAtual');
    if (edicao) {
        edicao.innerHTML = `${serverInfo.icon} ${serverInfo.nome}`;
    }
    
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === server) {
            item.classList.add('active');
        }
    });
    
    document.querySelectorAll('.server-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.server === server) {
            card.classList.add('active');
        }
    });
}

// ============================================
// SISTEMA DE LUPA
// ============================================

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
        mostrarToast('Nenhum jornal aberto!');
        return;
    }
    zoomImage.src = imagemAtual.src;
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
        mostrarToast('Zoom máximo! (400%)');
    }
}

function zoomOut() {
    if (zoomLevel > 0.5) {
        zoomLevel -= 0.25;
        atualizarZoom();
    } else {
        mostrarToast('Zoom mínimo! (50%)');
    }
}

function resetZoom() {
    zoomLevel = 2;
    atualizarZoom();
    mostrarToast('Zoom resetado para 200%');
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

function mostrarToast(mensagem) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<i class="fas fa-info-circle"></i><span>${mensagem}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function copiarIP() {
    navigator.clipboard.writeText('play.minezinho.com');
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

// Particles
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
        particle.style.animation = `floatParticle ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.pointerEvents = 'none';
        particlesContainer.appendChild(particle);
    }
}

// Custom cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
if (cursor && cursorFollower) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        cursorFollower.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
    });
}

// Eventos
document.querySelectorAll('.nav-item[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarJornal(link.dataset.tab);
    });
});

document.querySelectorAll('.server-card').forEach(card => {
    card.addEventListener('click', () => {
        mostrarJornal(card.dataset.server);
    });
});

const btnDestaques = document.getElementById('btnDestaques');
if (btnDestaques) {
    btnDestaques.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarJornal('global');
    });
}

document.querySelectorAll('#btnArquivo, #btnArquivoFooter').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarToast('📚 Arquivo em breve!');
        });
    }
});

if (btnLupa) btnLupa.addEventListener('click', abrirLupa);
if (zoomClose) zoomClose.addEventListener('click', fecharLupa);
if (zoomInBtn) zoomInBtn.addEventListener('click', zoomIn);
if (zoomOutBtn) zoomOutBtn.addEventListener('click', zoomOut);
if (zoomResetBtn) zoomResetBtn.addEventListener('click', resetZoom);
if (zoomFullscreen) zoomFullscreen.addEventListener('click', toggleFullscreen);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && zoomModal && zoomModal.classList.contains('active')) {
        fecharLupa();
    }
});

if (zoomModal) {
    zoomModal.addEventListener('click', (e) => {
        if (e.target === zoomModal) fecharLupa();
    });
}

const observer = new MutationObserver(() => adicionarHintZoom());
const jornalCard = document.getElementById('jornalCard');
if (jornalCard) {
    observer.observe(jornalCard, { childList: true, subtree: true });
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    mostrarData();
    atualizarOnlineCount();
    mostrarJornal('global');
    criarParticles();
    
    const style = document.createElement('style');
    style.textContent = `@keyframes floatParticle { 0% { transform: translateY(0px); } 50% { transform: translateY(-100px); } 100% { transform: translateY(0px); } }`;
    document.head.appendChild(style);
    
    setInterval(atualizarOnlineCount, 30000);
});

console.log('✅ Jornal do Minezinho carregado!');
