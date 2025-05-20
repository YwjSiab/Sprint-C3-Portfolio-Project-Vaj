class Project {
  #viewCount = 0;

  constructor(id, title, description, techStack = [], category = "Uncategorized", image = "default-placeholder.jpg") {
      try {
          if (!id || !title || !description || !Array.isArray(techStack)) {
              throw new Error("Invalid project data: All fields must be provided and techStack must be an array.");
          }

          this.id = id;
          this.title = title;
          this.description = description;
          this.techStack = techStack;
          this.category = category;
          this.image = image || "images/default-placeholder.jpg";
      } catch (err) {
          console.error("Error creating project:", err);
      }
  }

  incrementViews() {
      try {
          this.#viewCount++;
      } catch (err) {
          console.error("Error incrementing view count:", err);
      }
  }

  getViews() {
      try {
          return this.#viewCount;
      } catch (err) {
          console.error("Error retrieving view count:", err);
          return 0;
      }
  }

  usesTechnology(tech) {
      try {
          if (!tech || typeof tech !== "string") {
              console.warn("⚠️ Invalid technology input.");
              return false;
          }
          return this.techStack.includes(tech);
      } catch (err) {
          console.error("Error checking technology:", err);
          return false;
      }
  }

  static createViewTracker() {
    let tracker;
    try {
        let views = 0;
        tracker = {
            increment: () => ++views,
            getViews: () => views
        };
    } catch (err) {
        console.error("Error creating view tracker:", err);
        tracker = {
            increment: () => {},
            getViews: () => 0
        };
    }
    return tracker;
  }
} 
  
  // Part 3: Testing and Validation
  console.log("JavaScript functionality is running as expected. Check the console for output.");

// Sprint A3 Part 2: Dynamic Project Display
export function displayProjects(projectArray) {
  try {
    const container = document.getElementById("projectList");
    if (!container) {
        console.warn("Project container not found. Skipping projects init.");
        return;
    }

    function escapeHTML(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    projectArray.forEach((project) => {
        try {
            if (!(project instanceof Project)) {
                throw new Error("Invalid project object.");
            }

            const card = document.createElement("div");
            card.classList.add("project-card");

            const title = document.createElement("h3");
            title.textContent = project.title;

            const image = document.createElement("img");
            image.src = project.image;
            image.alt = `${project.title} image`;
            image.className = "project-image";

            const description = document.createElement("p");
            description.textContent = project.description;

            const tech = document.createElement("p");
            tech.innerHTML = `<strong>Technologies:</strong> ${project.techStack.map(t => escapeHTML(t)).join(", ")}`;

            card.appendChild(title);
            card.appendChild(description);
            card.appendChild(tech);
            card.appendChild(image);
            container.appendChild(card);
        } catch (err) {
            console.error("Error displaying a project:", err);
        }
    });
    } catch (err) {
      console.error("Error displaying projects:", err);
    }
}


// ✅ Function to load project details dynamically
// This function retrieves and displays the details of a selected project
window.loadProjectDetails = (projectId) => {
  try {
    console.log(`Attempting to load details for project ID: ${projectId}`);
    const project = (window.allProjects || []).find(p => p.id === Number(projectId));

    const detailsContainer = document.getElementById('projectDetails');
    if (!detailsContainer) {
        console.error('Error: Project details container not found');
        return;
    }

    if (!project) {
        console.error(`Error: Project with ID ${projectId} not found`);
        detailsContainer.textContent = 'Project not found. Please select a valid project.';
        detailsContainer.classList.add('error-message');
        return;
    }

    if (typeof project.incrementViews === "function") {
        project.incrementViews();
        console.log(`👁️ Views for "${project.title}": ${project.getViews()}`);
    }

    while (detailsContainer.firstChild) {
        detailsContainer.removeChild(detailsContainer.firstChild);
    }

    const titleElement = document.createElement('h2');
    titleElement.innerText = project.title;
    detailsContainer.appendChild(titleElement);

    const categoryElement = document.createElement('p');
    categoryElement.innerText = `Category: ${project.category}`;
    detailsContainer.appendChild(categoryElement);

    const imageElement = document.createElement('img');
    imageElement.src = project.image;
    imageElement.alt = project.title;
    imageElement.className = 'project-detail-image';
    detailsContainer.appendChild(imageElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.innerText = project.description;
    detailsContainer.appendChild(descriptionElement);

    const techElement = document.createElement('p');
    techElement.innerText = `Technologies Used: ${project.techStack.join(', ')}`;
    detailsContainer.appendChild(techElement);

    console.log(`Project details updated for: ${project.title}`);
} catch (err) {
    console.error("Error loading project details:", err);
    const detailsContainer = document.getElementById('projectDetails');
    if (detailsContainer) {
        detailsContainer.innerText = 'An error occurred while loading project details.';
        detailsContainer.classList.add('error-message');
    }
}
};

// ✅ Function to display filtered projects dynamically
const displayFilteredProjects = (filteredProjects) => {
  try {
    const projectContainer = document.getElementById('projectContainer');
    if (!projectContainer) {
        console.warn("Warning: Project container not found. Skipping projects init.");
        return;
    }

    projectContainer.textContent = '';
    filteredProjects.forEach(project => {
        try {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';

            const titleElement = document.createElement('h3');
            titleElement.textContent = project.title;
            projectCard.appendChild(titleElement);

            const categoryElement = document.createElement('p');
            categoryElement.textContent = `Category: ${project.category}`;
            projectCard.appendChild(categoryElement);

            const imageElement = document.createElement('img');
            imageElement.src = project.image;
            imageElement.alt = project.title;
            imageElement.className = 'project-image';
            projectCard.appendChild(imageElement);

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = project.description;
            projectCard.appendChild(descriptionElement);

            const techElement = document.createElement('p');
            techElement.textContent = `Technologies: ${project.techStack.join(', ')}`;
            projectCard.appendChild(techElement);

            const detailsButton = document.createElement('button');
            detailsButton.textContent = 'View Details';
            detailsButton.addEventListener('click', () => window.loadProjectDetails(project.id));
            projectCard.appendChild(detailsButton);

            projectContainer.appendChild(projectCard);
        } catch (err) {
            console.error("Error creating filtered project card:", err);
        }
    });
} catch (err) {
    console.error('Error displaying filtered projects:', err);
}
};

export { Project, displayFilteredProjects };
