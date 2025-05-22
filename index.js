const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let latestData = { temperature: null, voltage: null, timestamp: null };

// Décodage de la payload LoRa
function decodePayload(payloadBase64) {
    const buffer = Buffer.from(payloadBase64, 'base64');
    const temperatureRaw = buffer.readInt16BE(0); // Octets 0-1
    const voltageRaw = buffer.readUInt16BE(2);    // Octets 2-3

    return {
        temperature: temperatureRaw / 100.0,
        voltage: voltageRaw / 1000.0
    };
}

// Webhook de Loriot
app.post('/api/uplink', (req, res) => {
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

        console.log("Données reçues :", latestData);
        res.sendStatus(200);
    } catch (err) {
        console.error("Erreur de décodage :", err);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// API pour ton site Wix
app.get('/api/latest', (req, res) => {
    res.json(latestData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
