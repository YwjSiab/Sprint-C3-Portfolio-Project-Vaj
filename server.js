// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const fs = require('fs');

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve project data via GET route
app.get('/api/projects', (req, res) => {
  const filePath = path.join(__dirname, 'projects.json');
  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    return res.status(404).json({ error: 'Project data not found' });
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("❌ Failed to read projects.json:", err);
      return res.status(500).json({ error: 'Could not load project data' });
    }
    try {
      const parsed = JSON.parse(data);
      res.json(parsed);
    } catch (parseErr) {
      console.error("❌ Invalid JSON in projects.json:", parseErr);
      res.status(500).json({ error: 'Malformed JSON in project data' });
    }
  });
});

// POST route to receive project data
app.post('/api/projects', (req, res) => {
  try {
    const project = req.body;

    // Basic server-side validation
    if (
      !project.title ||
      typeof project.title !== 'string' ||
      project.title.trim().length === 0
    ) {
      return res.status(400).json({ error: 'Invalid project title' });
    }

    if (
      !project.description ||
      typeof project.description !== 'string' ||
      project.description.trim().length < 10
    ) {
      return res.status(400).json({ error: 'Description must be at least 10 characters' });
    }

    if (
      !Array.isArray(project.techStack) ||
      project.techStack.length === 0 ||
      !project.techStack.every(t => typeof t === 'string')
    ) {
      return res.status(400).json({ error: 'Invalid tech stack format' });
    }

    console.log("✅ New project received:");
    console.log(project);

    // In a real app, you'd save this to a file or database here

    res.status(200).json({ message: 'Project saved successfully' });
  } catch (err) {
    console.error('❌ Error in /api/projects:', err);
    res.status(500).json({ error: 'Internal server error in POST /api/projects' });
  }
});

// Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Global error handler
app.use((err, req, res) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
