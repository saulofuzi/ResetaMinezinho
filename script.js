// ANTES (procura dentro da pasta imagens/)
const JORNAIS = {
    dia: {
        imagem: "imagens/capa-dia.jpg",   // ← MUDAR
        titulo: "📰 Edição de Hoje",
        descricao: "As últimas notícias do servidor"
    },
    semana: {
        imagem: "imagens/capa-semana.jpg", // ← MUDAR
        titulo: "📆 Edição da Semana",
        descricao: "Os melhores momentos da semana"
    }
};

// DEPOIS (procura na pasta principal)
const JORNAIS = {
    dia: {
        imagem: "capa-dia.jpg",   // ← AGORA ASSIM
        titulo: "📰 Edição de Hoje",
        descricao: "As últimas notícias do servidor"
    },
    semana: {
        imagem: "capa-semana.jpg", // ← AGORA ASSIM
        titulo: "📆 Edição da Semana",
        descricao: "Os melhores momentos da semana"
    }
};
