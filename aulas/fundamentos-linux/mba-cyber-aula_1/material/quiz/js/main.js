import { revealNextStep } from './steps.js';
import { loadDesafios } from './render.js';

document.addEventListener('DOMContentLoaded', () => {
    // Carrega o JSON e constrói dinamicamente o menu e os desafios
    loadDesafios();

    // Event listeners fixos no header
    const revealBtn = document.getElementById('reveal-btn');
    if (revealBtn) {
        revealBtn.addEventListener('click', revealNextStep);
    }
});
