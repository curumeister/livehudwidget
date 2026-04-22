const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express(); // 🔥 TEM QUE EXISTIR ANTES DE USAR

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

/* 🔥 WEBHOOK CORRIGIDO */
app.post("/webhook/livepix", (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  const data = loadData();

  const payload = req.body.data || req.body;

  const amount = Number(
    payload.amount ||
    payload.value ||
    payload.price ||
    0
  );

  const name =
    payload.name ||
    payload.payer_name ||
    payload.username ||
    "Anon";

  if (amount > 0) {
    data.lastDonate = {
      id: Date.now(),
      name,
      amount
    };

    data.goal.current += amount;

    saveData(data);

    console.log("Donate salvo:", data.lastDonate);
  } else {
    console.log("Webhook ignorado:", payload);
  }

  res.sendStatus(200);
});

/* ---------- START ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
