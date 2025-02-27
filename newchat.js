const API_URL = "https://skin-app-v5c1.onrender.com";

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

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");
  const userMessage = inputField.value.trim();

  if (!userMessage) return;

  chatbox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  inputField.value = "";

  // Add loading indicator
  const loadingElement = document.createElement("p");
  loadingElement.id = "loading";
  loadingElement.innerHTML = "<strong>SkinWise:</strong> ...";
  chatbox.appendChild(loadingElement);
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    const messageWithPrompt = `${SYSTEM_PROMPT}\n\n${userMessage}`; // Prepend prompt
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: messageWithPrompt }), // Send combined message
    });

    if (!response.ok) {
      throw new Error("Server error. Please try again.");
    }

    const data = await response.json();
    loadingElement.remove();
    const botResponseElement = document.createElement("p");
    botResponseElement.innerHTML = `<strong>SkinWise:</strong> ${data.output || "No response"}`;
    chatbox.appendChild(botResponseElement);
    chatbox.scrollTop = chatbox.scrollHeight;
  } catch (error) {
    loadingElement.remove();
    const errorElement = document.createElement("p");
    errorElement.innerHTML = "<strong>SkinWise:</strong> Error connecting to server.";
    chatbox.appendChild(errorElement);
    console.error("Error:", error);
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}