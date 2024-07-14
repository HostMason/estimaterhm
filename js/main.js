import { initFormBuilder } from '../script.js';

document.addEventListener('DOMContentLoaded', function() {
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
            mainContent.innerHTML = '<h2>Dashboard</h2><p>Welcome to your dashboard!</p>';
            initializeDashboard();
            break;
        case 'form-builder':
            mainContent.innerHTML = '<h2>Form Builder</h2><div id="form-builder"></div>';
            initializeFormBuilder();
            break;
        case 'forms':
            mainContent.innerHTML = '<h2>Forms</h2><div id="forms-list"></div>';
            initializeForms();
            break;
        case 'submissions':
            mainContent.innerHTML = '<h2>Submissions</h2><div id="submissions-list"></div>';
            initializeSubmissions();
            break;
        case 'settings':
            mainContent.innerHTML = '<h2>Settings</h2><div id="settings-panel"></div>';
            initializeSettings();
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
}

function loadSubmissions() {
    // Add code to load and display submissions
}

function setupSettings() {
    // Add code to setup settings panel
}

// Add other necessary functions here
