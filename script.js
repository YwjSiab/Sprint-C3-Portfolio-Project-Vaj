import { displayFilteredProjects } from './project.js';
import { addProjectForm } from './formhandler.js';
import { generateCSRFToken } from './security.js';
import { Project } from './project.js';

let allProjects = [];
window.allProjects = allProjects;
function filterProjects(category) {
  try {
        console.log("Filtering by:", category);
        const filtered = category === 'All'
        ? allProjects
        : allProjects.filter(p =>
        p.category.trim().toLowerCase() === category.trim().toLowerCase()
      );
      displayFilteredProjects(filtered);
  } catch (error) {
      console.error('Error filtering projects:', error);
  }
}

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      console.log(`📍 User location: ${pos.coords.latitude}, ${pos.coords.longitude}`);
    },
    (err) => {
      console.warn("Geolocation error:", err.message);
    }
  );
}

window.filterProjects = filterProjects;
// Sprint A3 Part 1: Ensure DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', async () => {
    try {
      console.log('🚀 Portfolio Project Loaded');

      generateCSRFToken();
      addProjectForm();

      // 📢 Check if the Notification API is supported by the browser
      if ("Notification" in window) {
        // Request permission from the user to send notifications
        Notification.requestPermission().then((permission) => {
          // If permission is granted, display a welcome notification
          if (permission === "granted") {
            new Notification("✅ Portfolio Ready", {
              body: "You can now use this app offline!", // Message shown in the notification body
              icon: "/Sprint-C3-Portfolio-Project-Vaj/icon-192.png" // App icon for the notification
            });
          }
        });
      }

      
      try {
        const stored = localStorage.getItem("projects");
        if (stored) {
          const rawStored = JSON.parse(stored);
          const convertedStored = rawStored.map(p =>
          new Project(p.id, p.title, p.description, p.techStack, p.category, p.image)
          );
          allProjects.splice(0, allProjects.length, ...convertedStored);

          console.log("✅ Loaded projects from localStorage.");
        }
      } catch (error) {
        console.error("⚠️ Error loading projects from localStorage:", error);
      }
    
      // 📦 Sprint B3: Dynamic data loaded from JSON using fetch()
      const response = await fetch('projects.json');
        if (!response.ok) {
          throw new Error('Failed to fetch project data.');
        }  
      const raw = await response.json();
      const converted = raw.map(p =>
      new Project(p.id, p.title, p.description, p.techStack, p.category, p.image)
      );
      allProjects.splice(0, allProjects.length, ...converted);
      console.log("Projects:");
      allProjects.forEach((project) => {
        try {
          console.log(`ID: ${project.id}`);
          console.log(`Title: ${project.title}`);
          console.log(`Category: ${project.category}`);
          console.log(`Description: ${project.description}`);
          console.log(`Technologies Used: ${project.techStack.join(", ")}`);
          console.log(`Image: ${project.image}`);
          console.log("--------------------");
        } catch (err) {
          console.error("Error logging project info:", err);
        }
      });
      displayFilteredProjects(allProjects);
      // Enable touch interaction feedback for mobile users
      document.querySelectorAll('.project-card').forEach((card) => {
        // Add a visual highlight on touchstart
        card.addEventListener('touchstart', () => {
          card.classList.add('touched'); // Add styling class (e.g., outline)
    
          // Trigger a short vibration if supported (improves tactile UX)
          navigator.vibrate?.(50);
        });
      });

      localStorage.setItem("projects", JSON.stringify(allProjects));
  
      const dropdown = document.getElementById('filterDropdown');
      if (dropdown) {
        dropdown.addEventListener('change', (e) => filterProjects(e.target.value));
        filterProjects(dropdown.value);
      } else {
        console.warn('⚠️ Dropdown not found – skipping filterProjects init.');
      }

      // ✅ Register the service worker to enable offline support
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/Sprint-C3-Portfolio-Project-Vaj/serviceworker.js")
        .then(() => console.log("✅ Service Worker registered")) // Success message
        .catch((err) => console.error("❌ SW registration failed:", err)); // Log registration failure
      }

      // 🛠️ Listen for the PWA installation event
      let deferredPrompt;
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault(); // Prevent the default mini-infobar from appearing
        deferredPrompt = e; // Save the event for manual triggering

          // 📌 Find the install button (if it exists on this page)
          const installBtn = document.querySelector("#installBtn");

        // ✅ Only proceed if the button is actually present
        if (installBtn) {
          // Make the install button visible
          installBtn.style.display = "block";

          // When the button is clicked, show the install prompt
          installBtn.addEventListener("click", () => {
            deferredPrompt.prompt();
          });
        }
      });



} catch (error) {
    console.error('Error during page initialization:', error);
}
});
