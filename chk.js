const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = 'AIzaSyBN5OrLI1xMZ9j_nw6PCtq602IhR6znrJk';
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

async function run() {
  try {
    const chatSession = model.startChat();
    const result = await chatSession.sendMessage("What are the causes of acne?");
    console.log("🤖 Response:", result.response.text());
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

run();
