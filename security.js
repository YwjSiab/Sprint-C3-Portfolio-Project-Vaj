// --- Part 1: Sanitize Input ---
function sanitizeInput(input) {
  try {
      const tagRemoved = input.replace(/<\/?[^>]+(>|$)/g, ""); // remove HTML tags
      return tagRemoved
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
  } catch (error) {
      console.error("Error sanitizing input:", error);
      return ""; // return safe fallback
  }
}

function generateCSRFToken() {
  try {
      const token = crypto.randomUUID();
      sessionStorage.setItem("csrfToken", token);

      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "csrfToken";
      tokenInput.value = token;

      const form = document.querySelector("form");
      if (form) {
          form.appendChild(tokenInput);
      } else {
          console.warn("⚠️ No form found to append CSRF token input.");
      }
  } catch (error) {
      console.error("Error generating CSRF token:", error);
  }
}

export { sanitizeInput, generateCSRFToken };
