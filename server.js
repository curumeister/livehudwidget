import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 estado em memória (simples e eficiente)
let state = {
  lastDonate: null,
  goal: {
    current: 0,
    target: 500
  }
};

// 🔔 webhook LivePix
app.post("/webhook", (req, res) => {
  const data = req.body;

  // ⚠️ Ajustar conforme payload real da LivePix
  const amount = data?.amount || 0;
  const name = data?.name || "Anônimo";

  state.lastDonate = {
    name,
    amount
  };

  state.goal.current += amount;

  console.log("Nova doação:", state.lastDonate);

  res.sendStatus(200);
});

// 📡 endpoint pro overlay
app.get("/overlay-data", (req, res) => {
  res.json(state);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));