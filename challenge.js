document.addEventListener(
    "DOMContentLoaded",
    function () {


        console.log(
            "GovLearn Timed Challenge loaded."
        );



        // =====================================================
        // SETTINGS
        // =====================================================

        const TOTAL_CHALLENGE_ITEMS =
            10;


        const TIME_PER_QUESTION =
            30;



        const challengeDistribution = {

            Remembering: 2,

            Understanding: 3,

            Analyzing: 5

        };



        // =====================================================
        // STATE
        // =====================================================

        let challengeQuestions = [];


        let currentQuestionIndex =
            0;


        let studentAnswers = [];


        let expiredQuestions = [];


        let timerInterval = null;


        let timeRemaining =
            TIME_PER_QUESTION;


        let challengeScore =
            0;


        let challengePercentage =
            0;


        let answerLocked =
            false;



        // =====================================================
        // ELEMENTS
        // =====================================================

        const challengeStartCard =
            document.getElementById(
                "challengeStartCard"
            );


        const challengeQuizCard =
            document.getElementById(
                "challengeQuizCard"
            );


        const challengeResultCard =
            document.getElementById(
                "challengeResultCard"
            );


        const challengeReviewSection =
            document.getElementById(
                "challengeReviewSection"
            );


        const startChallengeButton =
            document.getElementById(
                "startChallengeButton"
            );


        const questionCounter =
            document.getElementById(
                "challengeQuestionCounter"
            );


        const challengeLevel =
            document.getElementById(
                "challengeLevel"
            );


        const challengeTopic =
            document.getElementById(
                "challengeTopic"
            );


        const questionText =
            document.getElementById(
                "challengeQuestionText"
            );


        const answerOptions =
            document.getElementById(
                "challengeAnswerOptions"
            );


        const timerDisplay =
            document.getElementById(
                "timerDisplay"
            );


        const timerBox =
            document.getElementById(
                "timerBox"
            );


        const timerProgressFill =
            document.getElementById(
                "timerProgressFill"
            );


        const challengeMessage =
            document.getElementById(
                "challengeMessage"
            );


        const nextButton =
            document.getElementById(
                "challengeNextButton"
            );


        const answeredCounter =
            document.getElementById(
                "challengeAnsweredCounter"
            );


        const challengeReviewList =
            document.getElementById(
                "challengeReviewList"
            );



        // =====================================================
        // START CHALLENGE
        // =====================================================

        startChallengeButton
            .addEventListener(

                "click",

                function () {

                    startNewChallenge();

                }

            );



        // =====================================================
        // START NEW CHALLENGE
        // =====================================================

        function startNewChallenge() {


            clearExistingTimer();


            challengeQuestions =
                buildChallengeQuestions();


            if (
                challengeQuestions.length
                <
                TOTAL_CHALLENGE_ITEMS
            ) {

                alert(
                    "There are not enough questions in the question bank to create the Timed Challenge."
                );

                return;

            }



            currentQuestionIndex =
                0;


            challengeScore =
                0;


            challengePercentage =
                0;


            studentAnswers =
                new Array(
                    challengeQuestions.length
                ).fill(null);


            expiredQuestions =
                new Array(
                    challengeQuestions.length
                ).fill(false);



            challengeStartCard
                .classList
                .add(
                    "hidden"
                );


            challengeResultCard
                .classList
                .add(
                    "hidden"
                );


            challengeReviewSection
                .classList
                .add(
                    "hidden"
                );


            challengeQuizCard
                .classList
                .remove(
                    "hidden"
                );


            loadChallengeQuestion();


            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }



        // =====================================================
        // BUILD TOS-BASED CHALLENGE
        // =====================================================

        function buildChallengeQuestions() {


            const selectedQuestions =
                [];


            const usedIDs =
                new Set();



            Object.entries(
                challengeDistribution
            )
            .forEach(

                function (entry) {


                    const cognitiveLevel =
                        entry[0];


                    const amount =
                        entry[1];



                    const available =
                        shuffleArray(

                            questionBank
                                .filter(

                                    function (
                                        question
                                    ) {

                                        return (
                                            question
                                                .cognitiveLevel
                                            ===
                                            cognitiveLevel
                                        );

                                    }

                                )

                        );



                    available
                        .slice(
                            0,
                            amount
                        )
                        .forEach(

                            function (
                                question
                            ) {


                                if (
                                    !usedIDs.has(
                                        question.id
                                    )
                                ) {

                                    selectedQuestions
                                        .push(
                                            question
                                        );


                                    usedIDs.add(
                                        question.id
                                    );

                                }

                            }

                        );

                }

            );



            // FILL IF NECESSARY

            if (
                selectedQuestions.length
                <
                TOTAL_CHALLENGE_ITEMS
            ) {


                const remaining =
                    shuffleArray(

                        questionBank
                            .filter(

                                function (
                                    question
                                ) {

                                    return (
                                        !usedIDs.has(
                                            question.id
                                        )
                                    );

                                }

                            )

                    );



                for (
                    const question
                    of remaining
                ) {


                    selectedQuestions
                        .push(
                            question
                        );


                    usedIDs.add(
                        question.id
                    );


                    if (
                        selectedQuestions.length
                        >=
                        TOTAL_CHALLENGE_ITEMS
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
        // LOAD QUESTION
        // =====================================================

        function loadChallengeQuestion() {


            clearExistingTimer();


            answerLocked =
                false;



            challengeMessage
                .classList
                .add(
                    "hidden"
                );


            challengeMessage.textContent =
                "";



            const question =
                challengeQuestions[
                    currentQuestionIndex
                ];



            // COUNTER

            questionCounter.textContent =
                "Question " +
                (
                    currentQuestionIndex +
                    1
                ) +
                " of " +
                challengeQuestions.length;



            // COGNITIVE LEVEL

            challengeLevel.textContent =
                question.cognitiveLevel;



            // TOPIC

            challengeTopic.textContent =
                getTopicTitle(
                    question.topic
                );



            // QUESTION

            questionText.textContent =
                question.question;



            // OPTIONS

            answerOptions.innerHTML =
                "";



            question.choices.forEach(

                function (
                    choice,
                    choiceIndex
                ) {


                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "answer-option";



                    const letter =
                        String.fromCharCode(
                            65 +
                            choiceIndex
                        );



                    button.innerHTML = `

                        <span class="option-letter">

                            ${letter}

                        </span>

                        <span class="option-text">

                            ${choice}

                        </span>

                    `;



                    button
                        .addEventListener(

                            "click",

                            function () {


                                if (
                                    answerLocked
                                ) {

                                    return;

                                }


                                selectChallengeAnswer(
                                    choiceIndex
                                );

                            }

                        );



                    answerOptions
                        .appendChild(
                            button
                        );

                }

            );



            updateAnsweredCounter();


            startQuestionTimer();

        }



        // =====================================================
        // SELECT ANSWER
        // =====================================================

        function selectChallengeAnswer(
            selectedIndex
        ) {


            studentAnswers[
                currentQuestionIndex
            ] =
                selectedIndex;



            const optionButtons =
                answerOptions
                    .querySelectorAll(
                        ".answer-option"
                    );



            optionButtons.forEach(

                function (button) {

                    button.classList.remove(
                        "selected"
                    );

                }

            );



            if (
                optionButtons[
                    selectedIndex
                ]
            ) {

                optionButtons[
                    selectedIndex
                ]
                    .classList
                    .add(
                        "selected"
                    );

            }



            updateAnsweredCounter();

        }



        // =====================================================
        // SUBMIT & NEXT
        // =====================================================

        nextButton.addEventListener(
            "click",
            function () {


                if (
                    answerLocked
                ) {

                    return;

                }



                if (
                    studentAnswers[
                        currentQuestionIndex
                    ] === null
                ) {

                    challengeMessage
                        .textContent =
                        "Please select an answer before continuing.";


                    challengeMessage
                        .classList
                        .remove(
                            "hidden"
                        );


                    return;

                }



                moveToNextQuestion();

            }
        );



        // =====================================================
        // NEXT QUESTION
        // =====================================================

        function moveToNextQuestion() {


            clearExistingTimer();


            if (
                currentQuestionIndex <
                challengeQuestions.length - 1
            ) {

                currentQuestionIndex++;


                loadChallengeQuestion();

            }

            else {

                finishChallenge();

            }

        }



        // =====================================================
        // TIMER
        // =====================================================

        function startQuestionTimer() {


            timeRemaining =
                TIME_PER_QUESTION;



            updateTimerDisplay();



            timerInterval =
                setInterval(

                    function () {


                        timeRemaining--;


                        updateTimerDisplay();



                        if (
                            timeRemaining <=
                            0
                        ) {


                            clearExistingTimer();


                            handleTimeExpired();

                        }

                    },

                    1000

                );

        }



        // =====================================================
        // TIMER DISPLAY
        // =====================================================

        function updateTimerDisplay() {


            const seconds =
                String(
                    timeRemaining
                ).padStart(
                    2,
                    "0"
                );


            timerDisplay.textContent =
                "00:" +
                seconds;



            const percentage =
                (
                    timeRemaining
                    /
                    TIME_PER_QUESTION
                )
                *
                100;



            timerProgressFill
                .style
                .width =
                percentage +
                "%";



            timerBox.classList.remove(
                "timer-warning",
                "timer-danger"
            );



            if (
                timeRemaining <=
                5
            ) {

                timerBox.classList.add(
                    "timer-danger"
                );

            }

            else if (
                timeRemaining <=
                10
            ) {

                timerBox.classList.add(
                    "timer-warning"
                );

            }

        }



        // =====================================================
        // TIME EXPIRED
        // =====================================================

        function handleTimeExpired() {


            if (
                answerLocked
            ) {

                return;

            }



            answerLocked =
                true;



            expiredQuestions[
                currentQuestionIndex
            ] =
                true;



            studentAnswers[
                currentQuestionIndex
            ] =
                null;



            challengeMessage.textContent =
                "Time expired! Moving to the next question...";


            challengeMessage
                .classList
                .remove(
                    "hidden"
                );



            disableAnswerButtons();



            setTimeout(

                function () {

                    moveToNextQuestion();

                },

                1200

            );

        }



        // =====================================================
        // DISABLE ANSWERS
        // =====================================================

        function disableAnswerButtons() {


            const buttons =
                answerOptions
                    .querySelectorAll(
                        ".answer-option"
                    );


            buttons.forEach(

                function (button) {

                    button.disabled =
                        true;

                }

            );

        }



        // =====================================================
        // CLEAR TIMER
        // =====================================================

        function clearExistingTimer() {


            if (
                timerInterval !== null
            ) {

                clearInterval(
                    timerInterval
                );


                timerInterval =
                    null;

            }

        }



        // =====================================================
        // ANSWERED COUNTER
        // =====================================================

        function updateAnsweredCounter() {


            const answered =
                studentAnswers.filter(

                    function (answer) {

                        return (
                            answer !== null
                        );

                    }

                ).length;



            answeredCounter.textContent =
                answered +
                " of " +
                challengeQuestions.length +
                " Answered";

        }



        // =====================================================
        // FINISH CHALLENGE
        // =====================================================

        function finishChallenge() {


            clearExistingTimer();



            let correct =
                0;


            let incorrect =
                0;


            let expired =
                0;



            challengeQuestions.forEach(

                function (
                    question,
                    index
                ) {


                    if (
                        expiredQuestions[
                            index
                        ]
                    ) {

                        expired++;

                        return;

                    }



                    if (
                        studentAnswers[
                            index
                        ]
                        ===
                        question.correctAnswer
                    ) {

                        correct++;

                    }

                    else {

                        incorrect++;

                    }

                }

            );



            challengeScore =
                correct;



            challengePercentage =
                Math.round(
                    (
                        correct
                        /
                        challengeQuestions.length
                    )
                    *
                    100
                );

// =====================================================
// SAVE TIMED CHALLENGE PROGRESS
// =====================================================

if (
    typeof GovLearnProgress !==
    "undefined"
) {

    const progressAnswers =
        challengeQuestions.map(

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
                        (
                            !expiredQuestions[index]
                            &&
                            studentAnswers[index]
                            ===
                            question.correctAnswer
                        ),

                    selectedAnswer:
                        studentAnswers[index],

                    correctAnswer:
                        question.correctAnswer,

                    expired:
                        expiredQuestions[index]

                };

            }

        );


    GovLearnProgress
        .saveChallengeAttempt({

            score:
                correct,

            total:
                challengeQuestions.length,

            percentage:
                challengePercentage,

            expired:
                expired,

            answers:
                progressAnswers

        });

}



            document.getElementById(
                "challengeFinalScore"
            ).textContent =
                correct +
                "/" +
                challengeQuestions.length;



            document.getElementById(
                "challengeFinalPercentage"
            ).textContent =
                challengePercentage +
                "%";



            document.getElementById(
                "challengeCorrect"
            ).textContent =
                correct;



            document.getElementById(
                "challengeIncorrect"
            ).textContent =
                incorrect;



            document.getElementById(
                "challengeExpired"
            ).textContent =
                expired;



            const message =
                document.getElementById(
                    "challengeResultMessage"
                );



            if (
                challengePercentage >=
                90
            ) {

                message.textContent =
                    "Excellent performance! You demonstrated strong knowledge even under time pressure.";

            }

            else if (
                challengePercentage >=
                75
            ) {

                message.textContent =
                    "Good performance! Review the items you missed and continue practicing.";

            }

            else if (
                challengePercentage >=
                60
            ) {

                message.textContent =
                    "You're making progress. Focus on your incorrect and expired questions before trying again.";

            }

            else {

                message.textContent =
                    "More review is recommended. Study your weak concepts before attempting another timed challenge.";

            }



            challengeQuizCard
                .classList
                .add(
                    "hidden"
                );


            challengeReviewSection
                .classList
                .add(
                    "hidden"
                );


            challengeResultCard
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
        // REVIEW ANSWERS
        // =====================================================

        document.getElementById(
            "challengeReviewButton"
        )
        .addEventListener(

            "click",

            function () {


                buildChallengeReview();


                challengeResultCard
                    .classList
                    .add(
                        "hidden"
                    );


                challengeReviewSection
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
        // BUILD REVIEW
        // =====================================================

        function buildChallengeReview() {


            document.getElementById(
                "challengeReviewScore"
            ).textContent =
                challengeScore +
                " / " +
                challengeQuestions.length;



            document.getElementById(
                "challengeReviewAccuracy"
            ).textContent =
                challengePercentage +
                "%";



            challengeReviewList.innerHTML =
                "";



            challengeQuestions.forEach(

                function (
                    question,
                    index
                ) {


                    const studentAnswer =
                        studentAnswers[
                            index
                        ];


                    const expired =
                        expiredQuestions[
                            index
                        ];



                    const correct =
                        (
                            !expired
                            &&
                            studentAnswer
                            ===
                            question.correctAnswer
                        );



                    let studentText =
                        "No Answer";


                    let studentLetter =
                        "-";



                    if (
                        studentAnswer !==
                        null
                    ) {

                        studentText =
                            question.choices[
                                studentAnswer
                            ];


                        studentLetter =
                            String.fromCharCode(
                                65 +
                                studentAnswer
                            );

                    }



                    const correctText =
                        question.choices[
                            question.correctAnswer
                        ];


                    const correctLetter =
                        String.fromCharCode(
                            65 +
                            question.correctAnswer
                        );



                    const card =
                        document.createElement(
                            "article"
                        );



                    card.className =
                        correct
                        ?
                        "review-question-card correct-review"
                        :
                        "review-question-card incorrect-review";



                    let statusText;


                    let statusClass;



                    if (expired) {

                        statusText =
                            "⏱ Time Expired";


                        statusClass =
                            "expired-status";

                    }

                    else if (correct) {

                        statusText =
                            "✓ Correct";


                        statusClass =
                            "correct-status";

                    }

                    else {

                        statusText =
                            "✕ Incorrect";


                        statusClass =
                            "incorrect-status";

                    }



                    card.innerHTML = `


                        <div class="review-question-header">


                            <div>

                                <span class="review-question-number">

                                    Question ${index + 1}

                                </span>


                                <span class="review-level-badge">

                                    ${question.cognitiveLevel}

                                </span>


                                <span class="challenge-review-topic">

                                    ${getTopicTitle(question.topic)}

                                </span>

                            </div>


                            <span
                                class="
                                    review-status
                                    ${statusClass}
                                "
                            >

                                ${statusText}

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
                                        correct
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

                                    ${
                                        expired
                                        ?
                                        "Time Expired — No Answer"
                                        :
                                        studentLetter +
                                        ". " +
                                        studentText
                                    }

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
                                    ${correctText}

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
                                        "Review the related lesson for additional information."
                                    }

                                </p>

                            </div>


                        </div>


                    `;



                    challengeReviewList
                        .appendChild(
                            card
                        );

                }

            );

        }



        // =====================================================
        // BACK TO RESULTS
        // =====================================================

        document.getElementById(
            "challengeBackResultButton"
        )
        .addEventListener(

            "click",

            function () {


                challengeReviewSection
                    .classList
                    .add(
                        "hidden"
                    );


                challengeResultCard
                    .classList
                    .remove(
                        "hidden"
                    );

            }

        );



        // =====================================================
        // RETRY
        // =====================================================

        document.getElementById(
            "challengeRetryButton"
        )
        .addEventListener(

            "click",

            function () {

                startNewChallenge();

            }

        );



        document.getElementById(
            "challengeReviewRetryButton"
        )
        .addEventListener(

            "click",

            function () {

                startNewChallenge();

            }

        );



        // =====================================================
        // TOPIC TITLE
        // =====================================================

        function getTopicTitle(
            topicID
        ) {


            const topic =
                topics.find(

                    function (item) {

                        return (
                            item.id ===
                            topicID
                        );

                    }

                );



            if (topic) {

                return topic.title;

            }


            return "Politics and Governance";

        }



        // =====================================================
        // SHUFFLE
        // =====================================================

        function shuffleArray(
            array
        ) {


            const copy =
                [...array];



            for (
                let i =
                    copy.length - 1;

                i > 0;

                i--
            ) {


                const j =
                    Math.floor(
                        Math.random()
                        *
                        (
                            i + 1
                        )
                    );


                const temp =
                    copy[i];


                copy[i] =
                    copy[j];


                copy[j] =
                    temp;

            }



            return copy;

        }


    }
);