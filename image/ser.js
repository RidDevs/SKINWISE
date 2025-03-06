import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 3000;
const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY is missing in .env file.");
    process.exit(1);
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// ✅ Configure Multer for in-memory storage (no temp file creation)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(express.json());

// ✅ CORS setup for GitHub Pages
app.use(cors());
app.use(cors({
  origin: ["https://riddevs.github.io/SKIN-APP/chatnew.html"], // Replace with your actual GitHub Pages URL
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));


// ✅ Image Analysis Route
app.post("/analyze-image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" });
        }

        // ✅ Convert image buffer to Base64
        const imageBase64 = req.file.buffer.toString("base64");

        // ✅ Send image to Gemini API for analysis
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
            { text: "Analyze this image and detect any skin disease." },
            { inline_data: { mime_type: req.file.mimetype, data: imageBase64 } },
        ]);

        const response = await result.response;
        const text = response.text();

        res.json({ analysis: text });
    } catch (error) {
        console.error("❌ Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// ✅ Start the Server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
