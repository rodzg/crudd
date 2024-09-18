// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [lineId, setLineId] = useState('');
    const [steps, setSteps] = useState(new Array(11).fill(false));
    const [allStepsCompleted, setAllStepsCompleted] = useState(false);

    // Iniciar nova linha de produção
    const startProduction = () => {
        axios.post('http://localhost:3001/api/production/start', { lineId })
            .then(response => {
                setSteps(new Array(11).fill(false));
                setAllStepsCompleted(false);
                alert(response.data.message);
            })
            .catch(error => {
                alert(error.response.data.message);
            });
    };

    // Atualizar status de uma etapa
    const updateStep = (index) => {
        axios.post('http://localhost:3001/api/production/update', { lineId, stepIndex: index })
            .then(() => {
                const updatedSteps = [...steps];
                updatedSteps[index] = true;
                setSteps(updatedSteps);
            })
            .catch(error => {
                alert(error.response.data.message);
            });
    };

    // Checar se todas as etapas foram concluídas
    useEffect(() => {
        if (lineId) {
            axios.get(`http://localhost:3001/api/production/check/${lineId}`)
                .then(response => {
                    setAllStepsCompleted(response.data.allStepsCompleted);
                })
                .catch(error => {
                    console.error(error);
                });
        }
    }, [steps, lineId]);

    return (
        <div className="App">
            <h1>Linha de Produção</h1>
            <input
                type="text"
                placeholder="ID da Linha de Produção"
                value={lineId}
                onChange={(e) => setLineId(e.target.value)}
            />
            <button onClick={startProduction}>Iniciar Produção</button>
            
            <h2>Etapas</h2>
            <ul>
                {steps.map((step, index) => (
                    <li key={index}>
                        Etapa {index + 1}: {step ? 'Concluída' : 'Não concluída'}
                        <button onClick={() => updateStep(index)} disabled={step}>
                            Marcar como Concluída
                        </button>
                    </li>
                ))}
            </ul>

            {allStepsCompleted && <h3>Todas as etapas foram concluídas!</h3>}
        </div>
    );
}

export default App;
