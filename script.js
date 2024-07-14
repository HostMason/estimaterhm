// Global variables
let formState = {
    selectedField: null,
    selectedPage: null,
    fields: [],
    forms: []
};

let isLoggedIn = false;

// Undo/Redo functionality
let undoStack = [];
let redoStack = [];

function saveState() {
    undoStack.push(JSON.stringify(formState));
    redoStack = [];
    updateUndoRedoButtons();
}

function undo() {
    if (undoStack.length > 1) {
        redoStack.push(undoStack.pop());
        formState = JSON.parse(undoStack[undoStack.length - 1]);
        renderForm();
        updateUndoRedoButtons();
    }
}

function redo() {
    if (redoStack.length > 0) {
        undoStack.push(redoStack.pop());
        formState = JSON.parse(undoStack[undoStack.length - 1]);
        renderForm();
        updateUndoRedoButtons();
    }
}

function updateUndoRedoButtons() {
    const undoButton = document.getElementById('undo-btn');
    const redoButton = document.getElementById('redo-btn');
    if (undoButton && redoButton) {
        undoButton.disabled = undoStack.length <= 1;
        redoButton.disabled = redoStack.length === 0;
    }
}

// Main initialization function
export function initFormBuilder() {
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

    // Load saved state if available
    loadSavedState();

    // Set up authentication
    setupAuthentication();

    // Update UI based on authentication status
    updateAuthUI();

    // Initialize undo/redo functionality
    updateUndoRedoButtons();

    // Render the initial form
    renderForm();
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
    document.getElementById('add-page-btn').addEventListener('click', addPage);
    document.getElementById('generate-embed-code').addEventListener('click', generateEmbedCode);
    document.getElementById('settings-btn').addEventListener('click', openSettings);
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);
    document.getElementById('save-form-btn').addEventListener('click', saveForm);
}

// Add other necessary functions here (e.g., toggleFieldMenu, addPage, generateEmbedCode, openSettings, saveForm)

// Placeholder functions (implement these based on your requirements)
function toggleFieldMenu() {
    console.log('Toggle field menu');
}

function addPage() {
    console.log('Add page');
}

function generateEmbedCode() {
    console.log('Generate embed code');
}

function openSettings() {
    console.log('Open settings');
}

function saveForm() {
    console.log('Save form');
}

function loadForms() {
    console.log('Load forms');
}

function loadSavedState() {
    console.log('Load saved state');
}

function setupAuthentication() {
    console.log('Setup authentication');
}

function updateAuthUI() {
    console.log('Update auth UI');
}

function initSortable() {
    console.log('Initialize sortable');
}

function renderForm() {
    console.log('Render form');
}

function handleImageUpload(event) {
    console.log('Handle image upload', event);
}

// Set up authentication event listeners
function setupAuthentication() {
    document.getElementById('login-btn').addEventListener('click', showLoginModal);
    document.getElementById('register-btn').addEventListener('click', showRegisterModal);
    document.getElementById('logout-btn').addEventListener('click', logout);
}

// Show login modal
function showLoginModal() {
    const modal = createModal('Login', `
        <input type="text" id="login-username" placeholder="Username">
        <input type="password" id="login-password" placeholder="Password">
        <button id="login-submit">Login</button>
    `);
    document.body.appendChild(modal);
    document.getElementById('login-submit').addEventListener('click', login);
}

// Show register modal
function showRegisterModal() {
    const modal = createModal('Register', `
        <input type="text" id="register-username" placeholder="Username">
        <input type="password" id="register-password" placeholder="Password">
        <button id="register-submit">Register</button>
    `);
    document.body.appendChild(modal);
    document.getElementById('register-submit').addEventListener('click', register);
}

// Create modal
function createModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
            ${content}
            <button class="close-modal">Close</button>
        </div>
    `;
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    return modal;
}

// Login function
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logged in successfully') {
            isLoggedIn = true;
            updateAuthUI();
            document.querySelector('.modal').remove();
        } else {
            alert(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Register function
function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'User created successfully') {
            document.querySelector('.modal').remove();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Logout function
function logout() {
    fetch('/logout', {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        isLoggedIn = false;
        updateAuthUI();
        alert(data.message);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Update UI based on authentication status
function updateAuthUI() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const formBuilder = document.getElementById('form-builder');

    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        formBuilder.style.display = 'block';
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        formBuilder.style.display = 'none';
    }
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
    document.getElementById('undo-btn').addEventListener('click', undo);
    document.getElementById('redo-btn').addEventListener('click', redo);
    document.getElementById('save-form-btn').addEventListener('click', saveForm);

    // Pagination buttons
    document.getElementById('prev-page').addEventListener('click', () => changePage(-1));
    document.getElementById('next-page').addEventListener('click', () => changePage(1));

    // Create new form button
    document.getElementById('create-new-form').addEventListener('click', createNewForm);

    // Keyboard accessibility
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Z for Undo
    if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
        event.preventDefault();
        undo();
    }
    // Ctrl/Cmd + Y for Redo
    if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
        event.preventDefault();
        redo();
    }
    // Ctrl/Cmd + S for Save
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveForm();
    }
}

function makeElementsFocusable() {
    const focusableElements = document.querySelectorAll('#field-list .field-item, #field-options .field-option');
    focusableElements.forEach(element => {
        element.setAttribute('tabindex', '0');
        element.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                element.click();
            }
        });
    });
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
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Form Builder Settings</h2>
            <div class="setting">
                <label for="background-color">Background Color:</label>
                <input type="color" id="background-color" value="${currentTheme.backgroundColor}">
            </div>
            <div class="setting">
                <label for="text-color">Text Color:</label>
                <input type="color" id="text-color" value="${currentTheme.textColor}">
            </div>
            <div class="setting">
                <label for="accent-color">Accent Color:</label>
                <input type="color" id="accent-color" value="${currentTheme.accentColor}">
            </div>
            <div class="setting">
                <label for="font-family">Font Family:</label>
                <select id="font-family">
                    <option value="Inter, Arial, sans-serif" ${currentTheme.fontFamily === 'Inter, Arial, sans-serif' ? 'selected' : ''}>Inter</option>
                    <option value="Arial, sans-serif" ${currentTheme.fontFamily === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
                    <option value="Helvetica, sans-serif" ${currentTheme.fontFamily === 'Helvetica, sans-serif' ? 'selected' : ''}>Helvetica</option>
                    <option value="Times New Roman, serif" ${currentTheme.fontFamily === 'Times New Roman, serif' ? 'selected' : ''}>Times New Roman</option>
                </select>
            </div>
            <button id="save-settings">Save Settings</button>
            <button id="close-settings">Close</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('save-settings').addEventListener('click', function() {
        const newTheme = {
            backgroundColor: document.getElementById('background-color').value,
            textColor: document.getElementById('text-color').value,
            accentColor: document.getElementById('accent-color').value,
            fontFamily: document.getElementById('font-family').value
        };
        applyTheme(newTheme);
        modal.remove();
    });

    document.getElementById('close-settings').addEventListener('click', function() {
        modal.remove();
    });
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

    const settingsPanel = document.getElementById('field-settings-panel');
    settingsPanel.innerHTML = '';

    const form = document.createElement('form');
    form.id = 'field-settings-form';

    const labelInput = createInput('text', 'field-label', 'Field Label', fieldLabel);
    form.appendChild(labelInput);

    if (fieldType === 'page') {
        const pageIcon = createInput('text', 'page-icon', 'Page Icon', field.querySelector('.field-icon').textContent);
        const pageHeader = createInput('text', 'page-header', 'Page Header', fieldLabel);
        form.appendChild(pageIcon);
        form.appendChild(pageHeader);
    } else {
        const placeholder = createInput('text', 'field-placeholder', 'Placeholder', '');
        const required = createCheckbox('field-required', 'Required');
        form.appendChild(placeholder);
        form.appendChild(required);

        switch(fieldType) {
            case 'name':
                form.appendChild(createCheckbox('show-middle-name', 'Show Middle Name'));
                break;
            case 'email':
                form.appendChild(createCheckbox('confirm-email', 'Confirm Email'));
                break;
            case 'phone':
                form.appendChild(createSelect('phone-format', 'Phone Format', [
                    {value: 'default', text: 'Default'},
                    {value: 'us', text: 'US (xxx) xxx-xxxx'},
                    {value: 'international', text: 'International'}
                ]));
                break;
            case 'address':
                form.appendChild(createCheckbox('show-address-line-2', 'Show Address Line 2'));
                break;
            case 'website':
                form.appendChild(createCheckbox('url-validation', 'URL Validation'));
                break;
            case 'text':
            case 'textarea':
                form.appendChild(createInput('number', 'min-length', 'Min Length', '', {min: 0}));
                form.appendChild(createInput('number', 'max-length', 'Max Length', '', {min: 0}));
                break;
            case 'number':
                form.appendChild(createInput('number', 'min-value', 'Min Value'));
                form.appendChild(createInput('number', 'max-value', 'Max Value'));
                form.appendChild(createInput('number', 'step-value', 'Step', '', {step: 'any'}));
                break;
            case 'radio':
            case 'checkbox':
            case 'select':
                const optionsContainer = document.createElement('div');
                optionsContainer.id = 'options-container';
                form.appendChild(optionsContainer);
                form.appendChild(createButton('Add Option', () => addOption(optionsContainer)));
                break;
            case 'date':
                form.appendChild(createInput('date', 'min-date', 'Min Date'));
                form.appendChild(createInput('date', 'max-date', 'Max Date'));
                break;
            case 'time':
                form.appendChild(createInput('time', 'min-time', 'Min Time'));
                form.appendChild(createInput('time', 'max-time', 'Max Time'));
                break;
            case 'html':
                form.appendChild(createTextarea('html-content', 'HTML Content'));
                break;
            case 'hidden':
                form.appendChild(createInput('text', 'hidden-value', 'Hidden Value'));
                break;
            case 'section':
                form.appendChild(createInput('text', 'section-title', 'Section Title'));
                break;
            case 'fieldgroup':
                form.appendChild(createInput('text', 'group-title', 'Group Title'));
                break;
            case 'slider':
                form.appendChild(createInput('number', 'slider-min', 'Min Value'));
                form.appendChild(createInput('number', 'slider-max', 'Max Value'));
                form.appendChild(createInput('number', 'slider-step', 'Step', '', {step: 'any'}));
                break;
            case 'button':
            case 'multi-button':
                form.appendChild(createInput('text', 'button-text', 'Button Text', fieldLabel));
                form.appendChild(createSelect('button-type', 'Button Type', [
                    {value: 'button', text: 'Button'},
                    {value: 'submit', text: 'Submit'},
                    {value: 'reset', text: 'Reset'}
                ]));
                form.appendChild(createInput('file', 'button-image', 'Upload Image', '', {accept: 'image/*'}));
                form.appendChild(createSelect('image-size', 'Image Size', [
                    {value: 'small', text: 'Small'},
                    {value: 'medium', text: 'Medium'},
                    {value: 'large', text: 'Large'}
                ]));
                form.appendChild(createSelect('button-size', 'Button Size', [
                    {value: 'small', text: 'Small'},
                    {value: 'medium', text: 'Medium'},
                    {value: 'large', text: 'Large'}
                ]));
                if (fieldType === 'multi-button') {
                    form.appendChild(createCheckbox('allow-multiple', 'Allow Multiple Selections'));
                    form.appendChild(createInput('number', 'button-count', 'Number of Buttons', '1', {min: 1}));
                    const buttonOptions = document.createElement('div');
                    buttonOptions.id = 'button-options';
                    form.appendChild(buttonOptions);
                    form.appendChild(createButton('Add Button', () => addButtonOption(buttonOptions)));
                }
                break;
        }
    }

    const saveButton = createButton('Save Settings', () => saveFieldSettings(fieldId));
    const cancelButton = createButton('Cancel', closeFieldSettings);
    form.appendChild(saveButton);
    form.appendChild(cancelButton);

    settingsPanel.appendChild(form);
    settingsPanel.style.display = 'block';
}

function createInput(type, id, label, value = '', attributes = {}) {
    const container = document.createElement('div');
    container.className = 'form-group';
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.value = value;
    Object.keys(attributes).forEach(key => input.setAttribute(key, attributes[key]));
    container.appendChild(labelElement);
    container.appendChild(input);
    return container;
}

function createCheckbox(id, label) {
    const container = document.createElement('div');
    container.className = 'form-group';
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = id;
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    container.appendChild(input);
    container.appendChild(labelElement);
    return container;
}

function createSelect(id, label, options) {
    const container = document.createElement('div');
    container.className = 'form-group';
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    const select = document.createElement('select');
    select.id = id;
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.value;
        optionElement.textContent = option.text;
        select.appendChild(optionElement);
    });
    container.appendChild(labelElement);
    container.appendChild(select);
    return container;
}

function createTextarea(id, label) {
    const container = document.createElement('div');
    container.className = 'form-group';
    const labelElement = document.createElement('label');
    labelElement.htmlFor = id;
    labelElement.textContent = label;
    const textarea = document.createElement('textarea');
    textarea.id = id;
    container.appendChild(labelElement);
    container.appendChild(textarea);
    return container;
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', onClick);
    return button;
}

function addOption(container) {
    const optionRow = document.createElement('div');
    optionRow.className = 'option-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'option-value';
    input.value = `Option ${container.children.length + 1}`;
    const removeButton = createButton('Remove', () => optionRow.remove());
    optionRow.appendChild(input);
    optionRow.appendChild(removeButton);
    container.appendChild(optionRow);
}

function addButtonOption(container) {
    const optionRow = document.createElement('div');
    optionRow.className = 'button-option-row';
    const input = document.createElement('input');
    input.type = 'text';
    input.value = `Button ${container.children.length + 1}`;
    const removeButton = createButton('Remove', () => optionRow.remove());
    optionRow.appendChild(input);
    optionRow.appendChild(removeButton);
    container.appendChild(optionRow);
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
    const form = document.getElementById('field-settings-form');
    const formData = new FormData(form);

    // Update field label in the hierarchy tree
    field.querySelector('.field-label').textContent = formData.get('field-label');

    // Update form state
    const fieldIndex = formState.fields.findIndex(f => f.id === fieldId);
    if (fieldIndex !== -1) {
        formState.fields[fieldIndex] = {
            ...formState.fields[fieldIndex],
            label: formData.get('field-label'),
            settings: Object.fromEntries(formData)
        };
    }

    // Real-time preview update
    updateFieldPreview(fieldId, fieldType, Object.fromEntries(formData));

    closeFieldSettings();
}

function updateFieldPreview(fieldId, fieldType, settings) {
    const previewField = document.querySelector(`#field-block-${fieldId}`);
    if (!previewField) return;

    const label = previewField.querySelector('label');
    label.textContent = settings['field-label'] + (settings['field-required'] ? ' *' : '') + ':';

    const input = previewField.querySelector('input, textarea, select');
    if (input) {
        input.placeholder = settings['field-placeholder'] || '';
        input.required = settings['field-required'] === 'on';
    }

    switch(fieldType) {
        case 'name':
            updateNameField(previewField, settings['show-middle-name'] === 'on');
            break;
        case 'email':
            updateEmailField(previewField, settings['confirm-email'] === 'on');
            break;
        case 'phone':
            updatePhoneField(previewField, settings['phone-format']);
            break;
        case 'address':
            updateAddressField(previewField, settings['show-address-line-2'] === 'on');
            break;
        case 'website':
            updateWebsiteField(previewField, settings['url-validation'] === 'on');
            break;
        case 'text':
        case 'textarea':
            updateTextField(previewField, settings['min-length'], settings['max-length']);
            break;
        case 'number':
            updateNumberField(previewField, settings['min-value'], settings['max-value'], settings['step-value']);
            break;
        case 'radio':
        case 'checkbox':
        case 'select':
            const options = Array.from(document.querySelectorAll('#options-container .option-value')).map(opt => opt.value);
            updateFieldOptions(previewField, fieldType, options);
            break;
        case 'date':
            updateDateField(previewField, settings['min-date'], settings['max-date']);
            break;
        case 'time':
            updateTimeField(previewField, settings['min-time'], settings['max-time']);
            break;
        case 'html':
            updateHtmlField(previewField, settings['html-content']);
            break;
        case 'hidden':
            updateHiddenField(previewField, settings['hidden-value']);
            break;
        case 'section':
            updateSectionField(previewField, settings['section-title']);
            break;
        case 'fieldgroup':
            updateFieldGroupField(previewField, settings['group-title']);
            break;
        case 'slider':
            updateSliderField(previewField, settings['slider-min'], settings['slider-max'], settings['slider-step']);
            break;
        case 'button':
        case 'multi-button':
            if (fieldType === 'button') {
                updateButtonField(previewField, settings['button-text'], settings['button-type'], settings['button-image'], settings['image-size'], settings['button-size']);
            } else {
                const buttonOptions = Array.from(document.querySelectorAll('#button-options input')).map(input => input.value);
                updateMultiButtonField(previewField, buttonOptions, settings['allow-multiple'] === 'on', settings['image-size'], settings['button-size']);
            }
            break;
    }
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
    
    new Sortable(fieldList, {
        group: 'fields',
        animation: 150,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        handle: '.field-header',
        onEnd: function() {
            updateFormState();
            renderForm();
        }
    });

    const pageFields = document.querySelectorAll('.page-fields');
    pageFields.forEach(pageField => {
        new Sortable(pageField, {
            group: 'fields',
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            handle: '.field-header',
            onEnd: function() {
                updateFormState();
                renderForm();
            }
        });
    });
}

function updateFormState() {
    const fieldList = document.getElementById('field-list');
    formState.fields = [];
    fieldList.querySelectorAll('li[data-type="page"]').forEach(page => {
        const pageFields = [];
        page.querySelectorAll('.page-fields > li').forEach(field => {
            pageFields.push({
                id: field.getAttribute('data-id'),
                type: field.getAttribute('data-type'),
                label: field.querySelector('.field-label').textContent
            });
        });
        formState.fields.push({
            id: page.getAttribute('data-id'),
            type: 'page',
            label: page.querySelector('.field-label').textContent,
            fields: pageFields
        });
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
function saveForm() {
    // Implement form saving logic here
    console.log('Form saved');
    saveState();
}

function changePage(direction) {
    // Implement pagination logic here
    console.log(`Changing page: ${direction}`);
}

function createNewForm() {
    // Implement new form creation logic here
    console.log('Creating new form');
    // Reset the form state
    formState = {
        selectedField: null,
        selectedPage: null,
        fields: [],
        forms: []
    };
    // Add a default page
    addPage();
    // Render the new form
    renderForm();
    // Save the new state
    saveState();
}
