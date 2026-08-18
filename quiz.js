document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "GovLearn Practice Quiz loaded successfully."
        );


        // =====================================================
        // GET TOPIC ID FROM URL
        // =====================================================

        const urlParameters =
            new URLSearchParams(
                window.location.search
            );


        const quizTopicID =
            urlParameters.get("id");



        // =====================================================
        // FIND TOPIC INFORMATION
        // =====================================================

        const quizTopic =
            topics.find(
                function (topic) {

                    return (
                        topic.id ===
                        quizTopicID
                    );

                }
            );



        // =====================================================
        // GET QUESTIONS FOR THE SELECTED TOPIC
        // =====================================================

        const topicQuestionPool =
            questionBank.filter(
                function (question) {

                    return (
                        question.topic ===
                        quizTopicID
                    );

                }
            );



        // =====================================================
        // QUIZ STATE
        // =====================================================

        let quizQuestions = [];

        let currentQuestionIndex = 0;

        let studentAnswers = [];

        let latestScore = 0;

        let latestPercentage = 0;



        // =====================================================
        // HTML ELEMENTS
        // =====================================================

        const quizTopicTitle =
            document.getElementById(
                "quizTopicTitle"
            );


        const quizTosInfo =
            document.getElementById(
                "quizTosInfo"
            );


        const questionCounter =
            document.getElementById(
                "questionCounter"
            );


        const answeredCounter =
            document.getElementById(
                "answeredCounter"
            );


        const quizProgressFill =
            document.getElementById(
                "quizProgressFill"
            );


        const questionLevel =
            document.getElementById(
                "questionLevel"
            );


        const questionText =
            document.getElementById(
                "questionText"
            );


        const answerOptions =
            document.getElementById(
                "answerOptions"
            );


        const previousButton =
            document.getElementById(
                "previousQuestionButton"
            );


        const nextButton =
            document.getElementById(
                "nextQuestionButton"
            );


        const quizCard =
            document.getElementById(
                "quizCard"
            );


        const quizResultCard =
            document.getElementById(
                "quizResultCard"
            );


        const answerReviewSection =
            document.getElementById(
                "answerReviewSection"
            );


        const answerReviewList =
            document.getElementById(
                "answerReviewList"
            );


        const reviewAnswersButton =
            document.getElementById(
                "reviewAnswersButton"
            );


        const retryQuizButton =
            document.getElementById(
                "retryQuizButton"
            );


        const returnLessonButton =
            document.getElementById(
                "returnLessonButton"
            );


        const backToResultButton =
            document.getElementById(
                "backToResultButton"
            );


        const reviewRetryButton =
            document.getElementById(
                "reviewRetryButton"
            );


        const reviewReturnLessonButton =
            document.getElementById(
                "reviewReturnLessonButton"
            );


        const backToTopic =
            document.getElementById(
                "backToTopic"
            );



        // =====================================================
        // CHECK TOPIC AND QUESTION BANK
        // =====================================================

        if (
            !quizTopic ||
            topicQuestionPool.length === 0
        ) {

            showQuizUnavailable();

            return;

        }



        // =====================================================
        // START QUIZ
        // =====================================================

        initializeQuiz();



        // =====================================================
        // INITIALIZE QUIZ
        // =====================================================

        function initializeQuiz() {


            // PAGE TITLE

            document.title =
                quizTopic.title +
                " Practice Quiz | GovLearn";



            // TOPIC TITLE

            quizTopicTitle.textContent =
                quizTopic.title;



            // BACK TO LESSON LINK

            backToTopic.href =
                "topic.html?id=" +
                quizTopicID;



            // BUILD TOS-BASED QUESTION SET

            quizQuestions =
                buildTosPracticeQuiz(
                    quizTopicID,
                    topicQuestionPool
                );



            // CREATE EMPTY ANSWERS

            studentAnswers =
                new Array(
                    quizQuestions.length
                ).fill(null);



            // RESET VARIABLES

            currentQuestionIndex = 0;

            latestScore = 0;

            latestPercentage = 0;



            // SHOW QUIZ

            quizCard.classList.remove(
                "hidden"
            );


            quizResultCard.classList.add(
                "hidden"
            );


            answerReviewSection.classList.add(
                "hidden"
            );



            // DISPLAY TOS INFO

            displayTosInformation();



            // LOAD QUESTION

            loadQuestion();

        }



        // =====================================================
        // DISPLAY TOS INFORMATION
        // =====================================================

        function displayTosInformation() {


            if (
                typeof tosConfig ===
                "undefined"
            ) {

                quizTosInfo.textContent =
                    "";

                return;

            }


            const config =
                tosConfig.topics[
                    quizTopicID
                ];


            if (!config) {

                quizTosInfo.textContent =
                    "";

                return;

            }


            const distributionText =
                Object.entries(
                    config
                        .practiceDistribution
                )

                .filter(
                    function (entry) {

                        return (
                            entry[1] > 0
                        );

                    }
                )

                .map(
                    function (entry) {

                        const level =
                            entry[0];

                        const amount =
                            entry[1];


                        return (
                            amount +
                            " " +
                            level
                        );

                    }
                )

                .join(" • ");



            quizTosInfo.textContent =
                config.practiceSize +
                "-item TOS-based practice • " +
                distributionText;

        }



        // =====================================================
        // LOAD QUESTION
        // =====================================================

        function loadQuestion() {


            if (
                quizQuestions.length === 0
            ) {

                return;

            }


            const currentQuestion =
                quizQuestions[
                    currentQuestionIndex
                ];



            // QUESTION NUMBER

            questionCounter.textContent =
                "Question " +
                (
                    currentQuestionIndex +
                    1
                ) +
                " of " +
                quizQuestions.length;



            // COGNITIVE LEVEL

            questionLevel.textContent =
                currentQuestion
                    .cognitiveLevel;



            // QUESTION TEXT

            questionText.textContent =
                currentQuestion.question;



            // REMOVE PREVIOUS OPTIONS

            answerOptions.innerHTML =
                "";



            // CREATE CHOICES

            currentQuestion
                .choices
                .forEach(

                    function (
                        choice,
                        choiceIndex
                    ) {


                        const optionButton =
                            document
                                .createElement(
                                    "button"
                                );


                        optionButton.type =
                            "button";


                        optionButton.className =
                            "answer-option";



                        const optionLetter =
                            String.fromCharCode(
                                65 +
                                choiceIndex
                            );



                        optionButton.innerHTML = `

                            <span class="option-letter">

                                ${optionLetter}

                            </span>

                            <span class="option-text">

                                ${choice}

                            </span>

                        `;



                        // RESTORE PREVIOUSLY
                        // SELECTED ANSWER

                        if (
                            studentAnswers[
                                currentQuestionIndex
                            ] ===
                            choiceIndex
                        ) {

                            optionButton
                                .classList
                                .add(
                                    "selected"
                                );

                        }



                        // CLICK OPTION

                        optionButton
                            .addEventListener(

                                "click",

                                function () {

                                    selectAnswer(
                                        choiceIndex
                                    );

                                }

                            );



                        answerOptions
                            .appendChild(
                                optionButton
                            );

                    }

                );



            updateNavigationButtons();

            updateProgress();

        }



        // =====================================================
        // SELECT ANSWER
        // =====================================================

        function selectAnswer(
            selectedChoiceIndex
        ) {


            studentAnswers[
                currentQuestionIndex
            ] =
                selectedChoiceIndex;



            const allOptions =
                answerOptions
                    .querySelectorAll(
                        ".answer-option"
                    );



            allOptions.forEach(
                function (option) {

                    option.classList.remove(
                        "selected"
                    );

                }
            );



            if (
                allOptions[
                    selectedChoiceIndex
                ]
            ) {

                allOptions[
                    selectedChoiceIndex
                ]
                    .classList
                    .add(
                        "selected"
                    );

            }


            updateProgress();

        }



        // =====================================================
        // NEXT QUESTION
        // =====================================================

        nextButton.addEventListener(
            "click",
            function () {


                if (
                    studentAnswers[
                        currentQuestionIndex
                    ] === null
                ) {

                    alert(
                        "Please select an answer before continuing."
                    );

                    return;

                }



                if (
                    currentQuestionIndex <
                    quizQuestions.length - 1
                ) {

                    currentQuestionIndex++;

                    loadQuestion();

                }

                else {

                    finishQuiz();

                }

            }
        );



        // =====================================================
        // PREVIOUS QUESTION
        // =====================================================

        previousButton.addEventListener(
            "click",
            function () {


                if (
                    currentQuestionIndex > 0
                ) {

                    currentQuestionIndex--;

                    loadQuestion();

                }

            }
        );



        // =====================================================
        // NAVIGATION BUTTON STATES
        // =====================================================

        function updateNavigationButtons() {


            previousButton.disabled =
                (
                    currentQuestionIndex ===
                    0
                );



            if (
                currentQuestionIndex ===
                quizQuestions.length - 1
            ) {

                nextButton.textContent =
                    "Finish Quiz";

            }

            else {

                nextButton.textContent =
                    "Next Question";

            }

        }



        // =====================================================
        // UPDATE PROGRESS
        // =====================================================

        function updateProgress() {


            const answeredQuestions =
                studentAnswers.filter(
                    function (answer) {

                        return (
                            answer !== null
                        );

                    }
                ).length;



            answeredCounter.textContent =
                answeredQuestions +
                " Answered";



            const percentage =
                (
                    (
                        currentQuestionIndex +
                        1
                    )
                    /
                    quizQuestions.length
                )
                *
                100;



            quizProgressFill
                .style
                .width =
                percentage +
                "%";

        }



        // =====================================================
        // FINISH QUIZ
        // =====================================================

        function finishQuiz() {


            let score = 0;



            quizQuestions.forEach(

                function (
                    question,
                    index
                ) {


                    if (
                        studentAnswers[index]
                        ===
                        question.correctAnswer
                    ) {

                        score++;

                    }

                }

            );



            const total =
                quizQuestions.length;


            const incorrect =
                total -
                score;


            const percentage =
                Math.round(
                    (
                        score /
                        total
                    )
                    *
                    100
                );



            latestScore =
                score;


            latestPercentage =
                percentage;

// =====================================================
// SAVE PRACTICE PROGRESS
// =====================================================

if (
    typeof GovLearnProgress !==
    "undefined"
) {

    const progressAnswers =
        quizQuestions.map(

            function (
                question,
                index
            ) {

                return {

                    questionId:
                        question.id,

                    topic:
                        question.topic,

                    cognitiveLevel:
                        question.cognitiveLevel,

                    correct:
                        studentAnswers[index]
                        ===
                        question.correctAnswer,

                    selectedAnswer:
                        studentAnswers[index],

                    correctAnswer:
                        question.correctAnswer,

                    expired:
                        false

                };

            }

        );


    GovLearnProgress
        .savePracticeAttempt({

            topicId:
                quizTopicID,

            topicTitle:
                quizTopic.title,

            score:
                score,

            total:
                total,

            percentage:
                percentage,

            answers:
                progressAnswers

        });

}



            // SCORE

            document.getElementById(
                "finalScore"
            ).textContent =
                score +
                "/" +
                total;



            document.getElementById(
                "finalPercentage"
            ).textContent =
                percentage +
                "%";



            document.getElementById(
                "correctAnswers"
            ).textContent =
                score;



            document.getElementById(
                "incorrectAnswers"
            ).textContent =
                incorrect;



            document.getElementById(
                "totalQuestions"
            ).textContent =
                total;



            // RESULT MESSAGE

            const resultMessage =
                document.getElementById(
                    "resultMessage"
                );



            if (
                percentage >= 90
            ) {

                resultMessage.textContent =
                    "Excellent work! You showed strong understanding of this topic.";

            }

            else if (
                percentage >= 75
            ) {

                resultMessage.textContent =
                    "Good work! Review a few concepts and continue practicing.";

            }

            else if (
                percentage >= 60
            ) {

                resultMessage.textContent =
                    "You're making progress. Review your incorrect answers and study the related concepts.";

            }

            else {

                resultMessage.textContent =
                    "This topic needs more review. Study the lesson and review your mistakes before trying again.";

            }



            // HIDE QUIZ

            quizCard.classList.add(
                "hidden"
            );


            // HIDE REVIEW

            answerReviewSection
                .classList
                .add(
                    "hidden"
                );


            // SHOW RESULT

            quizResultCard
                .classList
                .remove(
                    "hidden"
                );



            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }



        // =====================================================
        // REVIEW MY ANSWERS BUTTON
        // =====================================================

        reviewAnswersButton
            .addEventListener(

                "click",

                function () {


                    console.log(
                        "Review My Answers clicked."
                    );


                    buildAnswerReview();



                    // HIDE RESULT

                    quizResultCard
                        .classList
                        .add(
                            "hidden"
                        );



                    // HIDE QUIZ

                    quizCard
                        .classList
                        .add(
                            "hidden"
                        );



                    // SHOW REVIEW

                    answerReviewSection
                        .classList
                        .remove(
                            "hidden"
                        );



                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

            );



        // =====================================================
        // BUILD ANSWER REVIEW
        // =====================================================

        function buildAnswerReview() {


            console.log(
                "Building answer review..."
            );



            // REVIEW SUMMARY

            document.getElementById(
                "reviewTopicName"
            ).textContent =
                quizTopic.title;



            document.getElementById(
                "reviewScore"
            ).textContent =
                latestScore +
                " / " +
                quizQuestions.length;



            document.getElementById(
                "reviewAccuracy"
            ).textContent =
                latestPercentage +
                "%";



            // CLEAR PREVIOUS REVIEW

            answerReviewList.innerHTML =
                "";



            // CREATE QUESTION CARDS

            quizQuestions.forEach(

                function (
                    question,
                    index
                ) {


                    const studentAnswerIndex =
                        studentAnswers[
                            index
                        ];



                    const isCorrect =
                        (
                            studentAnswerIndex
                            ===
                            question.correctAnswer
                        );



                    // STUDENT ANSWER

                    let studentAnswerText =
                        "No Answer";


                    let studentLetter =
                        "-";



                    if (
                        studentAnswerIndex !==
                        null
                    ) {

                        studentAnswerText =
                            question.choices[
                                studentAnswerIndex
                            ];


                        studentLetter =
                            String.fromCharCode(
                                65 +
                                studentAnswerIndex
                            );

                    }



                    // CORRECT ANSWER

                    const correctAnswerText =
                        question.choices[
                            question.correctAnswer
                        ];



                    const correctLetter =
                        String.fromCharCode(
                            65 +
                            question.correctAnswer
                        );



                    // CARD

                    const reviewCard =
                        document.createElement(
                            "article"
                        );



                    if (isCorrect) {

                        reviewCard.className =
                            "review-question-card correct-review";

                    }

                    else {

                        reviewCard.className =
                            "review-question-card incorrect-review";

                    }



                    reviewCard.innerHTML = `


                        <div class="review-question-header">


                            <div>

                                <span class="review-question-number">

                                    Question ${index + 1}

                                </span>


                                <span class="review-level-badge">

                                    ${question.cognitiveLevel}

                                </span>

                            </div>



                            <span
                                class="
                                    review-status
                                    ${
                                        isCorrect
                                        ?
                                        "correct-status"
                                        :
                                        "incorrect-status"
                                    }
                                "
                            >

                                ${
                                    isCorrect
                                    ?
                                    "✓ Correct"
                                    :
                                    "✕ Incorrect"
                                }

                            </span>


                        </div>



                        <h3 class="review-question-text">

                            ${question.question}

                        </h3>



                        <div class="review-answer-grid">


                            <div
                                class="
                                    review-answer-box
                                    ${
                                        isCorrect
                                        ?
                                        "student-correct"
                                        :
                                        "student-incorrect"
                                    }
                                "
                            >

                                <span class="review-box-label">

                                    Your Answer

                                </span>

                                <strong>

                                    ${studentLetter}.
                                    ${studentAnswerText}

                                </strong>

                            </div>



                            <div
                                class="
                                    review-answer-box
                                    correct-answer-box
                                "
                            >

                                <span class="review-box-label">

                                    Correct Answer

                                </span>

                                <strong>

                                    ${correctLetter}.
                                    ${correctAnswerText}

                                </strong>

                            </div>


                        </div>



                        <div class="answer-explanation">


                            <div class="explanation-icon">

                                💡

                            </div>


                            <div>

                                <span class="review-box-label">

                                    Explanation

                                </span>

                                <p>

                                    ${
                                        question.explanation
                                        ||
                                        "Review the related lesson for more information about this concept."
                                    }

                                </p>

                            </div>


                        </div>


                    `;



                    answerReviewList
                        .appendChild(
                            reviewCard
                        );

                }

            );

        }



        // =====================================================
        // BACK TO RESULT
        // =====================================================

        backToResultButton
            .addEventListener(

                "click",

                function () {


                    answerReviewSection
                        .classList
                        .add(
                            "hidden"
                        );


                    quizResultCard
                        .classList
                        .remove(
                            "hidden"
                        );


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }

            );



        // =====================================================
        // TRY AGAIN FROM RESULT
        // =====================================================

        retryQuizButton
            .addEventListener(

                "click",

                function () {

                    restartPracticeQuiz();

                }

            );



        // =====================================================
        // PRACTICE AGAIN FROM REVIEW
        // =====================================================

        reviewRetryButton
            .addEventListener(

                "click",

                function () {

                    restartPracticeQuiz();

                }

            );



        // =====================================================
        // RETURN TO LESSON FROM RESULT
        // =====================================================

        returnLessonButton
            .addEventListener(

                "click",

                function () {

                    goBackToLesson();

                }

            );



        // =====================================================
        // RETURN TO LESSON FROM REVIEW
        // =====================================================

        reviewReturnLessonButton
            .addEventListener(

                "click",

                function () {

                    goBackToLesson();

                }

            );



        // =====================================================
        // GO BACK TO LESSON
        // =====================================================

        function goBackToLesson() {

            window.location.href =
                "topic.html?id=" +
                quizTopicID;

        }



        // =====================================================
        // RESTART PRACTICE
        // =====================================================

        function restartPracticeQuiz() {


            currentQuestionIndex =
                0;


            latestScore =
                0;


            latestPercentage =
                0;



            // BUILD NEW TOS-BASED QUIZ

            quizQuestions =
                buildTosPracticeQuiz(
                    quizTopicID,
                    topicQuestionPool
                );



            // RESET ANSWERS

            studentAnswers =
                new Array(
                    quizQuestions.length
                ).fill(null);



            // HIDE RESULT

            quizResultCard
                .classList
                .add(
                    "hidden"
                );



            // HIDE REVIEW

            answerReviewSection
                .classList
                .add(
                    "hidden"
                );



            // SHOW QUIZ

            quizCard
                .classList
                .remove(
                    "hidden"
                );



            // LOAD FIRST QUESTION

            loadQuestion();



            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }



        // =====================================================
        // BUILD TOS-BASED PRACTICE QUIZ
        // =====================================================

        function buildTosPracticeQuiz(
            topicID,
            availableQuestions
        ) {


            // IF TOS CONFIG DOES NOT EXIST,
            // FALL BACK TO FIVE RANDOM QUESTIONS

            if (
                typeof tosConfig ===
                "undefined"
            ) {

                return shuffleArray(
                    availableQuestions
                ).slice(
                    0,
                    5
                );

            }



            const config =
                tosConfig.topics[
                    topicID
                ];



            if (!config) {

                return shuffleArray(
                    availableQuestions
                ).slice(
                    0,
                    5
                );

            }



            const selectedQuestions =
                [];


            const usedQuestionIDs =
                new Set();



            // =============================================
            // SELECT ACCORDING TO COGNITIVE LEVEL
            // =============================================

            Object.entries(
                config.practiceDistribution
            ).forEach(

                function (entry) {


                    const level =
                        entry[0];


                    const requiredAmount =
                        entry[1];



                    if (
                        requiredAmount <=
                        0
                    ) {

                        return;

                    }



                    const levelQuestions =
                        shuffleArray(

                            availableQuestions
                                .filter(

                                    function (
                                        question
                                    ) {

                                        return (
                                            question
                                                .cognitiveLevel
                                            ===
                                            level
                                        );

                                    }

                                )

                        );



                    levelQuestions
                        .slice(
                            0,
                            requiredAmount
                        )
                        .forEach(

                            function (
                                question
                            ) {


                                if (
                                    !usedQuestionIDs
                                        .has(
                                            question.id
                                        )
                                ) {

                                    selectedQuestions
                                        .push(
                                            question
                                        );


                                    usedQuestionIDs
                                        .add(
                                            question.id
                                        );

                                }

                            }

                        );

                }

            );



            // =============================================
            // FILL REMAINING QUESTIONS
            // IF QUESTION BANK IS SHORT
            // =============================================

            if (
                selectedQuestions.length <
                config.practiceSize
            ) {


                const remainingQuestions =
                    shuffleArray(

                        availableQuestions
                            .filter(

                                function (
                                    question
                                ) {

                                    return (
                                        !usedQuestionIDs
                                            .has(
                                                question.id
                                            )
                                    );

                                }

                            )

                    );



                for (
                    const question
                    of remainingQuestions
                ) {


                    selectedQuestions.push(
                        question
                    );


                    usedQuestionIDs.add(
                        question.id
                    );



                    if (
                        selectedQuestions.length >=
                        config.practiceSize
                    ) {

                        break;

                    }

                }

            }



            return shuffleArray(
                selectedQuestions
            );

        }



        // =====================================================
        // SHUFFLE ARRAY
        // =====================================================

        function shuffleArray(
            array
        ) {


            const shuffledArray =
                [...array];



            for (
                let i =
                    shuffledArray.length - 1;

                i > 0;

                i--
            ) {


                const randomIndex =
                    Math.floor(
                        Math.random()
                        *
                        (
                            i + 1
                        )
                    );



                const temporaryValue =
                    shuffledArray[i];


                shuffledArray[i] =
                    shuffledArray[
                        randomIndex
                    ];


                shuffledArray[
                    randomIndex
                ] =
                    temporaryValue;

            }



            return shuffledArray;

        }



        // =====================================================
        // QUIZ UNAVAILABLE
        // =====================================================

        function showQuizUnavailable() {


            document.title =
                "Quiz Not Available | GovLearn";


            quizTopicTitle.textContent =
                "Quiz Not Available";


            quizTosInfo.textContent =
                "";


            questionLevel.textContent =
                "Unavailable";


            questionText.textContent =
                "No practice questions are currently available for this topic.";


            answerOptions.innerHTML =
                "";


            previousButton.style.display =
                "none";


            nextButton.style.display =
                "none";


            if (quizTopicID) {

                backToTopic.href =
                    "topic.html?id=" +
                    quizTopicID;

            }

            else {

                backToTopic.href =
                    "index.html#topics";

            }

        }


    }
);