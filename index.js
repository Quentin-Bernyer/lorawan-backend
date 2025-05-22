const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 10000;

let latestData = {};

app.use(bodyParser.json());

app.post('/api/uplink', (req, res) => {
  const payload = req.body;

  if (!payload.data) {
    return res.status(400).json({ error: 'Pas de payload reçue' });
  }

  const buffer = Buffer.from(payload.data, 'hex');

  // Décodage
  const temperature = buffer.readInt8(0); // 0x15 → 21
  const voltageRaw = buffer.readUInt16BE(1); // 0x0000 → 0
  const voltage = voltageRaw / 1000; // mV → V

  latestData = {
    temperature,
    voltage,
    timestamp: new Date().toISOString(),
  };

  console.log('Data décodée :', latestData);

  res.status(200).json({ message: 'Données reçues' });
});

app.get('/api/data', (req, res) => {
  res.json(latestData);
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
