// Global variables
let formState = {
    selectedField: null
};

// Main initialization function
function initFormBuilder() {
    setupEventListeners();
    initSortable();
}

// Set up all event listeners
function setupEventListeners() {
    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
    document.getElementById('add-page-btn').addEventListener('click', addPage);
    document.getElementById('generate-embed-code').addEventListener('click', generateEmbedCode);
}

// Add a new page to the form
function addPage() {
    const page = createFieldObject('page');
    const listItem = createFieldListItem(page);
    document.getElementById('field-list').appendChild(listItem);
    renderForm();
    initSortable();
}

// Initialize the form builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', initFormBuilder);

function renderForm() {
    const formPreview = document.getElementById('custom-form');
    formPreview.innerHTML = '';

    const pages = document.querySelectorAll('#field-list > li[data-type="page"]');
    pages.forEach((page, index) => {
        const pageElement = document.createElement('div');
        pageElement.className = 'form-page';
        pageElement.innerHTML = `<h2>${page.querySelector('span').textContent}</h2>`;

        const fields = page.querySelectorAll('ul > li');
        fields.forEach(field => {
            const fieldElement = createFieldElement(field);
            pageElement.appendChild(fieldElement);
        });

        formPreview.appendChild(pageElement);

        if (index < pages.length - 1) {
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.className = 'next-page-btn';
            nextButton.onclick = () => showPage(index + 1);
            pageElement.appendChild(nextButton);
        }

        if (index > 0) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.className = 'prev-page-btn';
            prevButton.onclick = () => showPage(index - 1);
            pageElement.appendChild(prevButton);
        }
    });

    showPage(0);
}

function showPage(pageIndex) {
    const pages = document.querySelectorAll('#custom-form .form-page');
    pages.forEach((page, index) => {
        page.style.display = index === pageIndex ? 'block' : 'none';
    });
}

function createFieldElement(field) {
    const fieldId = field.getAttribute('data-id');
    const fieldType = field.getAttribute('data-type');
    const fieldLabel = field.querySelector('span').textContent;

    const fieldElement = document.createElement('div');
    fieldElement.className = 'form-field';
    fieldElement.id = `field-block-${fieldId}`;
    fieldElement.innerHTML = `
        <label for="${fieldId}">${fieldLabel}:</label>
        ${getInputHtml(fieldType, fieldId)}
    `;
    return fieldElement;
}

// Add a new field to the form
function addField(type) {
    const field = createFieldObject(type);
    const listItem = createFieldListItem(field);
    
    if (type === 'page') {
        document.getElementById('field-list').appendChild(listItem);
    } else {
        const pages = document.querySelectorAll('#field-list > li[data-type="page"]');
        if (pages.length === 0) {
            // If no pages exist, create a default page and add the field to it
            const defaultPage = createFieldObject('page');
            const defaultPageItem = createFieldListItem(defaultPage);
            document.getElementById('field-list').appendChild(defaultPageItem);
            defaultPageItem.querySelector('ul').appendChild(listItem);
        } else {
            // Add the field to the last page
            const lastPage = pages[pages.length - 1];
            lastPage.querySelector('ul').appendChild(listItem);
        }
    }
    
    selectField(field);
    toggleFieldMenu();
    renderForm();
    initSortable();
}

// Create a field object
function createFieldObject(type) {
    return {
        id: `field-${Date.now()}`, // Use timestamp for unique ID
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)}`
    };
}

// Create a list item for the field
function createFieldListItem(field) {
    const listItem = document.createElement('li');
    listItem.className = 'field-item';
    if (field.type === 'page') {
        listItem.innerHTML = `
            <div class="field-header">
                <span class="field-icon">📄</span>
                <span class="field-label" contenteditable="true">${field.label}</span>
                <div class="field-actions">
                    <button class="config-btn" onclick="configField('${field.id}')">⚙</button>
                    <button class="remove-btn" onclick="removeField('${field.id}')">&times;</button>
                </div>
            </div>
            <ul class="page-fields sortable-list"></ul>
        `;
    } else {
        listItem.innerHTML = `
            <div class="field-header">
                <span class="field-icon">${getFieldIcon(field.type)}</span>
                <span class="field-label" contenteditable="true">${field.label}</span>
                <div class="field-actions">
                    <button class="config-btn" onclick="configField('${field.id}')">⚙</button>
                    <button class="remove-btn" onclick="removeField('${field.id}')">&times;</button>
                </div>
            </div>
        `;
    }
    listItem.setAttribute('data-id', field.id);
    listItem.setAttribute('data-type', field.type);
    listItem.setAttribute('draggable', 'true');
    listItem.querySelector('.field-label').onclick = (e) => {
        selectField(field);
    };
    return listItem;
}

function getFieldIcon(type) {
    const icons = {
        name: '👤',
        email: '✉️',
        phone: '📞',
        address: '🏠',
        website: '🌐',
        text: 'Aa',
        textarea: '📝',
        number: '🔢',
        radio: '⚪',
        checkbox: '☑️',
        calculations: '🧮',
        select: '▼',
        date: '📅',
        time: '⏰',
        html: '🖥️',
        hidden: '👁️',
        section: '📂',
        fieldgroup: '🗃️',
        slider: '🎚️'
    };
    return icons[type] || 'Aa';
}

// Configure a field
function configField(fieldId) {
    console.log(`Configuring field: ${fieldId}`);
    // Implement field configuration logic here
}

// Toggle the field menu visibility
function toggleFieldMenu() {
    const fieldOptions = document.getElementById('field-options');
    const addFieldBtn = document.getElementById('add-field-btn');
    
    if (fieldOptions.classList.contains('hidden')) {
        fieldOptions.classList.remove('hidden');
        fieldOptions.style.display = 'grid';
        addFieldBtn.textContent = 'Close Field Menu';
    } else {
        fieldOptions.classList.add('hidden');
        fieldOptions.style.display = 'none';
        addFieldBtn.textContent = 'Add Field';
    }
}

// Add window resize event listener to adjust layout
window.addEventListener('resize', function() {
    adjustLayout();
});

function adjustLayout() {
    const builderContainer = document.getElementById('builder-container');
    const hierarchyTree = document.getElementById('hierarchy-tree');
    const formPreview = document.getElementById('form-preview');

    if (window.innerWidth <= 768) {
        builderContainer.style.flexDirection = 'column';
        hierarchyTree.style.height = '300px';
        formPreview.style.height = '300px';
    } else {
        builderContainer.style.flexDirection = 'row';
        hierarchyTree.style.height = 'calc(100vh - 200px)';
        formPreview.style.height = 'calc(100vh - 200px)';
    }
}

// Call adjustLayout on initial load
document.addEventListener('DOMContentLoaded', function() {
    adjustLayout();
});

// Select a field
function selectField(field) {
    formState.selectedField = field;
    renderForm();
    highlightSelectedField(field.id);
}

// Highlight the selected field in the list
function highlightSelectedField(fieldId) {
    document.querySelectorAll('#field-list li').forEach(item => {
        item.classList.toggle('selected', item.getAttribute('data-id') === fieldId);
    });
}

// Remove a field from the form
function removeField(fieldId) {
    const listItem = document.querySelector(`#field-list li[data-id="${fieldId}"]`);
    if (listItem) {
        listItem.remove();
        renderForm();
    }
}

function getInputHtml(type, id) {
    switch(type) {
        case 'name':
            return `
                <input type="text" id="${id}_first" name="${id}_first" placeholder="First Name">
                <input type="text" id="${id}_last" name="${id}_last" placeholder="Last Name">
            `;
        case 'email':
            return `<input type="email" id="${id}" name="${id}">`;
        case 'phone':
            return `<input type="tel" id="${id}" name="${id}">`;
        case 'address':
            return `
                <input type="text" id="${id}_street" name="${id}_street" placeholder="Street Address">
                <input type="text" id="${id}_city" name="${id}_city" placeholder="City">
                <input type="text" id="${id}_state" name="${id}_state" placeholder="State">
                <input type="text" id="${id}_zip" name="${id}_zip" placeholder="ZIP Code">
            `;
        case 'website':
            return `<input type="url" id="${id}" name="${id}">`;
        case 'text':
            return `<input type="text" id="${id}" name="${id}">`;
        case 'textarea':
            return `<textarea id="${id}" name="${id}"></textarea>`;
        case 'number':
            return `<input type="number" id="${id}" name="${id}">`;
        case 'radio':
            return `
                <div>
                    <input type="radio" id="${id}_1" name="${id}" value="option1">
                    <label for="${id}_1">Option 1</label>
                </div>
                <div>
                    <input type="radio" id="${id}_2" name="${id}" value="option2">
                    <label for="${id}_2">Option 2</label>
                </div>
            `;
        case 'checkbox':
            return `
                <div>
                    <input type="checkbox" id="${id}_1" name="${id}" value="option1">
                    <label for="${id}_1">Option 1</label>
                </div>
                <div>
                    <input type="checkbox" id="${id}_2" name="${id}" value="option2">
                    <label for="${id}_2">Option 2</label>
                </div>
            `;
        case 'calculations':
            return `<input type="text" id="${id}" name="${id}" readonly>`;
        case 'select':
            return `
                <select id="${id}" name="${id}">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
            `;
        case 'date':
            return `<input type="date" id="${id}" name="${id}">`;
        case 'time':
            return `<input type="time" id="${id}" name="${id}">`;
        case 'html':
            return `<div id="${id}">HTML content goes here</div>`;
        case 'page':
            return `<div id="${id}" class="form-page"><h2>New Page</h2></div>`;
        case 'hidden':
            return `<input type="hidden" id="${id}" name="${id}">`;
        case 'section':
            return `<fieldset id="${id}"><legend>Section Title</legend></fieldset>`;
        case 'fieldgroup':
            return `<div id="${id}" class="field-group"></div>`;
        case 'slider':
            return `<input type="range" id="${id}" name="${id}" min="0" max="100">`;
        default:
            return `<input type="text" id="${id}" name="${id}">`;
    }
}

function generateEmbedCode() {
    const formHtml = document.getElementById('custom-form').innerHTML;
    const embedCode = `
<div id="embedded-form-container">
    <form id="embedded-form">
        ${formHtml}
    </form>
</div>
<script>
(function() {
    const form = document.getElementById('embedded-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const formData = new FormData(this);
        
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
    };
})();
</script>
    `;
    document.getElementById('embed-code').value = embedCode;
    document.getElementById('embed-code').style.display = 'block';
}

function initSortable() {
    const fieldList = document.getElementById('field-list');
    
    let draggedItem = null;

    fieldList.addEventListener('dragstart', function(e) {
        draggedItem = e.target;
        setTimeout(() => {
            e.target.classList.add('dragging');
        }, 0);
    });

    fieldList.addEventListener('dragend', function(e) {
        e.target.classList.remove('dragging');
        renderForm();
    });

    fieldList.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(e.clientY);
        const draggable = document.querySelector('.dragging');
        
        if (draggable.getAttribute('data-type') === 'page') {
            if (afterElement == null) {
                fieldList.appendChild(draggable);
            } else {
                fieldList.insertBefore(draggable, afterElement);
            }
        } else {
            const closestPage = getClosestPage(e.clientY);
            if (closestPage) {
                const pageFields = closestPage.querySelector('.page-fields');
                const afterElementInPage = getDragAfterElement(e.clientY, pageFields);
                if (afterElementInPage == null) {
                    pageFields.appendChild(draggable);
                } else {
                    pageFields.insertBefore(draggable, afterElementInPage);
                }
            }
        }
    });

    function getDragAfterElement(y, container = fieldList) {
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

    function getClosestPage(y) {
        const pages = [...fieldList.querySelectorAll('li[data-type="page"]')];
        return pages.reduce((closest, page) => {
            const box = page.getBoundingClientRect();
            const offset = y - box.top - box.height;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: page };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    const listItems = document.querySelectorAll('#field-list li');
    listItems.forEach(item => {
        item.setAttribute('draggable', 'true');
    });
}
