export function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.style.opacity = '1';
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2000);
}

export async function copyCommand(element) {
    const text = element.innerText.replace('$', '').trim();
    try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast();
    } catch (err) {
        console.error('Falha ao copiar:', err);
    }
}
