const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, "data.json");

/* ---------- DATA ---------- */
function ensureFile() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({
      lastDonate: null,
      goal: { current: 0, target: 500 }
    }, null, 2));
  }
}

function loadData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => res.send("Servidor OK"));

app.get("/overlay-data", (req, res) => {
  res.json(loadData());
});

/* 🔥 WEBHOOK LIVEPIX */
app.post("/webhook/livepix", (req, res) => {
  console.log("Webhook recebido:", req.body);

  const data = loadData();

  const amount = Number(req.body.amount || 0);
  const name = req.body.name || "Anon";

  if (amount > 0) {
    data.lastDonate = {
      id: Date.now(), // 🔥 ESSENCIAL PRA NOTIFICAÇÃO
      name,
      amount
    };

    data.goal.current += amount;

    saveData(data);

    console.log("Donate salvo:", data.lastDonate);
  } else {
    console.log("Webhook ignorado (amount inválido)");
  }

  res.sendStatus(200);
});

/* ---------- START ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
