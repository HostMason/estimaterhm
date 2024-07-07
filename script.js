let fieldCount = 0;

function addField(type) {
    fieldCount++;
    const field = document.createElement('div');
    field.className = 'form-field';
    field.id = `field-block-${fieldCount}`;
    field.innerHTML = `
        <label for="field${fieldCount}">Field ${fieldCount}:</label>
        ${getInputHtml(type, fieldCount)}
        <button onclick="removeBlock('field-block-${fieldCount}')">Remove</button>
    `;
    document.getElementById('custom-form').appendChild(field);
}

function getInputHtml(type, id) {
    switch(type) {
        case 'text':
            return `<input type="text" id="field${id}" name="field${id}">`;
        case 'email':
            return `<input type="email" id="field${id}" name="field${id}">`;
        case 'number':
            return `<input type="number" id="field${id}" name="field${id}">`;
        case 'textarea':
            return `<textarea id="field${id}" name="field${id}"></textarea>`;
        case 'select':
            return `
                <select id="field${id}" name="field${id}">
                    <option value="">Select an option</option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                </select>
            `;
        case 'checkbox':
            return `<input type="checkbox" id="field${id}" name="field${id}">`;
        case 'radio':
            return `
                <input type="radio" id="field${id}_1" name="field${id}" value="option1">
                <label for="field${id}_1">Option 1</label>
                <input type="radio" id="field${id}_2" name="field${id}" value="option2">
                <label for="field${id}_2">Option 2</label>
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
});
