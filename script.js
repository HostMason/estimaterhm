let fieldCount = 0;
let pageCount = 0;
let selectedField = null;

let formSettings = {
    style: 'basic',
    enablePages: false,
    progressBarType: 'none'
};

let currentPage = 1;

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('field-list').addEventListener('click', handlePageClick);
    const startBuildingBtn = document.getElementById('start-building');
    const layoutQuestions = document.getElementById('layout-questions');
    const builderContainer = document.getElementById('builder-container');
    const generateEmbedCodeBtn = document.getElementById('generate-embed-code');
    const embedCode = document.getElementById('embed-code');

    startBuildingBtn.addEventListener('click', function() {
        formSettings.style = document.getElementById('form-style').value;
        formSettings.enablePages = document.getElementById('enable-pages').value === 'true';
        formSettings.progressBarType = document.getElementById('progress-bar-type').value;
        
        layoutQuestions.style.display = 'none';
        builderContainer.style.display = 'flex';
        generateEmbedCodeBtn.style.display = 'block';
        
        updateFormBasedOnSettings();
    });

    document.getElementById('add-field-btn').addEventListener('click', toggleFieldMenu);
    document.getElementById('add-page-btn').addEventListener('click', addPage);
    generateEmbedCodeBtn.addEventListener('click', generateEmbedCode);

    initSortable();
});

function updateFormBasedOnSettings() {
    console.log('Form settings updated:', formSettings);
    
    const addPageBtn = document.getElementById('add-page-btn');
    if (formSettings.enablePages) {
        addPageBtn.style.display = 'inline-block';
        if (document.querySelectorAll('#field-list li[data-type="page"]').length === 0) {
            addPage();
        }
    } else {
        addPageBtn.style.display = 'none';
    }
    
    // Apply form style
    document.getElementById('custom-form').className = formSettings.style + '-style';
    
    // Update progress bar
    updateProgressBar();
    
    renderForm();
}

function updateProgressBar() {
    const formPreview = document.getElementById('custom-form');
    let progressBar = formPreview.querySelector('.progress-bar');
    
    if (formSettings.progressBarType !== 'none' && !progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        formPreview.insertBefore(progressBar, formPreview.firstChild);
    } else if (formSettings.progressBarType === 'none' && progressBar) {
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
    
    if (formSettings.progressBarType === 'percentage') {
        const percentage = (currentPage / totalPages) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${Math.round(percentage)}%`;
    } else if (formSettings.progressBarType === 'steps') {
        progressBar.textContent = `Step ${currentPage} of ${totalPages}`;
    }
}

function addPage() {
    pageCount++;
    const pageId = `page-${pageCount}`;
    const listItem = document.createElement('li');
    listItem.innerHTML = `
        <div class="page-header">
            <span class="page-title" contenteditable="true">Page ${pageCount}</span>
            <button class="minimize-btn" onclick="togglePageMinimize('${pageId}')">-</button>
            <button class="config-btn" onclick="configPage('${pageId}')">⚙</button>
            <button class="remove-btn" onclick="removePage('${pageId}')">&times;</button>
        </div>
        <ul class="page-fields" id="${pageId}-fields"></ul>
    `;
    listItem.setAttribute('data-id', pageId);
    listItem.setAttribute('data-type', 'page');
    document.getElementById('field-list').appendChild(listItem);
    renderForm();
    currentPage = pageCount;
    updatePageDisplay();
}

function handlePageClick(event) {
    const pageHeader = event.target.closest('.page-header');
    if (pageHeader) {
        const pageId = pageHeader.closest('li').getAttribute('data-id');
        const pageNumber = Array.from(document.querySelectorAll('#field-list > li[data-type="page"]')).findIndex(page => page.getAttribute('data-id') === pageId) + 1;
        currentPage = pageNumber;
        updatePageDisplay();
    }
}

function updatePageDisplay() {
    const pages = document.querySelectorAll('#field-list > li[data-type="page"]');
    pages.forEach((page, index) => {
        const pageId = page.getAttribute('data-id');
        const formPage = document.getElementById(`form-${pageId}`);
        if (formPage) {
            formPage.style.display = index + 1 === currentPage ? 'block' : 'none';
        }
    });
    updateProgressBarDisplay();
}

function removePage(pageId) {
    const listItem = document.querySelector(`#field-list li[data-id="${pageId}"]`);
    if (listItem) {
        listItem.remove();
        updatePageNumbers();
        renderForm();
    }
}

function updatePageNumbers() {
    const pages = document.querySelectorAll('#field-list li[data-type="page"]');
    pages.forEach((page, index) => {
        const pageTitle = page.querySelector('.page-title');
        if (pageTitle.textContent.startsWith('Page ')) {
            pageTitle.textContent = `Page ${index + 1}`;
        }
    });
}

function togglePageMinimize(pageId) {
    const pageFields = document.getElementById(`${pageId}-fields`);
    const minimizeBtn = document.querySelector(`#field-list li[data-id="${pageId}"] .minimize-btn`);
    if (pageFields.style.display === 'none') {
        pageFields.style.display = 'block';
        minimizeBtn.textContent = '-';
    } else {
        pageFields.style.display = 'none';
        minimizeBtn.textContent = '+';
    }
}

function configPage(pageId) {
    // Implement page configuration logic here
    console.log(`Configuring page: ${pageId}`);
}

function renderForm() {
    const formPreview = document.getElementById('custom-form');
    formPreview.innerHTML = '';

    updateProgressBar();

    const pages = document.querySelectorAll('#field-list li[data-type="page"]');
    
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

    if (currentPage === totalPages) {
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

function addField(type) {
    fieldCount++;
    const field = {
        id: `field-${fieldCount}`,
        type: type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${fieldCount}`
    };

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

    const activePage = document.querySelector('#field-list li[data-type="page"] .page-fields');
    if (activePage) {
        activePage.appendChild(listItem);
    } else if (formSettings.enablePages) {
        // If pages are enabled but no page exists, create a new page
        addPage();
        const newPage = document.querySelector('#field-list li[data-type="page"] .page-fields');
        newPage.appendChild(listItem);
    } else {
        document.getElementById('field-list').appendChild(listItem);
    }

    selectField(field);
    toggleFieldMenu();
    initSortable();
}

function configField(fieldId) {
    // Implement field configuration logic here
    console.log(`Configuring field: ${fieldId}`);
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
