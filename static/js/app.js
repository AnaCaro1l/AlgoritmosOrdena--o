// static/js/app.js
let currentArray = [];
const container = document.getElementById('array-container');
const binarySearchControls = document.getElementById('binary-search-controls');
const statusText = document.getElementById('status-text');

function setBinarySearchVisibility(isVisible) {
    binarySearchControls.classList.toggle('hidden', !isVisible);
    binarySearchControls.classList.toggle('flex', isVisible);
}

function setStatus(message) {
    statusText.textContent = message;
}

// Gera números aleatórios entre 15 e 100
function generateNewArray() {
    currentArray = Array.from({ length: 15 }, () => Math.floor(Math.random() * 85) + 15);
    renderArray(currentArray);
    setBinarySearchVisibility(false);
    setStatus('Novo array');
}

// Desenha as barras proporcionalmente dentro do container
function renderArray(arr, activeIndices = [], sortedIndices = []) {
    const maxHeight = Math.max(...arr);
    let bars = container.querySelectorAll('.bar-item');

    if (bars.length !== arr.length) {
        container.innerHTML = '<div class="stage-grid"></div>';
        arr.forEach(() => {
            const bar = document.createElement('div');
            bar.className = 'bar-item flex items-end justify-center pb-1 text-xs font-bold text-white';
            container.appendChild(bar);
        });
        bars = container.querySelectorAll('.bar-item');
    }

    arr.forEach((value, idx) => {
        const bar = bars[idx];
        const heightPercent = (value / maxHeight) * 85;
        bar.style.height = `${heightPercent}%`;
        bar.innerText = value;
        bar.classList.remove('bar-active', 'bar-sorted');

        if (activeIndices.includes(idx)) {
            bar.classList.add('bar-active');
        } else if (sortedIndices.includes(idx)) {
            bar.classList.add('bar-sorted');
        }
    });
}

// Função genérica que lida com qualquer algoritmo de ordenação
async function runSorting(algorithmName) {
    setBinarySearchVisibility(false);
    setStatus('Ordenando...');

    try {
        const response = await fetch(`/api/${algorithmName}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ array: currentArray })
        });
        
        if (!response.ok) {
            throw new Error(`Falha na API: ${response.status}`);
        }

        const data = await response.json();
        const steps = data.steps;

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            
            if (step.type === 'compare' || step.type === 'swap' || step.type === 'shift') {
                renderArray(step.array, step.indices);
                setStatus(step.type === 'compare' ? 'Comparando valores' : 'Movendo valores');
            } else if (step.type === 'insert') {
                renderArray(step.array, [step.index]);
                setStatus('Inserindo valor');
            } else if (step.type === 'sorted') {
                renderArray(step.array, [], step.array.map((_, idx) => idx));
                currentArray = [...step.array];
                setBinarySearchVisibility(true);
                setStatus('Array ordenado');
            }
            
            await new Promise(resolve => setTimeout(resolve, 150));
        }
    } catch (error) {
        console.error(`Erro ao executar ${algorithmName}:`, error);
    }
}

async function runBinarySearch() {
    const targetInput = document.getElementById('search-target');
    const target = Number(targetInput.value);

    if (targetInput.value === '' || !Number.isInteger(target)) {
        targetInput.focus();
        return;
    }

    try {
        setStatus('Buscando...');
        const response = await fetch('/api/binary-search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ array: currentArray, target })
        });

        if (!response.ok) {
            throw new Error(`Falha na API: ${response.status}`);
        }

        const data = await response.json();
        currentArray = [...data.sorted_array];

        for (const step of data.steps) {
            if (step.type === 'check') {
                renderArray(step.array, [step.index]);
                setStatus(`Verificando índice ${step.index}`);
            } else if (step.type === 'found') {
                renderArray(step.array, [], [step.index]);
                setStatus(`Valor ${target} encontrado`);
            } else if (step.type === 'not_found') {
                renderArray(step.array);
                setStatus(`Valor ${target} não encontrado`);
            }

            await new Promise(resolve => setTimeout(resolve, 700));
        }
    } catch (error) {
        console.error('Erro ao executar busca binária:', error);
    }
}

window.runBinarySearch = runBinarySearch;

// Inicializa o primeiro array ao carregar a página
generateNewArray();