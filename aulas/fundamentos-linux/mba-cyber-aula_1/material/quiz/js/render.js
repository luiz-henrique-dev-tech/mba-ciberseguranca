import { state, resetSteps, toggleCheck, revealNextStep } from './steps.js';
import { copyCommand } from './ui.js';

let desafios = [];

export async function loadDesafios() {
    try {
        const response = await fetch('desafios.json');
        const data = await response.json();
        desafios = data.desafios;
        renderNav();
        if (desafios.length > 0) {
            renderChallenge(desafios[0], 0);
        }
    } catch (e) {
        console.error("Erro ao carregar desafios", e);
    }
}

function renderNav() {
    const nav = document.getElementById('activities-nav');
    nav.innerHTML = '';
    desafios.forEach((d, index) => {
        const btn = document.createElement('button');
        btn.className = "flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-medium py-2 px-4 rounded-full transition-colors focus:ring-2 focus:ring-emerald-500 outline-none activity-btn";
        btn.innerText = `Desafio ${d.id}`;
        btn.onclick = () => renderChallenge(d, index);
        nav.appendChild(btn);
    });
}

function renderChallenge(desafio, index) {
    // Highlight active nav button
    document.querySelectorAll('.activity-btn').forEach((btn, i) => {
        if (i === index) {
            btn.classList.replace('bg-slate-800', 'bg-emerald-600');
            btn.classList.replace('text-emerald-400', 'text-white');
            btn.classList.replace('hover:bg-slate-700', 'hover:bg-emerald-500');
        } else {
            btn.classList.replace('bg-emerald-600', 'bg-slate-800');
            btn.classList.replace('text-white', 'text-emerald-400');
            btn.classList.replace('hover:bg-emerald-500', 'hover:bg-slate-700');
        }
    });

    document.getElementById('challenge-title').innerHTML = `<i class="fa-solid fa-terminal text-emerald-500 mr-3"></i> ${desafio.titulo}`;
    document.getElementById('challenge-desc').innerText = `Desafio ${desafio.id}: ${desafio.titulo}`;

    const container = document.getElementById('challenge-container');
    container.innerHTML = '';

    const enunciadoHTML = `
        <div class="glass-panel rounded-xl p-6 border-l-4 border-emerald-500">
            <h3 class="text-lg font-bold mb-3 text-white">O Enunciado</h3>
            <p class="text-slate-300 leading-relaxed">${desafio.enunciado}</p>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', enunciadoHTML);

    state.totalSteps = desafio.passos.length;

    desafio.passos.forEach((passo, idx) => {
        const stepNum = idx + 1;
        let contentHTML = '';

        if (passo.tipo === 'comandos') {
            contentHTML = passo.conteudo.map(cmd => `
                <div class="command-block terminal-font text-sm mb-2">
                    <span class="text-emerald-500">$</span> ${cmd}
                    <i class="fa-regular fa-copy copy-icon absolute top-4 right-4 text-slate-500"></i>
                </div>
            `).join('');
        } else if (passo.tipo === 'edicao') {
             contentHTML = passo.conteudo.map(ed => `
                <div class="bg-slate-800/50 p-3 rounded-lg border border-slate-700 mb-2">
                    <span class="text-xs text-slate-500 block mb-1">${ed.arquivo}:</span>
                    <code class="text-emerald-300 whitespace-pre-wrap">${ed.codigo}</code>
                </div>
            `).join('');
        }

        const stepHTML = `
            <div class="step-card glass-panel rounded-xl p-6 hidden" id="step${stepNum}">
                <div class="flex items-start justify-between mb-4">
                    <div>
                        <span class="bg-emerald-500/10 text-emerald-500 text-xs font-bold px-2 py-1 rounded mb-3 inline-block uppercase tracking-wider">Tarefa ${stepNum}</span>
                        <h3 class="text-xl font-bold mb-2">${passo.titulo}</h3>
                    </div>
                    <input type="checkbox" class="w-6 h-6 rounded border-slate-700 bg-slate-800 checked:bg-emerald-500 step-checkbox" data-step="step${stepNum}">
                </div>
                <p class="text-slate-400 mb-4">${passo.descricao}</p>
                <div class="step-content">
                    ${contentHTML}
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', stepHTML);
    });

    const msgHTML = `
        <div class="bg-emerald-500 text-emerald-950 p-4 rounded-xl flex items-center justify-between font-bold hidden mt-6" id="completion-message">
            <span><i class="fa-solid fa-circle-check mr-2"></i> Missão Cumprida! Desafio concluído.</span>
            <button id="restart-btn" class="text-xs underline hover:no-underline">Reiniciar</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', msgHTML);

    bindDynamicEvents();
    resetSteps();
}

function bindDynamicEvents() {
    const commandBlocks = document.querySelectorAll('.command-block');
    commandBlocks.forEach(block => {
        block.addEventListener('click', function() {
            copyCommand(this);
        });
    });

    const checkboxes = document.querySelectorAll('.step-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            toggleCheck(this);
        });
    });

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', resetSteps);
    }
}
