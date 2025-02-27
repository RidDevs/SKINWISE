require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Gemini API Setup
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ API key is missing. Set GEMINI_API_KEY in .env");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" }); // Or your preferred model

// Chatbot API Route
app.post("/chat", async (req, res) => {
  const { message, userId } = req.body; // Assuming userId is sent from client

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    res.json({ output: text });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});