document.addEventListener("DOMContentLoaded", function () {
    const imageInput = document.getElementById("imageInput");
    const previewImage = document.getElementById("previewImage");
    const loadingText = document.getElementById("loadingText");
    const resultText = document.getElementById("result");

    // Image Preview Function
    imageInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                previewImage.src = e.target.result;
                previewImage.style.display = "block"; // Show image preview
            };
            reader.readAsDataURL(file);
        }
    });
});

// Analyze Image Function
async function analyzeImage() {
    const imageInput = document.getElementById("imageInput");
    const loadingText = document.getElementById("loadingText");
    const resultText = document.getElementById("result");

    const file = imageInput.files[0];

    if (!file) {
        alert("Please select an image first!");
        return;
    }

    loadingText.style.display = "block"; // Show loading text
    resultText.innerText = "";

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await fetch("http://localhost:3000/analyze-image", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        resultText.innerText = data.analysis || "Could not analyze the image.";
    } catch (error) {
        resultText.innerText = "Error: " + error.message;
    } finally {
        loadingText.style.display = "none"; // Hide loading text
    }
}
