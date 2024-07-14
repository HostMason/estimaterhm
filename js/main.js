document.addEventListener('DOMContentLoaded', function() {
    // Set up navigation
    const navLinks = document.querySelectorAll('#nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadContent(this.getAttribute('href'));
        });
    });

    // Load initial content (dashboard)
    loadContent('/dashboard');
});

function loadContent(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content').innerHTML = html;
            initializeView(url);
        })
        .catch(error => console.error('Error loading content:', error));
}

function initializeView(url) {
    switch(url) {
        case '/dashboard':
            initializeDashboard();
            break;
        case '/form-builder':
            initializeFormBuilder();
            break;
        case '/forms':
            initializeForms();
            break;
        case '/submissions':
            initializeSubmissions();
            break;
        case '/settings':
            initializeSettings();
            break;
    }
}

function initializeDashboard() {
    console.log('Dashboard initialized');
    // Add any dashboard-specific initialization code here
}

function initializeFormBuilder() {
    console.log('Form Builder initialized');
    // Add form builder initialization code here
    setupEventListeners();
    loadSavedState();
    initSortable();
}

function initializeForms() {
    console.log('Forms view initialized');
    loadForms();
}

function initializeSubmissions() {
    console.log('Submissions view initialized');
    loadSubmissions();
}

function initializeSettings() {
    console.log('Settings view initialized');
    document.getElementById('settings-btn').addEventListener('click', openSettings);
}

// Include other necessary functions from script.js here
