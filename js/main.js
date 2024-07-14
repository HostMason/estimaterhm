import { initFormBuilder } from './script.js';
import { loadSavedTheme } from './theme.js';
import { initForms } from './forms.js';
import { initSubmissions } from './submissions.js';

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
            loadView('dashboard', initializeDashboard);
            break;
        case 'form-builder':
            loadView('form-builder', initializeFormBuilder);
            break;
        case 'forms':
            loadView('forms', initializeForms);
            break;
        case 'submissions':
            loadView('submissions', initializeSubmissions);
            break;
        case 'settings':
            loadView('settings', initializeSettings);
            break;
        default:
            mainContent.innerHTML = '<h2>404 Not Found</h2><p>The requested page does not exist.</p>';
    }
}

function loadView(viewName, initFunction) {
    fetch(`/views/${viewName}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(html => {
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = html;
            if (typeof initFunction === 'function') {
                initFunction();
            }
        })
        .catch(error => {
            console.error('Error loading view:', error);
            const mainContent = document.getElementById('main-content');
            mainContent.innerHTML = '<h2>Error</h2><p>Failed to load the requested page.</p>';
        });
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
    initForms();
}

function initializeSubmissions() {
    console.log('Submissions view initialized');
    initSubmissions();
}

function initializeSettings() {
    console.log('Settings view initialized');
    setupSettings();
}

function setupSettings() {
    // Add code to setup settings panel
    console.log('Setting up settings panel...');
}

// Add other necessary functions here
