let fieldCount = 0;
let pageCount = 0;
let selectedField = null;
let currentPage = 1;
let usePages = true;
let progressBarType = 'default';

// Settings object
const settings = {
    usePages: true,
    progressBarType: 'default'
};

// Function to open settings menu
function openSettings() {
    const settingsMenu = document.createElement('div');
    settingsMenu.id = 'settings-menu';
    settingsMenu.innerHTML = `
        <h2>Settings</h2>
        <label>
            <input type="checkbox" id="use-pages" ${settings.usePages ? 'checked' : ''}>
            Use Pages
        </label>
        <label>
            Progress Bar Type:
            <select id="progress-bar-type">
                <option value="default" ${settings.progressBarType === 'default' ? 'selected' : ''}>Default</option>
                <option value="percentage" ${settings.progressBarType === 'percentage' ? 'selected' : ''}>Percentage</option>
                <option value="fraction" ${settings.progressBarType === 'fraction' ? 'selected' : ''}>Fraction</option>
            </select>
        </label>
        <button id="save-settings">Save</button>
    `;
    document.body.appendChild(settingsMenu);

    document.getElementById('save-settings').addEventListener('click', saveSettings);
}

// Function to save settings
function saveSettings() {
    settings.usePages = document.getElementById('use-pages').checked;
    settings.progressBarType = document.getElementById('progress-bar-type').value;
    usePages = settings.usePages;
    progressBarType = settings.progressBarType;
    document.getElementById('settings-menu').remove();
    renderForm();
    updateProgressBar();
}

function addPage() {
    pageCount++;
    const page = {
        id: `page-${pageCount}`,
        label: `Page ${pageCount}`
    };

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="page-header">
            <span class="toggle-btn">▼</span>
            <span>${page.label}</span>
            <button class="remove-btn" onclick="removePage('${page.id}')">&times;</button>
        </div>
        <ul class="field-list sortable-list" data-page="${page.id}"></ul>
    `;
    listItem.setAttribute('data-id', page.id);
    listItem.querySelector('.page-header').onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            togglePage(page.id);
            selectPage(page);
        }
    };
    document.getElementById('page-list').appendChild(listItem);

    selectPage(page);
    initSortable();
    updateProgressBar();
}

function togglePage(pageId) {
    const pageItem = document.querySelector(`#page-list li[data-id="${pageId}"]`);
    const fieldList = pageItem.querySelector('.field-list');
    const toggleBtn = pageItem.querySelector('.toggle-btn');
    
    if (fieldList.style.display === 'none') {
        fieldList.style.display = 'block';
        toggleBtn.textContent = '▼';
    } else {
        fieldList.style.display = 'none';
        toggleBtn.textContent = '►';
    }
}

function addField(type) {
    fieldCount++;
    const field = {
        id: `field-${fieldCount}`,
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${fieldCount}`,
        page: usePages ? currentPage : 1
    };

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${field.label} (${field.type})</span>
        <button class="remove-btn" onclick="removeField('${field.id}')">&times;</button>
    `;
    listItem.setAttribute('data-id', field.id);
    listItem.setAttribute('data-type', field.type);
    listItem.setAttribute('data-page', field.page);
    listItem.onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            selectField(field);
        }
    };

    if (usePages) {
        const currentPageElement = document.querySelector(`#page-list li[data-id="page-${currentPage}"]`);
        const fieldList = currentPageElement.querySelector('.field-list');
        fieldList.appendChild(listItem);
    } else {
        const fieldList = document.querySelector('#field-list');
        fieldList.appendChild(listItem);
    }

    selectField(field);
    toggleFieldMenu();
    initSortable();
}

function selectPage(page) {
    currentPage = parseInt(page.id.split('-')[1]);
    renderForm();
    highlightSelectedPage(page.id);
    updateProgressBar();
}

function highlightSelectedPage(pageId) {
    const listItems = document.querySelectorAll('#page-list li');
    listItems.forEach(item => {
        item.classList.remove('selected');
        if (item.getAttribute('data-id') === pageId) {
            item.classList.add('selected');
        }
    });
}

function removePage(pageId) {
    const listItem = document.querySelector(`#page-list li[data-id="${pageId}"]`);
    if (listItem) {
        listItem.remove();
        // Remove all fields associated with this page
        const fieldsToRemove = document.querySelectorAll(`#field-list li[data-page="${pageId.split('-')[1]}"]`);
        fieldsToRemove.forEach(field => field.remove());
        renderForm();
        updateProgressBar();
    }
}

function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const totalPages = usePages ? document.querySelectorAll('#page-list li').length : 1;
    const progress = (currentPage / totalPages) * 100;

    progressBar.style.width = `${progress}%`;

    switch (progressBarType) {
        case 'percentage':
            progressBarContainer.textContent = `${Math.round(progress)}%`;
            break;
        case 'fraction':
            progressBarContainer.textContent = `${currentPage} / ${totalPages}`;
            break;
        default:
            progressBarContainer.textContent = '';
    }
}

function toggleFieldMenu() {
    const fieldOptions = document.getElementById('field-options');
    fieldOptions.classList.toggle('hidden');
}

function selectField(field) {
    selectedField = field;
    renderForm();
    highlightSelectedField(field.id);
}

function highlightSelectedField(fieldId) {
    const listItems = document.querySelectorAll('#field-list li');
    listItems.forEach(item => {
        item.classList.remove('selected');
        if (item.getAttribute('data-id') === fieldId) {
            item.classList.add('selected');
        }
    });
}

function renderForm() {
    const formPreview = document.getElementById('custom-form');
    formPreview.innerHTML = '';

    const currentPageElement = document.querySelector(`#page-list li[data-id="page-${currentPage}"]`);
    const fields = Array.from(currentPageElement.querySelector('.field-list').children);
    
    fields.forEach(listItem => {
        const field = {
            id: listItem.getAttribute('data-id'),
            type: listItem.getAttribute('data-type'),
            label: listItem.querySelector('span').textContent.split(' (')[0]
        };

        const fieldElement = document.createElement('div');
        fieldElement.className = 'form-field';
        fieldElement.id = `field-block-${field.id}`;
        fieldElement.innerHTML = `
            <label for="${field.id}">${field.label}:</label>
            ${getInputHtml(field.type, field.id)}
        `;
        formPreview.appendChild(fieldElement);
    });

    const totalPages = document.querySelectorAll('#page-list > li').length;
    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => {
            currentPage++;
            renderForm();
            updateProgressBar();
        };
        formPreview.appendChild(nextButton);
    }

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => {
            currentPage--;
            renderForm();
            updateProgressBar();
        };
        formPreview.insertBefore(prevButton, formPreview.firstChild);
    }

    if (currentPage === totalPages) {
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.onclick = submitForm;
        formPreview.appendChild(submitButton);
    }
}

function removeField(fieldId) {
    const listItem = document.querySelector(`#field-list li[data-id="${fieldId}"]`);
    if (listItem) {
        listItem.remove();
        renderForm();
    }
}

function getInputHtml(type, id) {
    switch(type) {
        case 'text':
            return `<input type="text" id="${id}" name="${id}">`;
        case 'email':
            return `<input type="email" id="${id}" name="${id}">`;
        case 'number':
            return `<input type="number" id="${id}" name="${id}">`;
        case 'textarea':
            return `<textarea id="${id}" name="${id}"></textarea>`;
        case 'select':
            return `
                <select id="${id}" name="${id}">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
            `;
        case 'checkbox':
            return `<input type="checkbox" id="${id}" name="${id}">`;
        case 'radio':
            return `
                <input type="radio" id="${id}_1" name="${id}" value="option1">
                <label for="${id}_1">Option 1</label>
                <input type="radio" id="${id}_2" name="${id}" value="option2">
                <label for="${id}_2">Option 2</label>
            `;
    }
}

function submitForm() {
    const formData = new FormData(document.getElementById('custom-form'));
    
    // Use AJAX to submit the form
    fetch('/submit-form', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Form submitted successfully!');
        // Reset the form or redirect to a thank you page
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
    });
}

function generateEmbedCode() {
    const formHtml = document.getElementById('custom-form').innerHTML;
    const embedCode = `
<div id="embedded-form-container">
    <div id="progress-bar-container">
        <div id="progress-bar"></div>
    </div>
    <form id="embedded-form">
        ${formHtml}
    </form>
</div>
<script>
(function() {
    let currentPage = 1;
    const totalPages = ${pageCount};

    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progress = (currentPage / totalPages) * 100;
        progressBar.style.width = \`\${progress}%\`;
    }

    function submitForm(e) {
        e.preventDefault();
        const formData = new FormData(document.getElementById('embedded-form'));
        
        fetch('/submit-form', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            alert('Form submitted successfully!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        });
    }

    document.getElementById('embedded-form').onsubmit = submitForm;
    updateProgressBar();
})();
</script>
    `;
    document.getElementById('embed-code').value = embedCode;
}

// Add this at the end of the file
document.getElementById('add-page-btn').addEventListener('click', addPage);

function initSortable() {
    const pageList = document.getElementById('page-list');
    const fieldLists = document.querySelectorAll('.field-list');
    
    initSortableList(pageList);
    fieldLists.forEach(initSortableList);

    function initSortableList(list) {
        let draggedItem = null;

        list.addEventListener('dragstart', function(e) {
            draggedItem = e.target;
            setTimeout(() => {
                e.target.classList.add('dragging');
            }, 0);
        });

        list.addEventListener('dragend', function(e) {
            e.target.classList.remove('dragging');
            renderForm();
        });

        list.addEventListener('dragover', function(e) {
            e.preventDefault();
            const afterElement = getDragAfterElement(list, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                list.appendChild(draggable);
            } else {
                list.insertBefore(draggable, afterElement);
            }
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    const listItems = document.querySelectorAll('#page-list > li, .field-list > li');
    listItems.forEach(item => {
        item.setAttribute('draggable', 'true');
    });
}

// Apply default theme on page load
document.addEventListener('DOMContentLoaded', function() {
    applyTheme(currentTheme);
    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
    initSortable();
});
