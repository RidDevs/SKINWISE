require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent";

app.post("/ask", async (req, res) => {
    try {
        const { message } = req.body;
        const response = await axios.post(`${GEMINI_URL}?key=${API_KEY}`, {
            contents: [{ role: "user", parts: [{ text: message }] }],
        });

        res.json({ reply: response.data.candidates[0].content.parts[0].text });
    } catch (error) {
        res.status(500).json({ error: "Error connecting to Gemini API" });
    }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
