const express = require("express");
const app = express();

app.use(express.json());

/* 🔥 DADOS DO WIDGET */
let overlayData = {
  lastDonate: null,
  goal: {
    current: 0,
    target: 500
  }
};

/* 🔥 ROTA QUE O WIDGET USA */
app.get("/overlay-data", (req, res) => {
  res.json(overlayData);
});

/* 🔥 WEBHOOK (LIVEPIX VAI BATER AQUI) */
app.post("/webhook/livepix", (req, res) => {
  console.log("🔥 WEBHOOK RECEBIDO:");
  console.log(JSON.stringify(req.body, null, 2));

  const data = req.body;

  /* aceita vários formatos (pra não quebrar) */
  const amount =
    Number(data.amount) ||
    Number(data.value) ||
    Number(data?.data?.amount) ||
    0;

  const name =
    data.name ||
    data.username ||
    data?.data?.name ||
    "Anon";

  if (amount > 0) {
    overlayData.lastDonate = {
      name,
      amount,
      timestamp: Date.now()
    };

    overlayData.goal.current += amount;
  }

  res.sendStatus(200);
});

/* 🔥 ROOT (pra não dar erro na home) */
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

/* 🔥 PORTA */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
