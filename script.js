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
    document.getElementById('generate-embed-code').addEventListener('click', generateEmbedCode);
}

// Initialize the form builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', initFormBuilder);

function renderForm() {
    const formPreview = document.getElementById('custom-form');
    formPreview.innerHTML = '';

    const fields = document.querySelectorAll('#field-list > li');
    fields.forEach(field => {
        const fieldElement = createFieldElement(field);
        formPreview.appendChild(fieldElement);
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
    document.getElementById('field-list').appendChild(listItem);
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
    listItem.innerHTML = `
        <span contenteditable="true">${field.label}</span>
        <button class="config-btn" onclick="configField('${field.id}')">⚙</button>
        <button class="remove-btn" onclick="removeField('${field.id}')">&times;</button>
    `;
    listItem.setAttribute('data-id', field.id);
    listItem.setAttribute('data-type', field.type);
    listItem.setAttribute('draggable', 'true');
    listItem.onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            selectField(field);
        }
    };
    return listItem;
}

// Configure a field
function configField(fieldId) {
    console.log(`Configuring field: ${fieldId}`);
    // Implement field configuration logic here
}

// Toggle the field menu visibility
function toggleFieldMenu() {
    const fieldOptions = document.getElementById('field-options');
    const hierarchyTree = document.getElementById('hierarchy-tree');
    
    if (fieldOptions.classList.contains('hidden')) {
        fieldOptions.classList.remove('hidden');
        fieldOptions.style.display = 'grid';
        
        // Adjust field options size based on hierarchy tree
        const hierarchyTreeRect = hierarchyTree.getBoundingClientRect();
        fieldOptions.style.width = `${hierarchyTreeRect.width}px`;
    } else {
        fieldOptions.classList.add('hidden');
        fieldOptions.style.display = 'none';
    }
}

// Remove the window resize event listener as it's no longer needed

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
        case 'text':
            return `<input type="text" id="${id}" name="${id}">`;
        case 'textarea':
            return `<textarea id="${id}" name="${id}"></textarea>`;
        case 'email':
            return `<input type="email" id="${id}" name="${id}">`;
        case 'number':
            return `<input type="number" id="${id}" name="${id}">`;
        case 'select':
            return `
                <select id="${id}" name="${id}">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
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
        case 'name':
            return `
                <input type="text" id="${id}_first" name="${id}_first" placeholder="First Name">
                <input type="text" id="${id}_last" name="${id}_last" placeholder="Last Name">
            `;
        case 'phone':
            return `<input type="tel" id="${id}" name="${id}">`;
        case 'date':
            return `<input type="date" id="${id}" name="${id}">`;
        case 'file':
            return `<input type="file" id="${id}" name="${id}">`;
        case 'website':
            return `<input type="url" id="${id}" name="${id}">`;
        case 'address':
            return `
                <input type="text" id="${id}_street" name="${id}_street" placeholder="Street Address">
                <input type="text" id="${id}_city" name="${id}_city" placeholder="City">
                <input type="text" id="${id}_state" name="${id}_state" placeholder="State">
                <input type="text" id="${id}_zip" name="${id}_zip" placeholder="ZIP Code">
            `;
        case 'time':
            return `<input type="time" id="${id}" name="${id}">`;
        case 'password':
            return `<input type="password" id="${id}" name="${id}">`;
        case 'range':
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
        const afterElement = getDragAfterElement(fieldList, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            fieldList.appendChild(draggable);
        } else {
            fieldList.insertBefore(draggable, afterElement);
        }
    });

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

    const listItems = document.querySelectorAll('#field-list > li');
    listItems.forEach(item => {
        item.setAttribute('draggable', 'true');
    });
}
