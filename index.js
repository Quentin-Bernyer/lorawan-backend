app.post('/api/uplink', (req, res) => {
    console.log("Corps reçu de Loriot : ", req.body);

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
