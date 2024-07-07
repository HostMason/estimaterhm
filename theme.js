let currentTheme = {
    backgroundColor: '#ffffff',
    textColor: '#000000',
    accentColor: '#007bff',
    fontFamily: 'Arial, sans-serif'
};

function applyTheme(theme) {
    currentTheme = { ...currentTheme, ...theme };
    document.documentElement.style.setProperty('--background-color', currentTheme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', currentTheme.textColor);
    document.documentElement.style.setProperty('--accent-color', currentTheme.accentColor);
    document.documentElement.style.setProperty('--font-family', currentTheme.fontFamily);
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

function removeBlock(blockId) {
    const block = document.getElementById(blockId);
    if (block) {
        block.remove();
    }
}
