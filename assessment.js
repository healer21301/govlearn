console.log("Assessment engine loaded.");

const parameters = new URLSearchParams(window.location.search);
const assessmentType = parameters.get("type");

const assessment =
    assessmentType === "official-quiz"
        ? assessmentData.officialQuiz
        : assessmentType === "exam-practice"
            ? assessmentData.examPractice
            : null;

const assessmentTitle = document.getElementById("assessmentTitle");
const assessmentSubtitle = document.getElementById("assessmentSubtitle");
const assessmentLabel = document.getElementById("assessmentLabel");
const assessmentCard = document.getElementById("assessmentCard");
const assessmentResultCard = document.getElementById("assessmentResultCard");

const sectionTitle = document.getElementById("sectionTitle");
const sectionInstructions = document.getElementById("sectionInstructions");

const questionCounter = document.getElementById("questionCounter");
const answeredCounter = document.getElementById("answeredCounter");
const progressFill = document.getElementById("assessmentProgressFill");
const questionTypeLabel = document.getElementById("questionTypeLabel");
const questionText = document.getElementById("assessmentQuestion");
const optionsContainer = document.getElementById("assessmentOptions");
const keyNote = document.getElementById("keyNote");

const previousButton = document.getElementById("assessmentPreviousButton");
const nextButton = document.getElementById("assessmentNextButton");

let flattenedItems = [];
let currentIndex = 0;
let answers = [];

if (!assessment) {
    assessmentTitle.textContent = "Assessment Not Found";
    assessmentSubtitle.textContent =
        "Please return to the homepage and choose a valid assessment.";
    assessmentCard.classList.add("hidden");
} else {
    document.title = assessment.title + " | GovLearn";
    assessmentTitle.textContent = assessment.title;
    assessmentSubtitle.textContent = assessment.subtitle;

    assessmentLabel.textContent =
        assessment.id === "official-quiz"
            ? "Official Quiz"
            : "Exam Practice";

    assessment.sections.forEach(function (section, sectionIndex) {
        section.items.forEach(function (item) {
            flattenedItems.push({
                ...item,
                sectionIndex: sectionIndex
            });
        });
    });

    answers = new Array(flattenedItems.length).fill(null);

    renderQuestion();
}

function currentSection() {
    const item = flattenedItems[currentIndex];
    return assessment.sections[item.sectionIndex];
}

function renderQuestion() {
    const item = flattenedItems[currentIndex];
    const section = currentSection();

    sectionTitle.textContent = section.title;
    sectionInstructions.textContent = section.instructions;

    questionCounter.textContent =
        "Question " +
        item.number +
        " of " +
        assessment.totalItems;

    questionTypeLabel.textContent =
        item.type === "mcq"
            ? "Multiple Choice"
            : item.type === "truefalse"
                ? "True or False"
                : "Matching Type";

    questionText.textContent = item.question;

    optionsContainer.innerHTML = "";
    keyNote.classList.add("hidden");
    keyNote.textContent = "";

    if (item.type === "matching") {
        renderMatchingQuestion(item, section);
    } else {
        renderButtonChoices(item);
    }

    if (item.correctAnswer === null && item.keyNote) {
        keyNote.textContent =
            "Teacher-key check: " + item.keyNote;
        keyNote.classList.remove("hidden");
    }

    previousButton.disabled = currentIndex === 0;

    nextButton.textContent =
        currentIndex === flattenedItems.length - 1
            ? "Finish Assessment"
            : "Next Question";

    updateProgress();
}

function renderButtonChoices(item) {
    item.choices.forEach(function (choice) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "answer-option";

        if (answers[currentIndex] === choice.value) {
            button.classList.add("selected");
        }

        const showLetter = item.type === "mcq";

        button.innerHTML = `
            ${
                showLetter
                    ? `<span class="option-letter">${choice.value}</span>`
                    : `<span class="option-letter tf-letter">${choice.value === "TRUE" ? "T" : "F"}</span>`
            }
            <span class="option-text">${choice.label}</span>
        `;

        button.addEventListener("click", function () {
            answers[currentIndex] = choice.value;
            renderQuestion();
        });

        optionsContainer.appendChild(button);
    });
}

function renderMatchingQuestion(item, section) {
    const wrapper = document.createElement("div");
    wrapper.className = "matching-answer-wrapper";

    const label = document.createElement("label");
    label.textContent = "Choose the matching concept:";

    const select = document.createElement("select");
    select.className = "matching-select";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select an answer...";
    select.appendChild(placeholder);

    section.answerBank.forEach(function (answer) {
        const option = document.createElement("option");
        option.value = answer.value;
        option.textContent =
            answer.value + ". " + answer.label;

        if (answers[currentIndex] === answer.value) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    select.addEventListener("change", function () {
        answers[currentIndex] =
            select.value === "" ? null : select.value;

        updateProgress();
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);

    const bank = document.createElement("div");
    bank.className = "matching-bank";

    const bankTitle = document.createElement("strong");
    bankTitle.textContent = "Set B";
    bank.appendChild(bankTitle);

    const bankGrid = document.createElement("div");
    bankGrid.className = "matching-bank-grid";

    section.answerBank.forEach(function (answer) {
        const chip = document.createElement("span");
        chip.textContent =
            answer.value + ". " + answer.label;
        bankGrid.appendChild(chip);
    });

    bank.appendChild(bankGrid);
    optionsContainer.appendChild(wrapper);
    optionsContainer.appendChild(bank);
}

nextButton.addEventListener("click", function () {
    if (answers[currentIndex] === null) {
        alert("Please select an answer before continuing.");
        return;
    }

    if (currentIndex < flattenedItems.length - 1) {
        currentIndex++;
        renderQuestion();
        window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
        finishAssessment();
    }
});

previousButton.addEventListener("click", function () {
    if (currentIndex > 0) {
        currentIndex--;
        renderQuestion();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

function updateProgress() {
    const answered =
        answers.filter(function (answer) {
            return answer !== null;
        }).length;

    answeredCounter.textContent =
        answered + " Answered";

    const percentage =
        ((currentIndex + 1) / flattenedItems.length) * 100;

    progressFill.style.width =
        percentage + "%";
}

function finishAssessment() {
    let correct = 0;
    let incorrect = 0;
    let pending = 0;
    let scoredItems = 0;

    flattenedItems.forEach(function (item, index) {
        if (item.correctAnswer === null) {
            pending++;
            return;
        }

        scoredItems++;

        if (answers[index] === item.correctAnswer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    const percentage =
        scoredItems === 0
            ? 0
            : Math.round((correct / scoredItems) * 100);

    document.getElementById("assessmentFinalScore").textContent =
        correct + "/" + scoredItems;

    document.getElementById("assessmentPercentage").textContent =
        percentage + "%";

    document.getElementById("assessmentCorrect").textContent =
        correct;

    document.getElementById("assessmentIncorrect").textContent =
        incorrect;

    document.getElementById("assessmentPending").textContent =
        pending;

    const resultMessage =
        document.getElementById("assessmentResultMessage");

    if (percentage >= 90) {
        resultMessage.textContent =
            "Excellent performance. You demonstrated strong mastery of the assessed concepts.";
    } else if (percentage >= 75) {
        resultMessage.textContent =
            "Good work. Review the items you found difficult and continue practicing.";
    } else if (percentage >= 60) {
        resultMessage.textContent =
            "You are making progress. Review the related lessons before trying again.";
    } else {
        resultMessage.textContent =
            "More review is recommended before your next attempt.";
    }

    const note =
        document.getElementById("assessmentResultNote");

    note.textContent =
        pending > 0
            ? pending +
              " item(s) were excluded from automatic scoring because the supplied source does not provide a clear answer key for them yet."
            : "All items were included in automatic scoring.";

    assessmentCard.classList.add("hidden");
    assessmentResultCard.classList.remove("hidden");

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.getElementById("assessmentRetryButton")
    .addEventListener("click", function () {
        currentIndex = 0;
        answers = new Array(flattenedItems.length).fill(null);

        assessmentResultCard.classList.add("hidden");
        assessmentCard.classList.remove("hidden");

        renderQuestion();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

document.getElementById("assessmentHomeButton")
    .addEventListener("click", function () {
        window.location.href = "index.html#assessments";
    });
