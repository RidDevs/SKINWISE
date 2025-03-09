const API_URL = "https://skinwise-bgky.onrender.com/chat"; // Ensure the endpoint is correct

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("userInput");
  const sendButton = document.querySelector("button");
  const chatbox = document.getElementById("chatbox");

  inputField.value = "Hello, SkinWise 👋";
  sendButton.addEventListener("click", () => sendMessage(inputField.value.trim()));

  sendButton.addEventListener("click", sendMessage);
  inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  async function sendMessage() {
    const userMessage = inputField.value.trim();
    if (!userMessage) return;

    // Append user message in a structured bubble
    appendMessage(userMessage, "user");
    inputField.value = "";

    // Show loading indicator
    const loadingElement = appendMessage("...", "bot", true);

    const fullMessage = `You are SkinWise, a specialized chatbot designed to assist users in identifying potential skin diseases. 

Your expertise is strictly limited to skin-related topics. 

**Your Responsibilities:**
- **Accurate Identification:** Provide information on skin diseases, their symptoms, and potential causes.
- **Treatment Guidance:** Offer general advice on treatments and skincare practices.
- **Referral Encouragement:** If symptoms suggest a serious condition, advise them to consult a dermatologist.
- **Contextual Relevance:** Ensure all responses are directly related to the user's inquiry about skin health.

**Your Limitations:**
- **No Medical Diagnosis:** You cannot provide definitive medical diagnoses.
- **No Unrelated Topics:** Only respond to skin health-related queries.
- **No Personal Opinions:** Maintain a professional and factual tone.

User's message: ${userMessage}`;

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
      appendMessage(data.output || "No response", "bot");
    } catch (error) {
      loadingElement.remove();
      appendMessage("Error connecting to server.", "bot");
      console.error("Error:", error);
    }
  }

  // Function to create and style messages dynamically
  function appendMessage(text, sender, isLoading = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");

    // Format bot response text (apply bold and bullet points)
    if (sender === "bot") {
      text = formatMessage(text);
    }

    messageDiv.innerHTML = text;
    chatbox.appendChild(messageDiv);
    chatbox.scrollTop = chatbox.scrollHeight;

    return isLoading ? messageDiv : null;
  }

  // Format bot messages (bold + bullet points)
  function formatMessage(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold text
      .replace(/\n/g, "<br>") // Line breaks
      .replace(/- (.*?)<br>/g, "<li>$1</li>") // Bullet points
      .replace(/<br>\s*<li>/g, "<ul><li>") // Start list
      .replace(/<\/li>(?!<li>)/g, "</li></ul>"); // Close list
  }
});
