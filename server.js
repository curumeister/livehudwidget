app.post("/webhook/livepix", (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body, null, 2));

  const data = loadData();

  const payload = req.body.data || req.body;

  // 🔥 IGNORA EVENTOS QUE NÃO SÃO DOAÇÃO
  if (payload.event && payload.event !== "donation") {
    console.log("Evento ignorado:", payload.event);
    return res.sendStatus(200);
  }

  const amount = Number(
    payload.amount ||
    payload.value ||
    payload.price ||
    payload.resource?.amount ||
    0
  );

  const name =
    payload.name ||
    payload.payer_name ||
    payload.username ||
    payload.resource?.payer_name ||
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
    console.log("Webhook ignorado (sem valor):", payload);
  }

  res.sendStatus(200);
});
