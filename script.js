// Global variables
let formState = {
    selectedField: null,
    selectedPage: null,
    fields: [],
    forms: []
};

// Main initialization function
function initFormBuilder() {
    setupEventListeners();
    initSortable();
    
    // Add event listener for image upload
    document.addEventListener('change', function(event) {
        if (event.target && event.target.id.endsWith('_file')) {
            handleImageUpload(event);
        }
    });

    // Initialize with a default page
    addPage();

    // Load forms list
    loadForms();

    // Set up navigation
    setupNavigation();

    // Load saved state if available
    loadSavedState();
}

// Load saved state from localStorage
function loadSavedState() {
    const savedState = localStorage.getItem('formBuilderState');
    if (savedState) {
        formState = JSON.parse(savedState);
        renderForm();
    }
}

// Save current state to localStorage
function saveState() {
    localStorage.setItem('formBuilderState', JSON.stringify(formState));
}

// Set up all event listeners
function setupEventListeners() {
    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
    document.getElementById('add-page-btn').addEventListener('click', addPage);
    document.getElementById('generate-embed-code').addEventListener('click', generateEmbedCode);
    document.getElementById('settings-btn').addEventListener('click', openSettings);
    document.getElementById('form-select').addEventListener('change', loadSubmissions);
}

// Set up navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('#nav-menu a');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            navItems.forEach(navItem => navItem.classList.remove('active'));
            this.classList.add('active');

            const targetId = this.id.replace('nav-', '') + '-content';
            contentSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
        });
    });
}

// Load forms list
function loadForms() {
    // This function should fetch the list of forms from the server
    // For now, we'll use dummy data
    const forms = [
        { id: 1, name: 'Contact Form' },
        { id: 2, name: 'Survey Form' },
        { id: 3, name: 'Registration Form' }
    ];

    const formList = document.getElementById('form-list');
    const formSelect = document.getElementById('form-select');

    formList.innerHTML = '';
    formSelect.innerHTML = '<option value="">Select a form</option>';

    forms.forEach(form => {
        const li = document.createElement('li');
        li.textContent = form.name;
        formList.appendChild(li);

        const option = document.createElement('option');
        option.value = form.id;
        option.textContent = form.name;
        formSelect.appendChild(option);
    });
}

// Load submissions for a selected form
function loadSubmissions() {
    const formId = document.getElementById('form-select').value;
    if (!formId) return;

    // This function should fetch the submissions for the selected form from the server
    // For now, we'll use dummy data
    const submissions = [
        { id: 1, date: '2023-05-01', form: 'Contact Form' },
        { id: 2, date: '2023-05-02', form: 'Contact Form' },
        { id: 3, date: '2023-05-03', form: 'Contact Form' }
    ];

    const submissionsTable = document.querySelector('#submissions-table tbody');
    submissionsTable.innerHTML = '';

    submissions.forEach(submission => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${submission.date}</td>
            <td>${submission.form}</td>
            <td><button onclick="viewSubmission(${submission.id})">View</button></td>
        `;
        submissionsTable.appendChild(tr);
    });
}

// View a specific submission
function viewSubmission(submissionId) {
    // This function should fetch and display the details of a specific submission
    alert(`Viewing submission ${submissionId}`);
}

// Add a new page to the form
function addPage() {
    const page = createFieldObject('page');
    const listItem = createFieldListItem(page);
    document.getElementById('field-list').appendChild(listItem);
    formState.fields.push(page);
    renderForm();
    initSortable();
}

// Initialize the form builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', initFormBuilder);

// Open settings modal
function openSettings() {
    // Implement settings modal functionality
    console.log('Settings opened');
}

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
            nextButton.onclick = (e) => {
                e.preventDefault();
                showPage(index + 1);
            };
            pageElement.appendChild(nextButton);
        }

        if (index > 0) {
            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.className = 'prev-page-btn';
            prevButton.onclick = (e) => {
                e.preventDefault();
                showPage(index - 1);
            };
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
        selectPage(field);
    } else {
        const pages = document.querySelectorAll('#field-list > li[data-type="page"]');
        if (pages.length === 0) {
            // If no pages exist, create a default page and add the field to it
            const defaultPage = createFieldObject('page');
            const defaultPageItem = createFieldListItem(defaultPage);
            document.getElementById('field-list').appendChild(defaultPageItem);
            defaultPageItem.querySelector('ul').appendChild(listItem);
            selectPage(defaultPage);
        } else if (formState.selectedPage) {
            // Add the field to the selected page
            const selectedPageItem = document.querySelector(`#field-list > li[data-id="${formState.selectedPage.id}"]`);
            selectedPageItem.querySelector('ul').appendChild(listItem);
        } else {
            // If no page is selected, add to the last page
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
                <span class="field-icon">${field.icon || '📄'}</span>
                <span class="field-label" contenteditable="true">${field.label}</span>
                <div class="field-actions">
                    <button class="config-btn" onclick="configField('${field.id}')">⚙</button>
                    <button class="remove-btn" onclick="removeField('${field.id}')">&times;</button>
                </div>
            </div>
            <ul class="page-fields sortable-list"></ul>
        `;
        listItem.querySelector('.field-header').onclick = (e) => {
            if (!e.target.closest('.field-actions')) {
                selectPage(field);
            }
        };
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
        listItem.querySelector('.field-header').onclick = (e) => {
            if (!e.target.closest('.field-actions')) {
                selectField(field);
            }
        };
    }
    listItem.setAttribute('data-id', field.id);
    listItem.setAttribute('data-type', field.type);
    listItem.setAttribute('draggable', 'true');
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
        slider: '🎚️',
        button: '🔳'
    };
    return icons[type] || 'Aa';
}

// Configure a field
function configField(fieldId) {
    const field = document.querySelector(`[data-id="${fieldId}"]`);
    const fieldType = field.getAttribute('data-type');
    const fieldLabel = field.querySelector('.field-label').textContent;

    let settingsHtml = `
        <h3>Settings for ${fieldLabel}</h3>
        <label>Field Label:
            <input type="text" id="field-label" value="${fieldLabel}">
        </label>
    `;

    if (fieldType === 'page') {
        settingsHtml += `
            <label>Page Icon:
                <input type="text" id="page-icon" value="${field.querySelector('.field-icon').textContent}">
            </label>
            <label>Page Header:
                <input type="text" id="page-header" value="${fieldLabel}">
            </label>
        `;
    } else {
        settingsHtml += `
            <label>Placeholder:
                <input type="text" id="field-placeholder" value="">
            </label>
            <label>Required:
                <input type="checkbox" id="field-required">
            </label>
        `;

        switch(fieldType) {
            case 'name':
                settingsHtml += `
                    <label>Show Middle Name:
                        <input type="checkbox" id="show-middle-name">
                    </label>
                `;
                break;
            case 'email':
                settingsHtml += `
                    <label>Confirm Email:
                        <input type="checkbox" id="confirm-email">
                    </label>
                `;
                break;
            case 'phone':
                settingsHtml += `
                    <label>Phone Format:
                        <select id="phone-format">
                            <option value="default">Default</option>
                            <option value="us">US (xxx) xxx-xxxx</option>
                            <option value="international">International</option>
                        </select>
                    </label>
                `;
                break;
            case 'address':
                settingsHtml += `
                    <label>Show Address Line 2:
                        <input type="checkbox" id="show-address-line-2">
                    </label>
                `;
                break;
            case 'website':
                settingsHtml += `
                    <label>URL Validation:
                        <input type="checkbox" id="url-validation" checked>
                    </label>
                `;
                break;
            case 'text':
            case 'textarea':
                settingsHtml += `
                    <label>Min Length:
                        <input type="number" id="min-length" min="0">
                    </label>
                    <label>Max Length:
                        <input type="number" id="max-length" min="0">
                    </label>
                `;
                break;
            case 'number':
                settingsHtml += `
                    <label>Min Value:
                        <input type="number" id="min-value">
                    </label>
                    <label>Max Value:
                        <input type="number" id="max-value">
                    </label>
                    <label>Step:
                        <input type="number" id="step-value" step="any">
                    </label>
                `;
                break;
            case 'radio':
            case 'checkbox':
            case 'select':
                settingsHtml += `
                    <h4>Options</h4>
                    <div id="options-container">
                        <div class="option-row">
                            <input type="text" class="option-value" value="Option 1">
                            <button onclick="removeOption(this)">Remove</button>
                        </div>
                    </div>
                    <button onclick="addOption()">Add Option</button>
                `;
                break;
            case 'date':
                settingsHtml += `
                    <label>Min Date:
                        <input type="date" id="min-date">
                    </label>
                    <label>Max Date:
                        <input type="date" id="max-date">
                    </label>
                `;
                break;
            case 'time':
                settingsHtml += `
                    <label>Min Time:
                        <input type="time" id="min-time">
                    </label>
                    <label>Max Time:
                        <input type="time" id="max-time">
                    </label>
                `;
                break;
            case 'html':
                settingsHtml += `
                    <label>HTML Content:
                        <textarea id="html-content"></textarea>
                    </label>
                `;
                break;
            case 'hidden':
                settingsHtml += `
                    <label>Hidden Value:
                        <input type="text" id="hidden-value">
                    </label>
                `;
                break;
            case 'section':
                settingsHtml += `
                    <label>Section Title:
                        <input type="text" id="section-title">
                    </label>
                `;
                break;
            case 'fieldgroup':
                settingsHtml += `
                    <label>Group Title:
                        <input type="text" id="group-title">
                    </label>
                `;
                break;
            case 'slider':
                settingsHtml += `
                    <label>Min Value:
                        <input type="number" id="slider-min">
                    </label>
                    <label>Max Value:
                        <input type="number" id="slider-max">
                    </label>
                    <label>Step:
                        <input type="number" id="slider-step" step="any">
                    </label>
                `;
                break;
            case 'button':
            case 'multi-button':
                settingsHtml += `
                    <label>Button Text:
                        <input type="text" id="button-text" value="${fieldLabel}">
                    </label>
                    <label>Button Type:
                        <select id="button-type">
                            <option value="button">Button</option>
                            <option value="submit">Submit</option>
                            <option value="reset">Reset</option>
                        </select>
                    </label>
                    <label>Upload Image:
                        <input type="file" id="button-image" accept="image/*">
                    </label>
                    <label>Image Size:
                        <select id="image-size">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </label>
                    <label>Button Size:
                        <select id="button-size">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </label>
                `;
                if (fieldType === 'multi-button') {
                    settingsHtml += `
                        <label>Allow Multiple Selections:
                            <input type="checkbox" id="allow-multiple">
                        </label>
                        <label>Number of Buttons:
                            <input type="number" id="button-count" min="1" value="1">
                        </label>
                        <div id="button-options"></div>
                        <button onclick="addButtonOption()">Add Button</button>
                    `;
                }
                break;
        }
    }

    settingsHtml += `
        <button onclick="saveFieldSettings('${fieldId}')">Save Settings</button>
        <button onclick="closeFieldSettings()">Cancel</button>
    `;

    const settingsPanel = document.getElementById('field-settings-panel');
    settingsPanel.innerHTML = settingsHtml;
    settingsPanel.style.display = 'block';
}

function addOption() {
    const optionsContainer = document.getElementById('options-container');
    const newOption = document.createElement('div');
    newOption.className = 'option-row';
    newOption.innerHTML = `
        <input type="text" class="option-value" value="New Option">
        <button onclick="removeOption(this)">Remove</button>
    `;
    optionsContainer.appendChild(newOption);
}

function removeOption(button) {
    button.parentElement.remove();
}

function saveFieldSettings(fieldId) {
    const field = document.querySelector(`[data-id="${fieldId}"]`);
    const fieldType = field.getAttribute('data-type');
    const newLabel = document.getElementById('field-label').value;

    field.querySelector('.field-label').textContent = newLabel;

    if (fieldType === 'page') {
        const newIcon = document.getElementById('page-icon').value;
        const newHeader = document.getElementById('page-header').value;
        field.querySelector('.field-icon').textContent = newIcon;
        field.querySelector('.field-label').textContent = newHeader;
    } else {
        const placeholder = document.getElementById('field-placeholder').value;
        const required = document.getElementById('field-required').checked;

        // Update the form preview
        const previewField = document.querySelector(`#field-block-${fieldId}`);
        if (previewField) {
            previewField.querySelector('label').textContent = newLabel + (required ? ' *' : '') + ':';
            const input = previewField.querySelector('input, textarea, select');
            if (input) {
                input.placeholder = placeholder;
                input.required = required;
            }

            switch(fieldType) {
                case 'name':
                    const showMiddleName = document.getElementById('show-middle-name').checked;
                    updateNameField(previewField, showMiddleName);
                    break;
                case 'email':
                    const confirmEmail = document.getElementById('confirm-email').checked;
                    updateEmailField(previewField, confirmEmail);
                    break;
                case 'phone':
                    const phoneFormat = document.getElementById('phone-format').value;
                    updatePhoneField(previewField, phoneFormat);
                    break;
                case 'address':
                    const showAddressLine2 = document.getElementById('show-address-line-2').checked;
                    updateAddressField(previewField, showAddressLine2);
                    break;
                case 'website':
                    const urlValidation = document.getElementById('url-validation').checked;
                    updateWebsiteField(previewField, urlValidation);
                    break;
                case 'text':
                case 'textarea':
                    const minLength = document.getElementById('min-length').value;
                    const maxLength = document.getElementById('max-length').value;
                    updateTextField(previewField, minLength, maxLength);
                    break;
                case 'number':
                    const minValue = document.getElementById('min-value').value;
                    const maxValue = document.getElementById('max-value').value;
                    const step = document.getElementById('step-value').value;
                    updateNumberField(previewField, minValue, maxValue, step);
                    break;
                case 'radio':
                case 'checkbox':
                case 'select':
                    const options = Array.from(document.querySelectorAll('.option-value')).map(opt => opt.value);
                    updateFieldOptions(previewField, fieldType, options);
                    break;
                case 'date':
                    const minDate = document.getElementById('min-date').value;
                    const maxDate = document.getElementById('max-date').value;
                    updateDateField(previewField, minDate, maxDate);
                    break;
                case 'time':
                    const minTime = document.getElementById('min-time').value;
                    const maxTime = document.getElementById('max-time').value;
                    updateTimeField(previewField, minTime, maxTime);
                    break;
                case 'html':
                    const htmlContent = document.getElementById('html-content').value;
                    updateHtmlField(previewField, htmlContent);
                    break;
                case 'hidden':
                    const hiddenValue = document.getElementById('hidden-value').value;
                    updateHiddenField(previewField, hiddenValue);
                    break;
                case 'section':
                    const sectionTitle = document.getElementById('section-title').value;
                    updateSectionField(previewField, sectionTitle);
                    break;
                case 'fieldgroup':
                    const groupTitle = document.getElementById('group-title').value;
                    updateFieldGroupField(previewField, groupTitle);
                    break;
                case 'slider':
                    const sliderMin = document.getElementById('slider-min').value;
                    const sliderMax = document.getElementById('slider-max').value;
                    const sliderStep = document.getElementById('slider-step').value;
                    updateSliderField(previewField, sliderMin, sliderMax, sliderStep);
                    break;
                case 'button':
                case 'multi-button':
                    const buttonText = document.getElementById('button-text').value;
                    const buttonType = document.getElementById('button-type').value;
                    const buttonImage = document.getElementById('button-image').files[0];
                    const imageSize = document.getElementById('image-size').value;
                    const buttonSize = document.getElementById('button-size').value;
                    if (fieldType === 'button') {
                        updateButtonField(previewField, buttonText, buttonType, buttonImage, imageSize, buttonSize);
                    } else {
                        const allowMultiple = document.getElementById('allow-multiple').checked;
                        const buttonCount = document.getElementById('button-count').value;
                        const buttonOptions = Array.from(document.querySelectorAll('#button-options input')).map(input => input.value);
                        updateMultiButtonField(previewField, buttonOptions, allowMultiple, imageSize, buttonSize);
                    }
                    break;
            }
        }
    }

    closeFieldSettings();
    renderForm();
}

function updateFieldOptions(previewField, fieldType, options) {
    if (fieldType === 'select') {
        const select = previewField.querySelector('select');
        select.innerHTML = options.map(opt => `<option value="${opt}">${opt}</option>`).join('');
    } else {
        const container = previewField.querySelector('.form-field');
        container.innerHTML = options.map((opt, index) => `
            <div>
                <input type="${fieldType}" id="${previewField.id}_${index}" name="${previewField.id}" value="${opt}">
                <label for="${previewField.id}_${index}">${opt}</label>
            </div>
        `).join('');
    }
}

function updateButtonField(previewField, buttonText, buttonType, buttonImage, imageSize, buttonSize) {
    const button = previewField.querySelector('button');
    button.textContent = buttonText || 'Button';
    button.type = buttonType || 'button';
    button.className = buttonSize;

    const img = previewField.querySelector('img');
    img.className = imageSize;
    if (buttonImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const sourceImg = new Image();
            sourceImg.onload = function() {
                resizeAndDisplayImage(sourceImg, img, imageSize);
            }
            sourceImg.src = e.target.result;
            img.dataset.originalSrc = e.target.result;
        }
        reader.readAsDataURL(buttonImage);
    } else if (img.dataset.originalSrc) {
        const sourceImg = new Image();
        sourceImg.onload = function() {
            resizeAndDisplayImage(sourceImg, img, imageSize);
        }
        sourceImg.src = img.dataset.originalSrc;
    } else {
        img.style.display = 'none';
        img.src = '';
    }
}

function closeFieldSettings() {
    document.getElementById('field-settings-panel').style.display = 'none';
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

// Select a page
function selectPage(page) {
    formState.selectedPage = page;
    renderForm();
    highlightSelectedPage(page.id);
}

// Highlight the selected field in the list
function highlightSelectedField(fieldId) {
    document.querySelectorAll('#field-list li').forEach(item => {
        item.classList.toggle('selected', item.getAttribute('data-id') === fieldId);
    });
}

// Highlight the selected page in the list
function highlightSelectedPage(pageId) {
    document.querySelectorAll('#field-list > li[data-type="page"]').forEach(item => {
        item.classList.toggle('selected-page', item.getAttribute('data-id') === pageId);
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
        case 'button':
            return `
                <div class="button-container">
                    <img id="${id}_image" src="" alt="Button image" style="display: none; margin-bottom: 10px;">
                    <input type="file" id="${id}_file" accept="image/*" style="display: none;">
                    <label for="${id}_file" class="upload-image-btn">Upload Image</label>
                    <button type="button" id="${id}">Button</button>
                </div>
            `;
        case 'multi-button':
            return `
                <div class="multi-button-container" id="${id}">
                    <!-- Buttons will be dynamically added here -->
                </div>
            `;
        default:
            return `<input type="text" id="${id}" name="${id}">`;
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const imageId = event.target.id.replace('_file', '_image');
    const image = document.getElementById(imageId);
    const sizeSelect = document.getElementById('image-size');

    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            resizeAndDisplayImage(img, image, sizeSelect.value);
        }
        img.src = e.target.result;
        // Store the original image data for future resizing
        image.dataset.originalSrc = e.target.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    }
}

function resizeAndDisplayImage(sourceImg, targetImg, size) {
    const canvas = document.createElement('canvas');
    let width, height;
    switch(size) {
        case 'small':
            width = height = 50;
            break;
        case 'medium':
            width = height = 100;
            break;
        case 'large':
            width = height = 150;
            break;
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(sourceImg, 0, 0, width, height);
    targetImg.src = canvas.toDataURL();
    targetImg.style.display = 'block';
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
    const pages = form.querySelectorAll('.form-page');
    let currentPage = 0;

    function showPage(pageIndex) {
        pages.forEach((page, index) => {
            page.style.display = index === pageIndex ? 'block' : 'none';
        });
    }

    form.querySelectorAll('.next-page-btn').forEach(btn => {
        btn.removeAttribute('data-preview');
        btn.onclick = () => {
            currentPage++;
            showPage(currentPage);
        };
    });

    form.querySelectorAll('.prev-page-btn').forEach(btn => {
        btn.onclick = () => {
            currentPage--;
            showPage(currentPage);
        };
    });

    showPage(0);

    form.onsubmit = function(e) {
        e.preventDefault();
        submitForm(this);
    };

    function submitForm(form) {
        const formData = new FormData(form);
        
        fetch('/submit-form', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Form submitted successfully!');
            } else if (data.subform) {
                loadSubForm(data.subform);
            } else {
                alert('Form submission failed. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the form.');
        });
    }

    function loadSubForm(subformUrl) {
        fetch(subformUrl)
        .then(response => response.text())
        .then(html => {
            const subformContainer = document.createElement('div');
            subformContainer.innerHTML = html;
            const subform = subformContainer.querySelector('form');
            subform.onsubmit = function(e) {
                e.preventDefault();
                submitForm(this);
            };
            form.parentNode.replaceChild(subformContainer, form);
        })
        .catch(error => {
            console.error('Error loading subform:', error);
            alert('An error occurred while loading the subform.');
        });
    }
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
function updateNameField(previewField, showMiddleName) {
    const nameInputs = previewField.querySelectorAll('input[type="text"]');
    if (showMiddleName && nameInputs.length === 2) {
        const middleNameInput = document.createElement('input');
        middleNameInput.type = 'text';
        middleNameInput.placeholder = 'Middle Name';
        nameInputs[0].insertAdjacentElement('afterend', middleNameInput);
    } else if (!showMiddleName && nameInputs.length === 3) {
        nameInputs[1].remove();
    }
}

function updateEmailField(previewField, confirmEmail) {
    const emailInputs = previewField.querySelectorAll('input[type="email"]');
    if (confirmEmail && emailInputs.length === 1) {
        const confirmEmailInput = document.createElement('input');
        confirmEmailInput.type = 'email';
        confirmEmailInput.placeholder = 'Confirm Email';
        emailInputs[0].insertAdjacentElement('afterend', confirmEmailInput);
    } else if (!confirmEmail && emailInputs.length === 2) {
        emailInputs[1].remove();
    }
}

function updatePhoneField(previewField, phoneFormat) {
    const phoneInput = previewField.querySelector('input[type="tel"]');
    switch(phoneFormat) {
        case 'us':
            phoneInput.pattern = '\\([0-9]{3}\\) [0-9]{3}-[0-9]{4}';
            phoneInput.placeholder = '(123) 456-7890';
            break;
        case 'international':
            phoneInput.pattern = '\\+[0-9]{1,4} [0-9]{1,14}';
            phoneInput.placeholder = '+1 1234567890';
            break;
        default:
            phoneInput.pattern = '';
            phoneInput.placeholder = '';
    }
}

function updateAddressField(previewField, showAddressLine2) {
    const addressInputs = previewField.querySelectorAll('input[type="text"]');
    if (showAddressLine2 && addressInputs.length === 4) {
        const addressLine2Input = document.createElement('input');
        addressLine2Input.type = 'text';
        addressLine2Input.placeholder = 'Address Line 2';
        addressInputs[0].insertAdjacentElement('afterend', addressLine2Input);
    } else if (!showAddressLine2 && addressInputs.length === 5) {
        addressInputs[1].remove();
    }
}

function updateWebsiteField(previewField, urlValidation) {
    const websiteInput = previewField.querySelector('input[type="url"]');
    websiteInput.pattern = urlValidation ? 'https?://.*' : '';
}

function updateTextField(previewField, minLength, maxLength) {
    const textInput = previewField.querySelector('input[type="text"], textarea');
    textInput.minLength = minLength;
    textInput.maxLength = maxLength;
}

function updateNumberField(previewField, minValue, maxValue, step) {
    const numberInput = previewField.querySelector('input[type="number"]');
    numberInput.min = minValue;
    numberInput.max = maxValue;
    numberInput.step = step;
}

function updateDateField(previewField, minDate, maxDate) {
    const dateInput = previewField.querySelector('input[type="date"]');
    dateInput.min = minDate;
    dateInput.max = maxDate;
}

function updateTimeField(previewField, minTime, maxTime) {
    const timeInput = previewField.querySelector('input[type="time"]');
    timeInput.min = minTime;
    timeInput.max = maxTime;
}

function updateHtmlField(previewField, htmlContent) {
    previewField.querySelector('div').innerHTML = htmlContent;
}

function updateHiddenField(previewField, hiddenValue) {
    previewField.querySelector('input[type="hidden"]').value = hiddenValue;
}

function updateSectionField(previewField, sectionTitle) {
    previewField.querySelector('legend').textContent = sectionTitle;
}

function updateFieldGroupField(previewField, groupTitle) {
    previewField.querySelector('div').setAttribute('aria-label', groupTitle);
}

function updateSliderField(previewField, min, max, step) {
    const sliderInput = previewField.querySelector('input[type="range"]');
    sliderInput.min = min;
    sliderInput.max = max;
    sliderInput.step = step;
}
function updateMultiButtonField(previewField, buttonOptions, allowMultiple, imageSize, buttonSize) {
    const container = previewField.querySelector('.multi-button-container');
    container.innerHTML = '';
    const inputType = allowMultiple ? 'checkbox' : 'radio';
    
    buttonOptions.forEach((option, index) => {
        const button = document.createElement('div');
        button.className = `multi-button ${buttonSize}`;
        button.innerHTML = `
            <input type="${inputType}" id="${previewField.id}_${index}" name="${previewField.id}" value="${option}">
            <label for="${previewField.id}_${index}">
                <img src="" alt="${option}" class="button-image ${imageSize}">
                <span>${option}</span>
            </label>
        `;
        container.appendChild(button);
    });

    // Add field button
    const fieldButton = document.createElement('button');
    fieldButton.textContent = 'Add Field';
    fieldButton.onclick = () => addFieldToMultiButton(previewField.id);
    container.appendChild(fieldButton);
}

function addFieldToMultiButton(multiButtonId) {
    const container = document.querySelector(`#${multiButtonId} .multi-button-container`);
    const index = container.querySelectorAll('.multi-button').length;
    const newOption = `New Option ${index + 1}`;
    const button = document.createElement('div');
    button.className = `multi-button medium`;
    button.innerHTML = `
        <input type="radio" id="${multiButtonId}_${index}" name="${multiButtonId}" value="${newOption}">
        <label for="${multiButtonId}_${index}">
            <img src="" alt="${newOption}" class="button-image medium">
            <span>${newOption}</span>
        </label>
    `;
    container.insertBefore(button, container.lastChild);
}

function addButtonOption() {
    const optionsContainer = document.getElementById('button-options');
    const newOption = document.createElement('div');
    newOption.innerHTML = `
        <input type="text" value="New Button">
        <button onclick="this.parentElement.remove()">Remove</button>
    `;
    optionsContainer.appendChild(newOption);
}
