require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

// Check if API key exists
if (!API_KEY) {
    console.error("❌ Missing GEMINI_API_KEY in .env file");
    process.exit(1);
}

// API Route
app.post("/api/gemini", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const response = await axios.post(`${GEMINI_URL}?key=${API_KEY}`, {
            contents: [{ role: "user", parts: [{ text: message }] }],
        });

        // Ensure response structure is correct
        const reply =
            response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure how to respond.";

        res.json({ reply });
    } catch (error) {
        console.error("❌ Gemini API Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Error connecting to Gemini API" });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
