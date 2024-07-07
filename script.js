// Global variables
let formState = {
    fieldCount: 0,
    pageCount: 0,
    selectedField: null,
    currentPage: 1,
    settings: {
        style: 'basic',
        enablePages: false,
        progressBarType: 'none'
    }
};

let currentPage = 1;

// Main initialization function
function initFormBuilder() {
    setupEventListeners();
    initSortable();
}

// Set up all event listeners
function setupEventListeners() {
    document.getElementById('field-list').addEventListener('click', handlePageClick);
    document.getElementById('start-building').addEventListener('click', startBuilding);
    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
    document.getElementById('add-page-btn').addEventListener('click', addPage);
    document.getElementById('generate-embed-code').addEventListener('click', generateEmbedCode);
}

// Start building the form
function startBuilding() {
    updateFormSettings();
    toggleBuilderView();
    updateFormBasedOnSettings();
}

// Update form settings based on user input
function updateFormSettings() {
    formState.settings.style = document.getElementById('form-style').value;
    formState.settings.enablePages = document.getElementById('enable-pages').value === 'true';
    formState.settings.progressBarType = document.getElementById('progress-bar-type').value;
}

// Toggle visibility of builder components
function toggleBuilderView() {
    document.getElementById('layout-questions').style.display = 'none';
    document.getElementById('builder-container').style.display = 'flex';
    document.getElementById('generate-embed-code').style.display = 'block';
}

// Initialize the form builder when the DOM is loaded
document.addEventListener('DOMContentLoaded', initFormBuilder);

function updateFormBasedOnSettings() {
    console.log('Form settings updated:', formState.settings);
    
    const addPageBtn = document.getElementById('add-page-btn');
    if (formState.settings.enablePages) {
        addPageBtn.style.display = 'inline-block';
        if (document.querySelectorAll('#field-list li[data-type="page"]').length === 0) {
            addPage();
        }
    } else {
        addPageBtn.style.display = 'none';
    }
    
    // Apply form style
    document.getElementById('custom-form').className = formState.settings.style + '-style';
    
    // Update progress bar
    updateProgressBar();
    
    renderForm();
}

function updateProgressBar() {
    const formPreview = document.getElementById('custom-form');
    let progressBar = formPreview.querySelector('.progress-bar');
    
    if (formState.settings.progressBarType !== 'none' && !progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        formPreview.insertBefore(progressBar, formPreview.firstChild);
    } else if (formState.settings.progressBarType === 'none' && progressBar) {
        progressBar.remove();
    }
    
    if (progressBar) {
        updateProgressBarDisplay();
    }
}

function updateProgressBarDisplay() {
    const progressBar = document.querySelector('.progress-bar');
    if (!progressBar) return;

    const totalPages = document.querySelectorAll('#field-list li[data-type="page"]').length;
    
    if (formState.settings.progressBarType === 'percentage') {
        const percentage = (currentPage / totalPages) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${Math.round(percentage)}%`;
    } else if (formState.settings.progressBarType === 'steps') {
        progressBar.textContent = `Step ${currentPage} of ${totalPages}`;
    }
}

// Add a new page to the form
function addPage() {
    formState.pageCount++;
    const pageId = `page-${formState.pageCount}`;
    const listItem = createPageListItem(pageId);
    document.getElementById('field-list').appendChild(listItem);
    renderForm();
    formState.currentPage = formState.pageCount;
    updatePageDisplay();
}

// Create a list item for the page
function createPageListItem(pageId) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="page-header">
            <span class="page-title" contenteditable="true">Page ${formState.pageCount}</span>
            <button class="minimize-btn" onclick="togglePageMinimize('${pageId}')">-</button>
            <button class="config-btn" onclick="configPage('${pageId}')">⚙</button>
            <button class="remove-btn" onclick="removePage('${pageId}')">&times;</button>
        </div>
        <ul class="page-fields" id="${pageId}-fields"></ul>
    `;
    listItem.setAttribute('data-id', pageId);
    listItem.setAttribute('data-type', 'page');
    return listItem;
}

// Handle page click events
function handlePageClick(event) {
    const pageHeader = event.target.closest('.page-header');
    if (pageHeader) {
        const pageId = pageHeader.closest('li').getAttribute('data-id');
        const pageNumber = Array.from(document.querySelectorAll('#field-list > li[data-type="page"]'))
            .findIndex(page => page.getAttribute('data-id') === pageId) + 1;
        formState.currentPage = pageNumber;
        updatePageDisplay();
    }
}

// Update the display of pages
function updatePageDisplay() {
    document.querySelectorAll('#field-list > li[data-type="page"]').forEach((page, index) => {
        const pageId = page.getAttribute('data-id');
        const formPage = document.getElementById(`form-${pageId}`);
        if (formPage) {
            formPage.style.display = index + 1 === formState.currentPage ? 'block' : 'none';
        }
    });
    updateProgressBarDisplay();
}

// Remove a page from the form
function removePage(pageId) {
    const listItem = document.querySelector(`#field-list li[data-id="${pageId}"]`);
    if (listItem) {
        listItem.remove();
        updatePageNumbers();
        renderForm();
    }
}

// Update page numbers after removing a page
function updatePageNumbers() {
    document.querySelectorAll('#field-list li[data-type="page"]').forEach((page, index) => {
        const pageTitle = page.querySelector('.page-title');
        if (pageTitle.textContent.startsWith('Page ')) {
            pageTitle.textContent = `Page ${index + 1}`;
        }
    });
}

// Toggle page minimization
function togglePageMinimize(pageId) {
    const pageFields = document.getElementById(`${pageId}-fields`);
    const minimizeBtn = document.querySelector(`#field-list li[data-id="${pageId}"] .minimize-btn`);
    const isMinimized = pageFields.style.display === 'none';
    pageFields.style.display = isMinimized ? 'block' : 'none';
    minimize
Btn.textContent = isMinimized ? '-' : '+';
}

// Configure a page
function configPage(pageId) {
    console.log(`Configuring page: ${pageId}`);
    // Implement page configuration logic here
}

function renderForm() {
    const formPreview = document.getElementById('custom-form');
    formPreview.innerHTML = '';

    updateProgressBar();

    const pages = document.querySelectorAll('#field-list li[data-type="page"]');
    
    if (pages.length === 0) {
        // If there are no pages, render all fields directly
        const fields = document.querySelectorAll('#field-list > li');
        fields.forEach(field => {
            const fieldElement = createFieldElement(field);
            formPreview.appendChild(fieldElement);
        });
    } else {
        pages.forEach((page, pageIndex) => {
            const pageId = page.getAttribute('data-id');
            const pageTitle = page.querySelector('.page-title').textContent;
            const pageFields = Array.from(page.querySelectorAll('.page-fields li'));
            
            const pageElement = document.createElement('div');
            pageElement.className = 'form-page';
            pageElement.id = `form-${pageId}`;
            pageElement.style.display = pageIndex + 1 === currentPage ? 'block' : 'none';
            
            const pageTitleElement = document.createElement('h2');
            pageTitleElement.textContent = pageTitle;
            pageElement.appendChild(pageTitleElement);
            
            pageFields.forEach(field => {
                const fieldElement = createFieldElement(field);
                pageElement.appendChild(fieldElement);
            });
            
            formPreview.appendChild(pageElement);
        });

        addNavigationButtons(formPreview);
    }

    updatePageDisplay();
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

function addNavigationButtons(formPreview) {
    const navigationButtons = document.createElement('div');
    navigationButtons.className = 'form-navigation';

    const totalPages = document.querySelectorAll('#field-list li[data-type="page"]').length;

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => navigatePage(-1);
        navigationButtons.appendChild(prevButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => navigatePage(1);
        navigationButtons.appendChild(nextButton);
    }

    if (currentPage === totalPages || totalPages === 0) {
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        submitButton.type = 'submit';
        navigationButtons.appendChild(submitButton);
    }

    formPreview.appendChild(navigationButtons);
}

function navigatePage(direction) {
    currentPage += direction;
    renderForm();
}

// Add a new field to the form
function addField(type) {
    formState.fieldCount++;
    const field = createFieldObject(type);
    const listItem = createFieldListItem(field);
    addFieldToPage(listItem);
    selectField(field);
    toggleFieldMenu();
    initSortable();
}

// Create a field object
function createFieldObject(type) {
    return {
        id: `field-${formState.fieldCount}`,
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${formState.fieldCount}`
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

// Add the field to the appropriate page or create a new page if needed
function addFieldToPage(listItem) {
    if (formState.settings.enablePages) {
        const activePage = document.querySelector(`#field-list li[data-type="page"]:nth-child(${currentPage}) .page-fields`);
        if (activePage) {
            activePage.appendChild(listItem);
        } else {
            addPage();
            const newPage = document.querySelector('#field-list li[data-type="page"]:last-child .page-fields');
            newPage.appendChild(listItem);
        }
    } else {
        document.getElementById('field-list').appendChild(listItem);
    }
    renderForm();
}

// Configure a field
function configField(fieldId) {
    console.log(`Configuring field: ${fieldId}`);
    // Implement field configuration logic here
}

// Toggle the field menu visibility
function toggleFieldMenu() {
    document.getElementById('field-options').classList.toggle('hidden');
}

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
        default:
            return `<input type="text" id="${id}" name="${id}">`;
    }
}

function generateEmbedCode() {
    const formHtml = document.getElementById('custom-form').innerHTML;
    const embedCode = `
<div id="embedded-form-container" class="${formSettings.style}-style">
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
        const draggable = document.querySelector('.dragging');
        if (!draggable) return;

        let container;
        if (formSettings.enablePages) {
            container = e.target.closest('.page-fields') || e.target.closest('#field-list');
        } else {
            container = fieldList;
        }

        const afterElement = getDragAfterElement(container, e.clientY);
        
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
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

    const listItems = document.querySelectorAll('#field-list > li, .page-fields > li');
    listItems.forEach(item => {
        if (item.getAttribute('data-type') !== 'page') {
            item.setAttribute('draggable', 'true');
        }
    });
}
