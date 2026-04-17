/* ===================== VARIÁVEIS ===================== */
const botaoGerar = document.querySelector(".botao-gerar");
const caixaTexto = document.querySelector(".caixa-texto");
const blocoCodigo = document.querySelector(".bloco-codigo");
const resultadoCodigo = document.querySelector(".resultado-codigo");
const toggleTema = document.getElementById("tema-toggle");
const botaoCopiar = document.querySelector(".copiar");
const exemplosBtns = document.querySelectorAll(".exemplos button");
const engrenagem = document.querySelector(".engrenagem");
const musica = document.getElementById("musica");
const botaoMusica = document.querySelector(".musica-btn");

/* ===================== FUNÇÃO: GERAR CÓDIGO ===================== */
async function gerarCodigo() {
    try {
        const resposta = await fetch("http://localhost:3000/gerar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                texto: `
            Crie APENAS código HTML + CSS funcional para: ${caixaTexto.value}

            O resultado deve ser uma animação visual funcionando sem texto somente a animaçao.
            `
            })
        });

        const dados = await resposta.json();

        // 🔥 PEGA A RESPOSTA CERTA
        const codigo = dados.choices?.[0]?.message?.content;

        if (!codigo) {
            blocoCodigo.textContent = "Erro: resposta vazia";
            return;
        }

        // mostra o código
        blocoCodigo.textContent = codigo;

        // renderiza preview (se for HTML)
        resultadoCodigo.srcdoc = codigo;

    } catch (erro) {
        console.error("Erro real:", erro);
        alert("Deu erro — abre o console (F12)");
    }
}
/* ===================== EVENTOS ===================== */

// Gerar código ao clicar
botaoGerar.addEventListener("click", () => {
    gerarCodigo();

    // Animação engrenagem ao gerar código
    engrenagem.classList.add("ativa");
    setTimeout(() => {
        engrenagem.classList.remove("ativa");
    }, 2000);

    // Tocar música se estiver pausada
    if (musica.paused) musica.play();
});

// Toggle tema claro/escuro
toggleTema?.addEventListener("change", () => {
    document.body.classList.toggle("light");
});

// Copiar código
botaoCopiar.addEventListener("click", () => {
    navigator.clipboard.writeText(blocoCodigo.textContent);
    botaoCopiar.textContent = "✅ Copiado!";
    setTimeout(() => botaoCopiar.textContent = "📋 Copiar código", 2000);
});

// Inserir exemplos de código na caixa de texto
exemplosBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        caixaTexto.value = btn.textContent;
    });
});

// Animação engrenagem ao clicar
engrenagem.addEventListener("click", () => {
    engrenagem.classList.toggle("ativa");
});

// ===================== MÚSICA =====================
musica.volume = 0.02; // Volume inicial 2%

botaoMusica.addEventListener("click", () => {
    if (musica.paused) {
        musica.play();
        botaoMusica.textContent = "🔇 Pausar";
    } else {
        musica.pause();
        botaoMusica.textContent = "🎵 Música";
    }
});