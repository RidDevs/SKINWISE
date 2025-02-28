import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;
const API_KEY = process.env.OPENAI_API_KEY;

// Multer setup for file upload
const upload = multer({ dest: "uploads/" });

// API endpoint to process image
app.post("/analyze-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        // Read the image file and convert to Base64
        const imagePath = req.file.path;
        const imageBase64 = fs.readFileSync(imagePath, { encoding: "base64" });

        // OpenAI Vision API Request
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4-vision-preview",
                messages: [
                    { role: "system", content: "You are an AI that analyzes skin diseases." },
                    { role: "user", content: "What do you see in this image?", 
                      content_type: "image/jpeg", 
                      image: `data:image/jpeg;base64,${imageBase64}` }
                ],
                max_tokens: 300
            })
        });

        const data = await response.json();
        res.json({ analysis: data.choices[0].message.content });

        // Delete uploaded image after processing
        fs.unlinkSync(imagePath);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
