let fieldCount = 0;
let pageCount = 0;
let selectedField = null;
let currentPage = 1;

function addPage() {
    pageCount++;
    const page = {
        id: `page-${pageCount}`,
        label: `Page ${pageCount}`
    };

    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <span>${page.label}</span>
        <button class="remove-btn" onclick="removePage('${page.id}')">&times;</button>
    `;
    listItem.setAttribute('data-id', page.id);
    listItem.onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
            selectPage(page);
        }
    };
    document.getElementById('page-list').appendChild(listItem);

    selectPage(page);
    initSortable();
    updateProgressBar();
}

function addField(type) {
    fieldCount++;
    const field = {
        id: `field-${fieldCount}`,
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${fieldCount}`,
        page: currentPage
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
    document.getElementById('field-list').appendChild(listItem);

    selectField(field);
    toggleFieldMenu();
    initSortable();
}

function selectPage(page) {
    currentPage = parseInt(page.id.split('-')[1]);
    renderForm();
    highlightSelectedPage(page.id);
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
    const totalPages = document.querySelectorAll('#page-list li').length;
    const progress = (currentPage / totalPages) * 100;
    progressBar.style.width = `${progress}%`;
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

function generateEmbedCode() {
    const formHtml = document.getElementById('custom-form').innerHTML;
    const embedCode = `
<form id="embedded-form">
    ${formHtml}
    <button type="submit">Submit</button>
</form>
<script>
document.getElementById('embedded-form').onsubmit = function(e) {
    e.preventDefault();
    // Add your form submission logic here
    alert('Form submitted!');
};
</script>
    `;
    document.getElementById('embed-code').value = embedCode;
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

    const listItems = fieldList.querySelectorAll('li');
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
