console.log("NODE VERSION:", process.version);

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post("/gerar", async (req, res) => {
    try {
        const texto = req.body.texto;

        if (!texto) {
            return res.status(400).json({ erro: "Texto não enviado" });
        }

        const resposta = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + process.env.API_KEY
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
        messages: [
            {
        role: "system",
        content: `
            VOCÊ É UM GERADOR DE CÓDIGO AUTOMÁTICO.

            REGRA ABSOLUTA:
            - SUA RESPOSTA DEVE SER SOMENTE CÓDIGO HTML COMPLETO FUNCIONAL
            - PROIBIDO QUALQUER TEXTO FORA DO CÓDIGO
            - PROIBIDO EXPLICAÇÕES
            - PROIBIDO MARKDOWN
            - SE VOCÊ NÃO SEGUIR ISSO, SUA RESPOSTA SERÁ REJEITADA

            FORMATO OBRIGATÓRIO:
            <html> ... </html>

            VOCÊ DEVE GERAR APENAS CÓDIGOS DE ANIMAÇÕES VISUAIS, SEM INTERATIVIDADE, SEM TEXTO, SEM IMAGENS EXTERNAS, APENAS HTML + CSS PURO.
            `
},
    {   role: "user",
        content: texto
    }
]
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error("ERRO GROQ:", dados);
            return res.status(500).json(dados);
        }

        res.json(dados);

    } catch (erro) {
        console.error("ERRO REAL NODE:", erro);
        res.status(500).json({ erro: erro.message });
    }
});

app.get("/teste", (req, res) => {
    res.send("Rota de teste funcionando ✅");
});

const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);