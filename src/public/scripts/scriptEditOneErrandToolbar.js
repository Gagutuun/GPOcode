const textarea = document.getElementById('editorTextarea');

textarea.addEventListener('input', () => {
    const text = textarea.value;
    localStorage.setItem('editorText', text);
});

const savedText = localStorage.getItem('editorText');
if (savedText) {
    textarea.value = savedText;
}
