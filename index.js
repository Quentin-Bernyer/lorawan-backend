const express = require('express');
const cors = require('cors');

const app = express();

// Activer CORS pour toutes les requêtes
app.use(cors());

// Pour parser le JSON dans les requêtes POST
app.use(express.json());

// Exemple de route
app.post('/api/uplink', (req, res) => {
  // ton code ici
  res.sendStatus(200);
});

app.get('/api/data', (req, res) => {
  // renvoyer les données stockées
  res.json({ temperature: 22, voltage: 3.317, timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
