const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

let latestData = null;

// ✅ Fonction de décodage des données base64
function decodePayload(payloadBase64) {
  const buffer = Buffer.from(payloadBase64, 'base64');

  const temperature = buffer.readInt8(0);
  const voltage = buffer.readUInt16BE(1) / 1000.0;

  return { temperature, voltage };
}

// ✅ Route appelée par Loriot
app.post('/api/uplink', (req, res) => {
  console.log("Corps reçu de Loriot :", JSON.stringify(req.body, null, 2));

  try {
    const payload = req.body.data;

    if (!payload) {
      return res.status(400).json({ error: "Pas de payload reçue (champ 'data' manquant)" });
    }

    const data = decodePayload(payload);

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

// ✅ Endpoint pour récupérer la dernière donnée (appelable depuis Wix)
app.get('/api/latest', (req, res) => {
  if (!latestData) {
    return res.status(404).json({ error: "Aucune donnée reçue pour le moment." });
  }
  res.json(latestData);
});

// ✅ Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
