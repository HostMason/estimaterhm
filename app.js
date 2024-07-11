const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve page content
app.get('/:page', (req, res) => {
    const page = req.params.page;
    const validPages = ['dashboard', 'form-builder', 'forms', 'submissions', 'settings'];
    
    if (validPages.includes(page)) {
        res.sendFile(path.join(__dirname, 'views', `${page}.html`));
    } else {
        res.status(404).send('Page not found');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
