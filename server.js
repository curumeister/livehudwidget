/* 🔥 WEBHOOK LIVEPIX */
app.post("/webhook/livepix", (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  const data = loadData();

  // 🔥 SUPORTE A DIFERENTES FORMATOS
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
      id: Date.now(), // ESSENCIAL
      name,
      amount
    };

    data.goal.current += amount;

    saveData(data);

    console.log("Donate salvo:", data.lastDonate);
  } else {
    console.log("Webhook ignorado (amount inválido)", payload);
  }

  res.sendStatus(200);
});
