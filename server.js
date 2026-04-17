console.log("NODE VERSION:", process.version);

const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const PORT = process.env.PORT || 3000;

// rota principal (frontend)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// rota teste
app.get("/teste", (req, res) => {
    res.send("Rota de teste funcionando ✅");
});

// rota IA
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
VOCÊ É UM GERADOR DE CÓDIGO HTML.
RESPONDA SOMENTE COM HTML PURO.
`
                    },
                    {
                        role: "user",
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

// iniciar servidor
app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});