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
        })
        .catch(error => console.error('Error loading content:', error));
}

// ... (include other functions from script.js that are still relevant)
