const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

/* 🔥 SERVIR HTML (RESOLVE SEU ERRO) */
app.use(express.static(__dirname));

const DATA_FILE = path.join(__dirname, "data.json");

/* ---------- helpers ---------- */
function ensureFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initial = {
      lastDonate: null,
      goal: { current: 0, target: 500 }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
  }
}

function loadData() {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/* ---------- rotas ---------- */
app.get("/", (req, res) => {
  res.send("Servidor OK");
});

app.get("/overlay-data", (req, res) => {
  res.json(loadData());
});

app.post("/webhook/livepix", (req, res) => {
  console.log("🔥 WEBHOOK:", JSON.stringify(req.body, null, 2));

  const data = loadData();
  const body = req.body;

  const amount =
    Number(body.amount) ||
    Number(body.value) ||
    Number(body?.data?.amount) ||
    0;

  const name =
    body.name ||
    body.username ||
    body?.data?.name ||
    "Anon";

  if (amount > 0) {
    data.lastDonate = {
      name,
      amount,
      timestamp: Date.now()
    };

    data.goal.current += amount;

    saveData(data);
  }

  res.sendStatus(200);
});

/* ---------- start ---------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
