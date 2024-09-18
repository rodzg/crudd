// backend/index.js
const express = require('express');
const app = express();
const port = 3001;

// Middleware para processar JSON
app.use(express.json());

// Dados em memória para simulação
let productionLines = {};

// Iniciar um novo processo de produção
app.post('/api/production/start', (req, res) => {
    const lineId = req.body.lineId;
    if (!lineId) {
        return res.status(400).json({ message: 'Line ID is required' });
    }

    // Inicializa as 11 etapas como "não concluídas" (false)
    productionLines[lineId] = new Array(11).fill(false);
    res.status(201).json({ message: `Production line ${lineId} started` });
});

// Atualizar status de uma etapa
app.post('/api/production/update', (req, res) => {
    const { lineId, stepIndex } = req.body;

    if (!lineId || stepIndex === undefined) {
        return res.status(400).json({ message: 'Line ID and step index are required' });
    }

    if (!productionLines[lineId]) {
        return res.status(404).json({ message: 'Production line not found' });
    }

    if (stepIndex < 0 || stepIndex >= 11) {
        return res.status(400).json({ message: 'Step index out of range' });
    }

    // Marca a etapa como concluída (true)
    productionLines[lineId][stepIndex] = true;
    res.status(200).json({ message: `Step ${stepIndex + 1} updated for line ${lineId}` });
});

// Verificar se todas as etapas foram concluídas
app.get('/api/production/check/:lineId', (req, res) => {
    const lineId = req.params.lineId;

    if (!productionLines[lineId]) {
        return res.status(404).json({ message: 'Production line not found' });
    }

    const allStepsCompleted = productionLines[lineId].every(step => step);
    res.status(200).json({ allStepsCompleted });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor backend rodando em http://localhost:${port}`);
});
