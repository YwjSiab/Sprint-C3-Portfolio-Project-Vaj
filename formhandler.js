import {sanitizeInput} from './security.js';
import { Project } from './project.js';

// Part 5: Contact Form Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        try {
            event.preventDefault();
            const name = sanitizeInput(document.getElementById("name").value);
            const email = sanitizeInput(document.getElementById("email").value);
            const message = sanitizeInput(document.getElementById("message").value);
            const formError = document.getElementById('formError');
            const formSuccess = document.getElementById('formSuccess');

            const submittedToken = document.querySelector("input[name='csrfToken']")?.value;
            const storedToken = sessionStorage.getItem("csrfToken");
            

            if (!name || !email || !message) {
                document.getElementById("formError").innerText = "Please fill out all fields.";
                return;
            }

            if (!submittedToken || submittedToken !== storedToken) {
                alert("CSRF token mismatch. Submission blocked.");
                return;
            }
            
            // Sprint A4 part 2
            // Function to show error and clear success message
            const showError = (errorMsg) => {
                if (formError) {formError.innerText = errorMsg;}
                if (formSuccess) {formSuccess.innerText = '';} // Clear success message
            };

            const sqlPattern = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|--)\b/i;

            if (sqlPattern.test(name) || sqlPattern.test(message)) {
            showError("SQL keywords are not allowed in title or message.", formError, formSuccess);
            return;
            }

            // Validate name making sure it only takes letters and spaces.
            const nameRegex = /^[A-Za-z\s]+$/;
            if (!name || !nameRegex.test(name)) {
                console.error('Error: Name must contain only letters and spaces.');
                showError('Name can only contain letters and spaces.'); // Sprint B1 part 3: Form Validation with error messaging
                return;
            }

            // Validate email only allowing names, numbers, period and the @ sign.
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                console.error('Error: Invalid email format');
                showError('Please enter a valid email address.'); // Sprint B1 part 3: Form Validation with error messaging
                return;
            }

            // Validate message making sure it is longer than 10 characters long.
            if (!message || message.length < 10) {
                console.error('Error: Message must be at least 10 characters.'); 
                showError('Message must be at least 10 characters long.'); // Sprint B1 part 3: Form Validation with error messaging
                return;
            }

            // Clear error message if all validations pass
            if (formError) {formError.innerText = '';}
            
            // ⏱️ Rate Limiting: Block repeated submissions within 30 seconds
            const lastSubmit = sessionStorage.getItem('lastContactSubmit');
            const now = Date.now();
            if (lastSubmit && now - lastSubmit < 30000) {
                console.warn('You must wait before submitting again.');
                document.getElementById('formError').innerText = 'Please wait before submitting again.';
                return;
            }

            sessionStorage.setItem('lastContactSubmit', now.toString());

            console.log('Form submitted successfully:', { name, email, message });

            if (formSuccess){formSuccess.innerText = 'Your message has been sent!';}
            contactForm.reset();
        } catch (error) {
            console.error('Error handling contact form submission:', error);
        }
    });
} else {
    console.warn("No 'contactForm' found on this page. Skipping form event listener.");
}

// Sprint B1 Part 2: Create user friendly error and success messages
function showError(msg, errorElement, successElement) {
    try {
        if (errorElement) {
            errorElement.innerText = msg;
            errorElement.style.display = 'block';
        }
        if (successElement) {
            successElement.style.display = 'none';
        }
        console.error(`Error: ${msg}`);
    } catch (err) {
        console.error("showError failed:", err);
    }
}

function clearError(errorElement) {
    try {
        if (errorElement) {
            errorElement.innerText = '';
            errorElement.style.display = 'none';
        }
    } catch (err) {
        console.error("clearError failed:", err);
    }
}

function showSuccess(msg, successElement) {
    try {
        if (successElement) {
            successElement.innerText = msg;
            successElement.style.display = 'block';
            console.log(`Success: ${msg}`);

            setTimeout(() => {
                try {
                    successElement.style.display = 'none';
                } catch (timeoutErr) {
                    console.error("Error hiding success message:", timeoutErr);
                }
            }, 3000);
        }
    } catch (err) {
        console.error("showSuccess failed:", err);
    }
}

// Sprint A4 Part 3
/**
 * Utility function to create a label element.
 * @param {string} forId - The ID of the input the label is for.
 * @param {string} text - The text for the label.
 * @returns {HTMLElement} - The created label element.
 */
function createLabel(forId, text) {
    const label = document.createElement('label');
    label.setAttribute('for', forId);
    label.textContent = text;
    return label;
}

/**
 * Utility function to create an input field.
 * @param {string} type - The input type (e.g., text, email, file).
 * @param {string} id - The ID of the input.
 * @param {boolean} required - Whether the field is required.
 * @param {string} placeholder - Placeholder text (optional).
 * @param {string} accept - Accepted file types (optional for file input).
 * @returns {HTMLElement} - The created input element.
 */
function createInput(type, id, required = false, placeholder = '', accept = '') {
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    if (required) {input.required = true;}
    if (placeholder) {input.placeholder = placeholder;}
    if (accept) {input.accept = accept;}
    return input;
}

/**
 * Utility function to create an input field group with a label.
 * @param {string} id - The ID of the input field.
 * @param {string} labelText - The text for the label.
 * @param {string} type - The input type (default: text).
 * @param {string} placeholder - The placeholder text (optional).
 * @returns {HTMLElement} - A div container holding the label and input.
 */
function createInputGroup(id, labelText, type = 'text', placeholder = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-group';
    wrapper.appendChild(createLabel(id, labelText));
    wrapper.appendChild(createInput(type, id, true, placeholder));
    return wrapper;
}

const handleFormSubmission = async (event) => {
    try {
        event.preventDefault();

        const formError = document.getElementById('formError');
        const formSuccess = document.getElementById('formSuccess');

        const title = document.getElementById('title')?.value.trim();
        const category = document.getElementById('category')?.value;
        let description = document.getElementById('description')?.value.trim();
        let technologies = document.getElementById('technologies')?.value.trim();
        const projectLink = document.getElementById('projectLink')?.value.trim();
        const projectImage = document.getElementById('projectImage')?.files[0];

        technologies = technologies ? technologies.split(',').map(tech => tech.trim()) : [];

        try {
            if (!title || !description || !technologies.length || !projectLink) {
                showError("All fields are required!", formError, formSuccess);
                return;
            }

            const sqlPattern = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|TRUNCATE|--)\b/i;
            if (sqlPattern.test(title) || sqlPattern.test(description)) {
                showError("SQL keywords are not allowed in title or description.", formError, formSuccess);
                return;
            }

            if (!description || description.length < 10) {
                showError("Project description must be at least 10 characters long!", formError, formSuccess);
                return;
            }

            const urlRegex = /^(https?:\/\/)?([\w\d\-_]+\.+[A-Za-z]{2,})+\/?/;
            if (!urlRegex.test(projectLink)) {
                showError("Enter a valid project URL!", formError, formSuccess);
                return;
            }
        } catch (validationError) {
            console.error("Validation error:", validationError);
            showError("An error occurred during validation.", formError, formSuccess);
            return;
        }

        // ✅ Add these debugging logs before creating the project object
        console.log("Attempting to add new project...");
        console.log("Title:", title);
        console.log("Category:", category);
        console.log("Description:", description);
        console.log("Technologies Used:", technologies);
        console.log("Project Link:", projectLink);
        console.log("Image File:", projectImage ? projectImage.name : "No Image Uploaded");

        let imageURL = "";
        try {
            if (projectImage) {
                const validImageTypes = ["image/png", "image/jpeg"];
                if (!validImageTypes.includes(projectImage.type)) {
                    showError("Only PNG and JPEG images are allowed!", formError, formSuccess);
                    return;
                }
                imageURL = URL.createObjectURL(projectImage);
            }
        } catch (fileError) {
            console.error("Error handling image file:", fileError);
            showError("Error processing image upload.", formError, formSuccess);
            return;
        }
        try {
            clearError(formError);
        const newProject = new Project(
            (window.allProjects?.length || 0) + 1,
            title,
            description,
            technologies,
            category,
            imageURL
        );
        
        if (Array.isArray(window.allProjects)) {
            window.allProjects.push(newProject);
        }
            
            try {
                let storedProjects = localStorage.getItem("projects");
                let projectArray = storedProjects ? JSON.parse(storedProjects) : [];

                projectArray.push(newProject);
                localStorage.setItem("projects", JSON.stringify(projectArray));

                console.log('✅ Project saved to localStorage.');
            } catch (storageError) {
                console.error("❌ Failed to save project to localStorage:", storageError);
                showError("An error occurred while saving your project locally. Please try again.", formError, formSuccess);
            }

            const filterDropdown = document.getElementById('filterDropdown');
            const selectedCategory = filterDropdown ? filterDropdown.value : 'All';

            if (typeof window.filterProjects === "function") {
                window.filterProjects(selectedCategory);
            }

            showSuccess("Project added successfully!", formSuccess);
            document.getElementById('projectForm').reset();
            console.log("Project successfully added:", newProject);
        } catch (addError) {
            console.error("Error creating or displaying project:", addError);
            showError("An error occurred while adding the project.", formError, formSuccess);
        }
    } catch (outerError) {
        console.error("Unexpected error in form submission:", outerError);
        showError("Unexpected error occurred. Please try again.", document.getElementById('formError'), document.getElementById('formSuccess'));
    }
};


// Sprint A4 Part 3
const addProjectForm = () => {
    try {
        const formContainer = document.getElementById('projectSubmission');
        if (!formContainer) {
            console.warn("⚠️ No 'projectSubmission' container found. Skipping form creation.");
            return;
        }

        if (document.getElementById('projectForm')) {
            console.warn("Project form already exists. Skipping form creation.");
            return;
        }

        const form = document.createElement('form');
        form.id = 'projectForm';

        try {
            form.appendChild(createLabel('title', 'Project Title:'));
            form.appendChild(createInput('text', 'title', true));

            form.appendChild(createLabel('description', 'Project Description:'));
            const descriptionInput = document.createElement('textarea');
            descriptionInput.id = 'description';
            descriptionInput.required = true;
            form.appendChild(descriptionInput);

            const flexContainer = document.createElement('div');
            flexContainer.className = 'form-flex-container';

            const categoryWrapper = document.createElement('div');
            categoryWrapper.className = 'input-group';
            categoryWrapper.appendChild(createLabel('category', 'Project Category:'));

            const categorySelect = document.createElement('select');
            categorySelect.id = 'category';
            categorySelect.required = true;

            const categories = ["Web Development", "UI/UX Design", "Responsive Design"];
            categories.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat;
                option.textContent = cat;
                categorySelect.appendChild(option);
            });

            categoryWrapper.appendChild(categorySelect);
            flexContainer.appendChild(categoryWrapper);
            flexContainer.appendChild(createInputGroup('technologies', 'Technologies Used (comma-separated):'));
            flexContainer.appendChild(createInputGroup('projectLink', 'Project Link:', 'url', 'https://example.com'));
            form.appendChild(flexContainer);

            const fileContainer = document.createElement('div');
            fileContainer.className = 'file-upload-container';
            fileContainer.appendChild(createLabel('projectImage', 'Upload Image:'));
            fileContainer.appendChild(createInput('file', 'projectImage', false, '', 'image/png, image/jpeg'));
            form.appendChild(fileContainer);

            const submitButton = document.createElement('button');
            submitButton.type = 'submit';
            submitButton.textContent = 'Add Project';
            form.appendChild(submitButton);

            formContainer.appendChild(form);

            form.addEventListener('submit', handleFormSubmission);

        } catch (innerErr) {
            console.error("Error building form elements:", innerErr);
            formContainer.innerText = "An error occurred while building the form.";
        }

    } catch (error) {
        console.error('Error creating project submission form:', error);
    }
};

export {addProjectForm};