const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let latestData = null; // Stockage global en mémoire

app.post('/api/uplink', (req, res) => {
  const payload = req.body;

  // Exemple de décodage : adapter à ton format réel
  let decoded = {};
  if (payload.data) {
    const buffer = Buffer.from(payload.data, 'hex');
    const temperature = buffer.readInt8(0); // Byte 0
    const voltageRaw = (buffer[1] << 8) | buffer[2]; // Byte 1-2
    const voltage = voltageRaw / 1000; // mV → V

    decoded = {
      temperature,
      voltage,
      timestamp: new Date().toISOString()
    };

    latestData = decoded;
    console.log("Data décodée :", decoded);
  }

  res.sendStatus(200);
});

app.get('/api/data', (req, res) => {
  res.json(latestData || { message: "Pas encore de données reçues" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
