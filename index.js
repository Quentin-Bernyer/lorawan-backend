const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let latestData = null;

function decodePayload(payloadRaw) {
  // Convertir le payload base64 en buffer
  const buffer = Buffer.from(payloadRaw, 'base64');

  // Supposons que : [0] = température, [1-2] = tension (en mV, 2 octets)
  const temperature = buffer.readInt8(0);
  const voltage = buffer.readUInt16BE(1) / 1000.0;

  return { temperature, voltage };
}

// 🔍 Route appelée par Loriot
app.post('/api/uplink', (req, res) => {
  console.log("Corps reçu de Loriot :", JSON.stringify(req.body, null, 2));

  try {
    const { payload_raw } = req.body;

    if (!payload_raw) {
      return res.status(400).json({ error: "Pas de payload reçue" });
    }

    const data = decodePayload(payload_raw);

    latestData = {
      ...data,
      timestamp: new Date().toISOString()
    };

    console.log("Données décodées :", latestData);
    res.sendStatus(200);
  } catch (err) {
    console.error("Erreur de décodage :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// 🔍 Pour Wix ou autres clients
app.get('/api/latest', (req, res) => {
  if (!latestData) {
    return res.status(404).json({ error: "Aucune donnée reçue pour le moment." });
  }
  res.json(latestData);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
