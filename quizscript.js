const questions = [
    { id: "symptoms", text: "What symptoms are you experiencing?", options: ["Rash", "Itching", "Redness", "Swelling", "Dryness", "Blisters"], multiple: true },
    { id: "duration", text: "How long have you had these symptoms?", options: ["Less than a week", "1-2 weeks", "2-4 weeks", "More than a month"], multiple: false },
    { id: "location", text: "Where are the symptoms located?", options: ["Face", "Arms", "Legs", "Torso", "Hands/Feet"], multiple: true },
    { id: "severity", text: "How severe are your symptoms?", options: ["Mild", "Moderate", "Severe"], multiple: false },
    { id: "triggers", text: "Have you noticed any triggers?", options: ["Food", "Stress", "Weather", "Products", "Unknown"], multiple: true },
    { id: "blisters", text: "Do you have blisters or fluid-filled bumps?", options: ["Yes", "No"], multiple: false },
    { id: "fever", text: "Do you have a fever or swollen lymph nodes?", options: ["Yes", "No"], multiple: false }
];

let currentStep = 0;
const answers = {};

function displayQuestion() {
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    const question = questions[currentStep];
    document.getElementById('question-text').textContent = question.text;
    
    question.options.forEach(option => {
        const button = document.createElement('button');
        button.className = "w-full py-4 px-6 rounded-xl border border-gray-300 hover:bg-blue-100 transition text-gray-800";
        button.textContent = option;
        if (answers[question.id] && (Array.isArray(answers[question.id]) ? answers[question.id].includes(option) : answers[question.id] === option)) {
            button.classList.add("bg-blue-500", "text-white");
        }
        button.onclick = () => handleAnswer(question.id, option, question.multiple, button);
        container.appendChild(button);
    });
    
    updateProgress();
}

function handleAnswer(questionId, option, multiple) {
    if (multiple) {
        if (!answers[questionId]) answers[questionId] = [];
        const index = answers[questionId].indexOf(option);
        if (index === -1) {
            answers[questionId].push(option);
        } else {
            answers[questionId].splice(index, 1);
        }
    } else {
        answers[questionId] = option;
    }
    displayQuestion();
}

function goForward() {
    if (currentStep < questions.length - 1) {
        currentStep++;
        displayQuestion();
    } else {
        showResult();
    }
}

function goBack() {
    if (currentStep > 0) {
        currentStep--;
        displayQuestion();
    }
}

function updateProgress() {
    const progress = ((currentStep + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';
    document.getElementById('question-counter').textContent = `Question ${currentStep + 1} of ${questions.length}`;
}

function showResult() {
    document.getElementById('question-card').classList.add('hidden');
    document.getElementById('summary').classList.remove('hidden');
    document.getElementById('summary-content').innerHTML = Object.entries(answers)
        .map(([key, value]) => `<p><strong>${questions.find(q => q.id === key).text}</strong>: ${Array.isArray(value) ? value.join(", ") : value}</p>`)
        .join('');
    document.getElementById('prediction-text').textContent = getPrediction(answers);
    
    if (answers.severity === "Severe" || answers.fever === "Yes") {
        document.getElementById('warning-text').classList.remove('hidden');
        document.getElementById('warning-text').textContent = "Severe symptoms detected. Please consult a dermatologist.";
    }
}

function getPrediction(answers) {
    if (answers.symptoms.includes("Rash") && answers.triggers.includes("Food")) {
        return "Possible food allergy or contact dermatitis.";
    } else if (answers.symptoms.includes("Blisters") && answers.fever === "Yes") {
        return "Possible viral infection like Chickenpox or Shingles.";
    } else if (answers.severity === "Severe" && answers.duration === "More than a month") {
        return "Possible chronic condition like Psoriasis or severe Eczema.";
    } else {
        return "Mild skin irritation. Monitor symptoms and consult a dermatologist if needed.";
    }
}

function restart() {
    currentStep = 0;
    Object.keys(answers).forEach(key => delete answers[key]);
    document.getElementById('summary').classList.add('hidden');
    document.getElementById('question-card').classList.remove('hidden');
    displayQuestion();
}

displayQuestion();