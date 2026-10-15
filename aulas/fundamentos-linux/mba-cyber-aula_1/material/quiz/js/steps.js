export const state = {
    currentRevealedStep: 0,
    totalSteps: 3
};

export function revealNextStep() {
    if (state.currentRevealedStep < state.totalSteps) {
        state.currentRevealedStep++;
        const step = document.getElementById(`step${state.currentRevealedStep}`);

        step.classList.remove('hidden');

        requestAnimationFrame(() => {
            step.classList.add('revealed');
            step.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        const btn = document.getElementById('reveal-btn');
        if (state.currentRevealedStep === state.totalSteps) {
            btn.innerHTML = '<i class="fa-solid fa-check-circle mr-2"></i> Todas as tarefas libertadas';
            btn.classList.replace('bg-emerald-600', 'bg-slate-700');
            btn.disabled = true;
            btn.style.cursor = 'default';
        } else {
            btn.innerHTML = `<i class="fa-solid fa-plus-circle mr-2"></i> Liberar Tarefa ${state.currentRevealedStep + 1}`;
        }
    }
}

export function checkCompletion() {
    const checkboxes = Array.from(document.querySelectorAll('.step-checkbox'));
    const revealedStepsCount = state.currentRevealedStep;

    const allChecked = checkboxes.slice(0, revealedStepsCount).every(c => c.checked) && revealedStepsCount === state.totalSteps;

    const msg = document.getElementById('completion-message');
    if (allChecked) {
        msg.classList.remove('hidden');
        msg.scrollIntoView({ behavior: 'smooth' });
    } else {
        msg.classList.add('hidden');
    }
}

export function toggleCheck(checkbox) {
    const stepId = checkbox.dataset.step;
    const step = document.getElementById(stepId);
    if(step) {
        step.classList.toggle('active');
        checkCompletion();
    }
}

export function resetSteps() {
    state.currentRevealedStep = 0;
    document.querySelectorAll('.step-card').forEach(s => {
        s.classList.add('hidden');
        s.classList.remove('revealed', 'active');
    });
    document.querySelectorAll('.step-checkbox').forEach(c => c.checked = false);
    
    // Also reset the completion message
    const msg = document.getElementById('completion-message');
    if(msg) msg.classList.add('hidden');
    
    const btn = document.getElementById('reveal-btn');
    if (btn) {
        btn.disabled = false;
        btn.style.cursor = 'pointer';
        btn.classList.replace('bg-slate-700', 'bg-emerald-600');
        btn.innerHTML = '<i class="fa-solid fa-play-circle mr-2 group-hover:scale-110 transition-transform"></i> Liberar passos';
    }
}
