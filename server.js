import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 🔥 SERVIR HTML */
app.use(express.static(__dirname));

/* 🔥 ESTADO */
let state = {
  lastDonate: null,
  goal: {
    current: 0,
    target: 500
  }
};

/* 🔥 WEBHOOK */
app.post("/webhook", (req, res) => {
  const data = req.body;

  const amount = Number(data?.amount || 0);
  const name = data?.name || "Anônimo";

  state.lastDonate = {
    name,
    amount,
    timestamp: Date.now()
  };

  state.goal.current += amount;

  console.log("Donate:", state.lastDonate);

  res.sendStatus(200);
});

/* 🔥 API */
app.get("/overlay-data", (req, res) => {
  res.json(state);
});

/* 🔥 ROOT */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Rodando na porta", PORT));
