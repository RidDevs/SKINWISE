const API_URL = "https://skin-app-v5c1.onrender.com"; // Make sure the endpoint is correct

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("userInput");
  const sendButton = document.querySelector("button"); // Get the button
  const chatbox = document.getElementById("chatbox");

  sendButton.addEventListener("click", sendMessage); // Attach event listener

  async function sendMessage() {
    const userMessage = inputField.value.trim();
    if (!userMessage) return; // Don't send empty messages

    chatbox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
    inputField.value = "";

    // Add loading indicator
    const loadingElement = document.createElement("p");
    loadingElement.id = "loading";
    loadingElement.innerHTML = "<strong>SkinWise:</strong> ...";
    chatbox.appendChild(loadingElement);
    chatbox.scrollTop = chatbox.scrollHeight;

    // Prepend the introductory message to the user's input
    const fullMessage = `You are SkinWise, a specialized chatbot designed to assist users in identifying potential skin diseases. \nYour expertise is strictly limited to skin-related topics. \n\n**Your Responsibilities:**\n* **Accurate Identification:** Provide information on skin diseases, their symptoms, and potential causes.\n* **Treatment Guidance:** Offer general advice on treatments and skincare practices.\n* **Referral Encouragement:** If a user's symptoms suggest a serious condition, advise them to consult a dermatologist or healthcare professional.\n* **Contextual Relevance:** Ensure all responses are directly related to the user's inquiry about skin health.\n\n**Your Limitations:**\n* **No Medical Diagnosis:** You cannot provide definitive medical diagnoses.\n* **No Unrelated Topics:** You should not engage in conversations outside the scope of skin diseases and skincare.\n* **No Personal Opinions:** Do not express personal opinions or beliefs.\n\n**Response Guidelines:**\n* **Polite and Professional:** Maintain a polite and professional tone.\n* **Clear and Concise:** Provide clear and concise information.\n* **Redirect Irrelevant Questions:** If a user asks a question unrelated to skin health, politely state that you can only assist with skin-related inquiries and encourage them to ask about skin diseases or skincare.\n\n**Example of Irrelevant Question Handling:**\nUser: \"What's the weather like today?\"\nSkinWise: \"I can only assist with questions related to skin diseases and skincare. Would you like to ask me about a skin condition or skincare routine?\"\n\nPlease prioritize user safety and provide accurate information within your defined scope. \n\nUser's message: ${userMessage}`;

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: fullMessage }),
      });

      if (!response.ok) {
        throw new Error("Server error. Please try again.");
      }

      const data = await response.json();
      loadingElement.remove(); // Remove loading indicator
      const botResponseElement = document.createElement("p");
      botResponseElement.innerHTML = `<strong>SkinWise:</strong> ${data.output || "No response"}`;
      chatbox.appendChild(botResponseElement);
      chatbox.scrollTop = chatbox.scrollHeight;
    } catch (error) {
      loadingElement.remove(); // Remove loading indicator
      const errorElement = document.createElement("p");
      errorElement.innerHTML = "<strong>SkinWise:</strong> Error connecting to server.";
      chatbox.appendChild(errorElement);
      console.error("Error:", error);
      chatbox.scrollTop = chatbox.scrollHeight;
    }
  }
});
