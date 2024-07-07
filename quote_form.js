// Global variables
let currentTab = 0;
let currentArea = 0;
let currentShape = "rectangular";
let currentQuestion = 0;

// Initialize the form
function initForm() {
    const scriptTag = document.getElementById("quoteForm");
    const appUrl = scriptTag.src.replace("/quote_form.js", "");

    // Add necessary styles and scripts
    addStyles(appUrl);
    addScripts();

    // Load jQuery if not present
    if (!window.jQuery) {
        loadJQuery();
    } else {
        loadForm();
    }
}

// Add necessary styles
function addStyles(appUrl) {
    const link = document.createElement('link');
    link.href = appUrl + "/styles.css";
    link.rel = "stylesheet";
    link.type = "text/css";
    document.head.appendChild(link);
}

// Add necessary scripts
function addScripts() {
    const script = document.createElement('script');
    script.src = "https://kit.fontawesome.com/5e599d88cd.js";
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
}

// Load jQuery
function loadJQuery() {
    const script = document.createElement('script');
    script.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js";
    script.onload = loadForm;
    document.head.appendChild(script);
}

// Load the form
function loadForm() {
    const id = document.getElementById("quoteForm").getAttribute("data-id");
    $.ajax({
        url: `${appUrl}/quotes/${id}/form.json`,
        dataType: "json",
        type: "get",
        success: function(data) {
            appendToPage(data);
        }
    });
}

// Append form to page
function appendToPage(data) {
    const container = document.createElement('div');
    container.innerHTML = data.html;
    document.getElementById("quoteForm").parentElement.appendChild(container);
    showQuoteQuestion(currentQuestion);
    setupFormSubmission();
}

// Show current question
function showQuoteQuestion(n) {
    const questions = document.getElementsByClassName("quote_questions");
    if (n > 0) {
        questions[n-1].style.display = "none";
    }
    if (questions.length > n) {
        questions[n].style.display = "block";
    } else {
        showProjectArea(currentArea);
        showTab(currentTab);
    }
}

// Show current project area
function showProjectArea(n) {
    const areas = document.getElementsByClassName("nested_quote_project_areas");
    areas[n].style.display = "block";
}

// Show current tab
function showTab(n) {
    const areas = document.getElementsByClassName("nested_quote_project_areas");
    const tabs = areas[currentArea].getElementsByClassName("tab");
    tabs[n].style.display = "block";
}

// Setup form submission
function setupFormSubmission() {
    document.getElementById("submitButton").addEventListener("click", function(e) {
        e.preventDefault();
        if (validateForm()) {
            submitForm();
        }
    });
}

// Validate form
function validateForm() {
    // Add form validation logic here
    return true;
}

// Submit form
function submitForm() {
    const form = document.getElementById("new_quote");
    const formData = new FormData(form);
    $.ajax({
        type: "POST",
        data: formData,
        dataType: "json",
        url: `${appUrl}/quotes.json`,
        processData: false,
        contentType: false,
        success: function(data) {
            if (data.url) {
                window.location = data.url;
            } else {
                document.getElementById("new_quote").parentElement.innerHTML = data.html;
            }
        }
    });
}

// Initialize the form when the script loads
initForm();
