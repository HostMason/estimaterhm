let fieldCount = 0;
let selectedField = null;

let formSettings = {
    enablePages: false,
    progressBarType: 'none'
};

document.addEventListener('DOMContentLoaded', function() {
    const startBuildingBtn = document.getElementById('start-building');
    const layoutQuestions = document.getElementById('layout-questions');
    const builderContainer = document.getElementById('builder-container');
    const generateEmbedCodeBtn = document.getElementById('generate-embed-code');
    const embedCode = document.getElementById('embed-code');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const saveSettingsBtn = document.getElementById('save-settings');
    const closeSettingsBtn = document.getElementById('close-settings');

    startBuildingBtn.addEventListener('click', function() {
        layoutQuestions.style.display = 'none';
        builderContainer.style.display = 'flex';
        generateEmbedCodeBtn.style.display = 'block';
    });

    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
    generateEmbedCodeBtn.addEventListener('click', generateEmbedCode);

    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'block';
    });

    saveSettingsBtn.addEventListener('click', function() {
        formSettings.enablePages = document.getElementById('enable-pages').checked;
        formSettings.progressBarType = document.getElementById('progress-bar-type').value;
        settingsModal.style.display = 'none';
        updateFormBasedOnSettings();
    });

    closeSettingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    initSortable();
});

function updateFormBasedOnSettings() {
    // Implement the logic to update the form based on the settings
    console.log('Form settings updated:', formSettings);
    // You can add more logic here to change the form structure based on the settings
}

function addField(type) {
    fieldCount++;
    const field = {
        id: `field-${fieldCount}`,
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${fieldCount}`
    };

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${field.label} (${field.type})</span>
        <button class="remove-btn" onclick="removeField('${field.id}')">&times;</button>
    `;
    listItem.setAttribute('data-id', field.id);
    listItem.setAttribute('data-type', field.type);
    listItem.onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            selectField(field);
        }
    };

    document.getElementById('field-list').appendChild(listItem);

    selectField(field);
    toggleFieldMenu();
    initSortable();
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

    const fields = Array.from(document.getElementById('field-list').children);
    
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

    const submitButton = document.createElement('button');
    submitButton.textContent = 'Submit';
    submitButton.type = 'submit';
    formPreview.appendChild(submitButton);
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
        default:
            return `<input type="text" id="${id}" name="${id}">`;
    }
}

function generateEmbedCode() {
    const formType = document.getElementById('form-type').value;
    const formStyle = document.getElementById('form-style').value;
    const formHtml = document.getElementById('custom-form').innerHTML;
    const embedCode = `
<div id="embedded-form-container" class="${formStyle}-style ${formType}-form">
    <form id="embedded-form" data-enable-pages="${formSettings.enablePages}" data-progress-bar-type="${formSettings.progressBarType}">
        ${formHtml}
    </form>
</div>
<script>
(function() {
    const form = document.getElementById('embedded-form');
    const enablePages = form.dataset.enablePages === 'true';
    const progressBarType = form.dataset.progressBarType;

    if (enablePages) {
        // Implement pagination logic here
    }

    if (progressBarType !== 'none') {
        // Implement progress bar logic here
    }

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
