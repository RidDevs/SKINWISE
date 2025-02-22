const questions = [
    {
        id: "symptoms",
        text: "What symptoms are you experiencing?",
        options: ["Rash", "Itching", "Redness", "Swelling", "Dryness"],
    },
    {
        id: "duration",
        text: "How long have you had these symptoms?",
        options: ["Less than a week", "1-2 weeks", "2-4 weeks", "More than a month"],
    },
    {
        id: "location",
        text: "Where on your body are the symptoms located?",
        options: ["Face", "Arms", "Legs", "Torso", "Hands/Feet"],
    },
    {
        id: "severity",
        text: "How severe are your symptoms?",
        options: ["Mild", "Moderate", "Severe"],
    },
    {
        id: "triggers",
        text: "Have you noticed any triggers?",
        options: ["Food", "Stress", "Weather", "Products", "Unknown"],
    },
];

let currentStep = 0;
const answers = {};

function goBack() {
    if (currentStep > 0) {
        currentStep--;
        updateProgress();
        displayQuestion();
    }
}

function goForward() {
    if (currentStep < questions.length - 1) {
        currentStep++;
        updateProgress();
        displayQuestion();
    } else {
        showSummary();
    }
}

function updateProgress() {
    const progressBar = document.getElementById('progress-bar');
    const questionCounter = document.getElementById('question-counter');
    const progress = ((currentStep + 1) / questions.length) * 100;
    
    progressBar.style.width = `${progress}%`;
    questionCounter.textContent = `Question ${currentStep + 1} of ${questions.length}`;
}

function handleAnswer(option) {
    const currentQuestion = questions[currentStep];
    if (!answers[currentQuestion.id]) {
        answers[currentQuestion.id] = [];
    }
    const index = answers[currentQuestion.id].indexOf(option);
    if (index > -1) {
        answers[currentQuestion.id].splice(index, 1);
    } else {
        answers[currentQuestion.id].push(option);
    }
    displayQuestion();
}

function displayQuestion() {
    const question = questions[currentStep];
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    questionText.textContent = question.text;
    optionsContainer.innerHTML = '';
    question.options.forEach(option => {
        const button = document.createElement('button');
        const isSelected = answers[question.id]?.includes(option);
        button.className = `w-full justify-start text-left h-auto py-4 px-6 rounded-xl transition-all duration-200 ${
            isSelected
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-blue-300 hover:bg-blue-50'
        }`;
        button.textContent = option;
        button.onclick = () => handleAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function getPrediction(answers) {
    let prediction = "";
    let warning = "";

    if (answers.symptoms?.includes("Rash") && answers.triggers?.includes("Food")) {
        prediction = "Possible food allergy or contact dermatitis.";
    } else if (answers.symptoms?.includes("Dryness") && answers.severity?.includes("Mild")) {
        prediction = "Possible dry skin (xerosis) or mild eczema.";
    } else if (answers.severity?.includes("Severe") && answers.duration?.includes("More than a month")) {
        prediction = "Possible chronic condition like psoriasis or severe eczema.";
        warning = "⚠ This could be a serious condition. Please consult a dermatologist as soon as possible.";
    } else if (answers.location?.includes("Face") && answers.triggers?.includes("Products")) {
        prediction = "Possible contact dermatitis or skin sensitivity.";
    } else {
        prediction = "Based on your symptoms, you may have a common skin irritation. Consider consulting a dermatologist.";
    }

    return { prediction, warning };
}

function showSummary() {
    document.getElementById('question-card').classList.add('hidden');
    document.getElementById('summary').classList.remove('hidden');

    document.getElementById('summary-content').innerHTML = questions.map(q => `
        <div class="flex justify-between items-start">
            <span class="text-gray-600">${q.text}</span>
            <span class="font-medium">${answers[q.id]?.join(", ") || "No answer"}</span>
        </div>
    `).join('');

    const { prediction, warning } = getPrediction(answers);
    document.getElementById('prediction-text').textContent = prediction;

    const warningElement = document.getElementById('warning-text');
    if (warning) {
        warningElement.textContent = warning;
        warningElement.classList.remove('hidden');
    } else {
        warningElement.classList.add('hidden');
    }
}

function restart() {
    currentStep = 0;
    Object.keys(answers).forEach(key => delete answers[key]);

    document.getElementById('summary').classList.add('hidden');
    document.getElementById('question-card').classList.remove('hidden');

    updateProgress();
    displayQuestion();
}

updateProgress();
displayQuestion();
