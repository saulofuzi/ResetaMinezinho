// ============================================
// CONFIGURAÇÃO DO JORNAL DO MINEZINHO
// ============================================

// 1️⃣ Coloque suas imagens dentro da pasta "imagens"
const jornalDia = {
    imagem: "imagens/capa-dia.jpg",   // ← JORNAL DO DIA
    titulo: "📰 Edição de Hoje"
};

const jornalSemana = {
    imagem: "imagens/capa-semana.jpg", // ← JORNAL DA SEMANA
    titulo: "📰 Edição da Semana"
};

// 2️⃣ Opcional: Se tiver uma logo, coloque em "imagens/logo-minezinho.png"
//    Se não tiver, o site funciona normal sem ela

// ============================================
// NÃO PRECISA MUDAR DAQUI PRA BAIXO
// ============================================

function mostrarData() {
    const data = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = data.toLocaleDateString('pt-BR', options);
    document.getElementById('dataAtual').innerHTML = `📅 ${dataFormatada} 🍃`;
}

function mostrarJornal(tipo) {
    const container = document.getElementById('conteudoJornal');
    const botoes = document.querySelectorAll('.botoes button');
    
    botoes.forEach(btn => btn.classList.remove('ativo'));
    if (tipo === 'dia') {
        botoes[0].classList.add('ativo');
    } else {
        botoes[1].classList.add('ativo');
    }
    
    const jornal = tipo === 'dia' ? jornalDia : jornalSemana;
    
    let html = `
        <div class="jornal-${tipo}">
            <h2 style="text-align: center; color: #2d6a2a; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>🍃</span> ${jornal.titulo} <span>🌿</span>
            </h2>
    `;
    
    const img = new Image();
    img.onload = function() {
        html += `<img src="${jornal.imagem}" alt="Capa do Jornal do Minezinho">`;
        html += `</div>`;
        container.innerHTML = html;
    };
    
    img.onerror = function() {
        html += `
            <div class="sem-mensagem">
                <span>📭🍂</span>
                <strong>Nenhum jornal encontrado ainda!</strong><br><br>
                📌 Como colocar o jornal do dia:<br>
                1️⃣ Coloque a imagem na pasta <strong style="color:#2d6a2a;">/imagens/</strong><br>
                2️⃣ Nomeie como <strong style="color:#2d6a2a;">${jornal.imagem.split('/')[1]}</strong><br>
                3️⃣ Atualize a página e pronto!<br><br>
                🌟 Dica: Use imagens no formato .jpg ou .png
            </div>
        `;
        html += `</div>`;
        container.innerHTML = html;
    };
    
    img.src = jornal.imagem;
    container.innerHTML = `<div class="sem-mensagem"><span>📖🌱</span> Carregando jornal...</div>`;
}

// Carregar tudo ao iniciar
mostrarData();
mostrarJornal('dia');
