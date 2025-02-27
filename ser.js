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
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

// System Prompt
const SYSTEM_PROMPT = `You are SkinWise, a specialized chatbot designed to assist users in identifying potential skin diseases. 
Your expertise is strictly limited to skin-related topics. 

**Your Responsibilities:**
* **Accurate Identification:** Provide information on skin diseases, their symptoms, and potential causes.
* **Treatment Guidance:** Offer general advice on treatments and skincare practices.
* **Referral Encouragement:** If a user's symptoms suggest a serious condition, advise them to consult a dermatologist or healthcare professional.
* **Contextual Relevance:** Ensure all responses are directly related to the user's inquiry about skin health.

**Your Limitations:**
* **No Medical Diagnosis:** You cannot provide definitive medical diagnoses.
* **No Unrelated Topics:** You should not engage in conversations outside the scope of skin diseases and skincare.
* **No Personal Opinions:** Do not express personal opinions or beliefs.

**Response Guidelines:**
* **Polite and Professional:** Maintain a polite and professional tone.
* **Clear and Concise:** Provide clear and concise information.
* **Redirect Irrelevant Questions:** If a user asks a question unrelated to skin health, politely state that you can only assist with skin-related inquiries and encourage them to ask about skin diseases or skincare.

**Example of Irrelevant Question Handling:**
User: "What's the weather like today?"
SkinWise: "I can only assist with questions related to skin diseases and skincare. Would you like to ask me about a skin condition or skincare routine?"

Please prioritize user safety and provide accurate information within your defined scope.`;

// Chatbot API Route
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const promptWithContext = `${SYSTEM_PROMPT}\n\n${message}`; // Prepend the system prompt
    const result = await model.generateContent(promptWithContext);
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