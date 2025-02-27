const API_URL = "https://skin-app-v5c1.onrender.com";

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
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
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
