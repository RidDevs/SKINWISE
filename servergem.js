const express = require('express');
const { VertexAI } = require('@google-cloud/aiplatform');

const app = express();
app.use(express.json()); // Important: This enables parsing JSON request bodies

// Replace with your actual project ID and location
const PROJECT_ID = 'your-project-id';
const LOCATION = 'us-central1'; // Or your preferred location
const MODEL_NAME = 'gemini-pro'; // Or the specific Gemini model you're using

const vertexAI = new VertexAI({ projectId: PROJECT_ID, location: LOCATION });
const model = vertexAI.model(MODEL_NAME);


// Your API key should *never* be in the frontend. It is automatically handled by the Vertex AI library
// when you initialize the Vertex AI client with your project ID.

app.post('/api/gemini', async (req, res) => {
  const { prompt } = req.body; // Get the prompt from the request body

  if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const [response] = await model.generateText({
      prompt: prompt,
    });

    res.json({ output: response.candidates[0].output }); // Send the response back to the frontend
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'Error fetching response' });
  }
});

const PORT = process.env.PORT || 3000; // Use environment variable or 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});