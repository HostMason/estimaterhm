let currentTheme = {
    backgroundColor: '#f8fafc',
    textColor: '#000000',
    accentColor: '#3b82f6',
    secondaryColor: '#64748b',
    successColor: '#22c55e',
    dangerColor: '#ef4444',
    fontFamily: 'Inter, Arial, sans-serif'
};

function applyTheme(theme) {
    currentTheme = { ...currentTheme, ...theme };
    Object.keys(currentTheme).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, currentTheme[key]);
    });
    saveTheme();
    document.body.style.backgroundColor = currentTheme.backgroundColor;
    document.body.style.color = currentTheme.textColor;
    document.body.style.fontFamily = currentTheme.fontFamily;
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
