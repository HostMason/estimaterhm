let currentTheme = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#007bff',
    secondaryColor: '#6c757d',
    successColor: '#28a745',
    dangerColor: '#dc3545',
    fontFamily: 'Inter, Arial, sans-serif'
};

function applyTheme(theme) {
    currentTheme = { ...currentTheme, ...theme };
    Object.keys(currentTheme).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, currentTheme[key]);
    });
    saveTheme();
}

function loadThemeFromZip(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        JSZip.loadAsync(e.target.result).then(function(zip) {
            zip.file("theme.json").async("string").then(function(content) {
                const theme = JSON.parse(content);
                applyTheme(theme);
            });
        });
    };
    reader.readAsArrayBuffer(file);
}

function saveTheme() {
    localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
}

function loadSavedTheme() {
    const savedTheme = localStorage.getItem('currentTheme');
    if (savedTheme) {
        applyTheme(JSON.parse(savedTheme));
    }
}

document.addEventListener('DOMContentLoaded', loadSavedTheme);
