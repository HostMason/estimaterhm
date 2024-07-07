let fieldCount = 0;
let selectedField = null;

function addField(type) {
    fieldCount++;
    const field = {
        id: `field-${fieldCount}`,
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${fieldCount}`
    };

    const listItem = document.createElement('li');
    listItem.textContent = `${field.label} (${field.type})`;
    listItem.onclick = () => selectField(field);
    document.getElementById('field-list').appendChild(listItem);

    selectField(field);
    toggleFieldMenu();
}

function toggleFieldMenu() {
    const fieldOptions = document.getElementById('field-options');
    fieldOptions.classList.toggle('hidden');
}

function selectField(field) {
    selectedField = field;
    renderForm();
}

function renderForm() {
    const formPreview = document.getElementById('custom-form');
    formPreview.innerHTML = '';

    const fields = Array.from(document.getElementById('field-list').children);
    fields.forEach(listItem => {
        const field = {
            id: listItem.textContent.split(' (')[0].toLowerCase().replace(' ', '-'),
            type: listItem.textContent.split('(')[1].slice(0, -1),
            label: listItem.textContent.split(' (')[0]
        };

        const fieldElement = document.createElement('div');
        fieldElement.className = 'form-field';
        fieldElement.id = `field-block-${field.id}`;
        fieldElement.innerHTML = `
            <label for="${field.id}">${field.label}:</label>
            ${getInputHtml(field.type, field.id)}
            <button onclick="removeField('${field.id}')">Remove</button>
        `;
        formPreview.appendChild(fieldElement);
    });
}

function removeField(fieldId) {
    const listItem = Array.from(document.getElementById('field-list').children)
        .find(item => item.textContent.toLowerCase().includes(fieldId));
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

// Apply default theme on page load
document.addEventListener('DOMContentLoaded', function() {
    applyTheme(currentTheme);
    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
});
