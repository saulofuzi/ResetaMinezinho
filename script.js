// ============================================
// JORNAL DO MINEZINHO - 3 SERVIDORES
// ============================================

// Configuração dos servidores e suas imagens
const SERVERS = {
    global: {
        nome: "Global",
        icon: "🌍",
        cor: "#6aaf4e",
        corBg: "rgba(106, 175, 78, 0.2)",
        imagens: [
            "imagens/global.jpg",
            "imagens/global.png",
            "global.jpg",
            "jornal-global.jpg",
            "capa-global.jpg"
        ]
    },
    legacy: {
        nome: "Survival Legacy",
        icon: "🟢🌲",
        cor: "#48bb48",
        corBg: "rgba(72, 187, 72, 0.2)",
        imagens: [
            "imagens/legacy.jpg",
            "imagens/legacy.png",
            "legacy.jpg",
            "jornal-legacy.jpg",
            "capa-legacy.jpg",
            "imagens/survival-legacy.jpg"
        ]
    },
    magis: {
        nome: "Survival Magis",
        icon: "🟣✨",
        cor: "#a048bb",
        corBg: "rgba(160, 72, 187, 0.2)",
        imagens: [
            "imagens/magis.jpg",
            "imagens/magis.png",
            "magis.jpg",
            "jornal-magis.jpg",
            "capa-magis.jpg",
            "imagens/survival-magis.jpg"
        ]
    }
};

// Servidor ativo atual
let servidorAtivo = "global";

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

function atualizarOnlineCount() {
    const counts = {
        global: Math.floor(Math.random() * 50) + 100,
        legacy: Math.floor(Math.random() * 30) + 40,
        magis: Math.floor(Math.random() * 30) + 35
    };
    const total = counts.global + counts.legacy + counts.magis;
    const onlineSpan = document.getElementById('onlineCount');
    if (onlineSpan) onlineSpan.innerHTML = `${total} online`;
}

function encontrarImagem(server, tentativa = 0) {
    return new Promise((resolve) => {
        const imagensLista = SERVERS[server].imagens;
        if (tentativa >= imagensLista.length) {
            resolve(null);
            return;
        }
        
        const nomeArquivo = imagensLista[tentativa];
        const img = new Image();
        
        img.onload = () => resolve(nomeArquivo);
        img.onerror = () => {
            encontrarImagem(server, tentativa + 1).then(resolve);
        };
        
        img.src = nomeArquivo;
    });
}

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
    
    const imagemEncontrada = await encontrarImagem(server);
    
    if (imagemEncontrada) {
        card.innerHTML = `
            <div class="jornal-header" style="border-bottom-color: ${serverInfo.cor}">
                <h2 style="color: ${serverInfo.cor}">
                    ${serverInfo.icon} ${serverInfo.nome}
                </h2>
                <p>As últimas notícias do servidor - Fique por dentro de tudo!</p>
            </div>
            <div class="jornal-imagem">
                <img src="${imagemEncontrada}" alt="Jornal do Minezinho - ${serverInfo.nome}">
            </div>
        `;
        adicionarHintZoom();
    } else {
        // Mostrar instruções específicas para cada servidor
        card.innerHTML = `
            <div class="jornal-header" style="background: rgba(90, 58, 42, 0.5);">
                <h2>📭 Nenhum jornal encontrado para ${serverInfo.nome}</h2>
                <p>Vamos resolver isso rapidinho!</p>
            </div>
            <div class="empty-state">
                <div class="empty-icon">📸</div>
                <h3>Como colocar o jornal do ${serverInfo.nome}?</h3>
                <p>No GitHub, faça upload da sua imagem com UM destes nomes:</p>
                <ul>
                    <li>📄 <code>${server}.jpg</code> ou <code>${server}.png</code></li>
                    <li>📄 <code>jornal-${server}.jpg</code> ou <code>capa-${server}.jpg</code></li>
                    <li>📄 <code>imagens/${server}.jpg</code> dentro da pasta imagens/</li>
                </ul>
                <p style="margin-top: 24px;">
                    🌟 <strong>Dica:</strong> O servidor ${serverInfo.nome} usa a cor ${serverInfo.cor}<br>
                    Aguarde 1 minuto após o upload e atualize a página!
                </p>
            </div>
        `;
    }
}

function atualizarUI(server) {
    const serverInfo = SERVERS[server];
    
    // Atualizar badge do hero
    const badge = document.getElementById('serverBadge');
    if (badge) {
        badge.innerHTML = `<i class="fas ${server === 'global' ? 'fa-globe' : (server === 'legacy' ? 'fa-tree' : 'fa-magic')}"></i> SERVIDOR ${serverInfo.nome.toUpperCase()}`;
        badge.className = `hero-badge ${server}`;
        badge.style.background = serverInfo.corBg;
        badge.style.color = serverInfo.cor;
        badge.style.border = `1px solid ${serverInfo.cor}`;
    }
    
    // Atualizar texto da edição
    const edicao = document.getElementById('edicaoAtual');
    if (edicao) {
        edicao.innerHTML = `${serverInfo.icon} ${serverInfo.nome}`;
    }
    
    // Atualizar abas ativas
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === server) {
            item.classList.add('active');
        }
    });
    
    // Atualizar cards dos servidores
    document.querySelectorAll('.server-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.server === server) {
            card.classList.add('active');
        }
    });
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
        particle.style.animation = `floatParticle ${Math.random() * 10 + 10}s linear infinite`;
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
}

// ============================================
// EVENTOS
// ============================================

// Navegação das abas
document.querySelectorAll('.nav-item[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.dataset.tab;
        mostrarJornal(tab);
    });
});

// Cards dos servidores
document.querySelectorAll('.server-card').forEach(card => {
    card.addEventListener('click', () => {
        const server = card.dataset.server;
        mostrarJornal(server);
    });
});

// Botão Destaques
const btnDestaques = document.getElementById('btnDestaques');
if (btnDestaques) {
    btnDestaques.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarJornal('global');
        mostrarToast('📰 Exibindo destaques do servidor Global', 'info');
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

// Observer para adicionar hint
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
    atualizarOnlineCount();
    mostrarJornal('global');
    criarParticles();
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-100px); }
            100% { transform: translateY(0px); }
        }
    `;
    document.head.appendChild(style);
    
    setInterval(atualizarOnlineCount, 30000);
});

console.log('✅ Jornal do Minezinho carregado!');
console.log('🎮 Servidores: Global 🌍 | Legacy 🟢 | Magis 🟣');
console.log('🔍 Clique no botão verde com lupa para ampliar o jornal');
