export let currentTheme = {
    backgroundColor: '#f7f7f7',
    textColor: '#333333',
    accentColor: '#4a90e2',
    secondaryColor: '#6c757d',
    successColor: '#28a745',
    dangerColor: '#dc3545',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif"
};

export function applyTheme(theme) {
    currentTheme = { ...currentTheme, ...theme };
    Object.keys(currentTheme).forEach(key => {
        document.documentElement.style.setProperty(`--${key}`, currentTheme[key]);
    });
    saveTheme();
    document.body.style.backgroundColor = currentTheme.backgroundColor;
    document.body.style.color = currentTheme.textColor;
    document.body.style.fontFamily = currentTheme.fontFamily;
}

export function loadThemeFromZip(file) {
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

export function saveTheme() {
    localStorage.setItem('currentTheme', JSON.stringify(currentTheme));
}

export function loadSavedTheme() {
    const savedTheme = localStorage.getItem('currentTheme');
    if (savedTheme) {
        applyTheme(JSON.parse(savedTheme));
    } else {
        applyTheme(currentTheme); // Apply default theme if no saved theme
    }
}
