import { initFormBuilder } from './script.js';
import { loadSavedTheme } from './theme.js';

document.addEventListener('DOMContentLoaded', function() {
    // Load the saved theme
    loadSavedTheme();

    // Set up navigation
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navigateTo(this.getAttribute('data-route'));
        });
    });

    // Handle initial route
    handleRoute();

    // Listen for hash changes
    window.addEventListener('hashchange', handleRoute);
});

function navigateTo(route) {
    window.location.hash = route;
}

function handleRoute() {
    const route = window.location.hash.slice(1) || 'dashboard';
    loadContent(route);
}

function loadContent(route) {
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Clear current content

    switch(route) {
        case 'dashboard':
            fetch('/views/dashboard.html')
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                    initializeDashboard();
                });
            break;
        case 'form-builder':
            fetch('/views/form-builder.html')
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                    initializeFormBuilder();
                });
            break;
        case 'forms':
            fetch('/views/forms.html')
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                    initializeForms();
                });
            break;
        case 'submissions':
            fetch('/views/submissions.html')
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                    initializeSubmissions();
                });
            break;
        case 'settings':
            fetch('/views/settings.html')
                .then(response => response.text())
                .then(html => {
                    mainContent.innerHTML = html;
                    initializeSettings();
                });
            break;
        default:
            mainContent.innerHTML = '<h2>404 Not Found</h2><p>The requested page does not exist.</p>';
    }
}

function initializeDashboard() {
    console.log('Dashboard initialized');
    // Add dashboard-specific initialization code here
}

function initializeFormBuilder() {
    console.log('Form Builder initialized');
    initFormBuilder();
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
    setupSettings();
}

function loadForms() {
    // Add code to load and display forms
    console.log('Loading forms...');
}

function loadSubmissions() {
    // Add code to load and display submissions
    console.log('Loading submissions...');
}

function setupSettings() {
    // Add code to setup settings panel
    console.log('Setting up settings panel...');
}

// Add other necessary functions here
