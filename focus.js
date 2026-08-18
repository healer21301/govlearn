document.addEventListener(
    "DOMContentLoaded",
    function () {


        console.log(
            "GovLearn Adaptive Focus Practice loaded."
        );


        // =====================================================
        // SETTINGS
        // =====================================================

        const FOCUS_QUIZ_SIZE =
            5;


        const PRIORITY_TOPIC_ITEMS =
            4;


        const MIXED_REVIEW_ITEMS =
            1;



        // =====================================================
        // STATE
        // =====================================================

        let analysis =
            null;


        let priorityTopic =
            null;


        let prioritySkill =
            null;


        let focusQuestions =
            [];


        let currentQuestionIndex =
            0;


        let studentAnswers =
            [];


        let latestScore =
            0;


        let latestPercentage =
            0;



        // =====================================================
        // ELEMENTS
        // =====================================================

        const startCard =
            document.getElementById(
                "focusStartCard"
            );


        const quizCard =
            document.getElementById(
                "focusQuizCard"
            );


        const resultCard =
            document.getElementById(
                "focusResultCard"
            );


        const reviewSection =
            document.getElementById(
                "focusReviewSection"
            );


        const noData =
            document.getElementById(
                "focusNoData"
            );


        const startActions =
            document.getElementById(
                "focusStartActions"
            );


        const startButton =
            document.getElementById(
                "startFocusButton"
            );


        const questionCounter =
            document.getElementById(
                "focusQuestionCounter"
            );


        const progressFill =
            document.getElementById(
                "focusProgressFill"
            );


        const questionLevel =
            document.getElementById(
                "focusQuestionLevel"
            );


        const questionTopic =
            document.getElementById(
                "focusQuestionTopic"
            );


        const questionText =
            document.getElementById(
                "focusQuestionText"
            );


        const answerOptions =
            document.getElementById(
                "focusAnswerOptions"
            );


        const previousButton =
            document.getElementById(
                "focusPreviousButton"
            );


        const nextButton =
            document.getElementById(
                "focusNextButton"
            );


        const reviewList =
            document.getElementById(
                "focusReviewList"
            );



        // =====================================================
        // INITIAL ANALYSIS
        // =====================================================

        initializeFocusAnalysis();



        // =====================================================
        // ANALYZE STUDENT
        // =====================================================

        function initializeFocusAnalysis() {


            if (
                typeof GovLearnProgress ===
                "undefined"
            ) {

                showNoData();

                return;

            }


            analysis =
                GovLearnProgress
                    .getLearningAnalysis();



            if (
                !analysis ||
                analysis.totalAnswers === 0 ||
                !analysis.weakestTopic
            ) {

                showNoData();

                return;

            }



            priorityTopic =
                analysis.weakestTopic;


            prioritySkill =
                analysis.weakestCognitive;



            document.getElementById(
                "focusWeakTopic"
            ).textContent =

                priorityTopic.title

                +

                " — "

                +

                priorityTopic.accuracy

                +

                "%";



            if (
                prioritySkill
            ) {

                document.getElementById(
                    "focusWeakSkill"
                ).textContent =

                    prioritySkill.title

                    +

                    " — "

                    +

                    prioritySkill.accuracy

                    +

                    "%";

            }

            else {

                document.getElementById(
                    "focusWeakSkill"
                ).textContent =
                    "Not enough data yet";

            }


        }



        // =====================================================
        // NO DATA
        // =====================================================

        function showNoData() {


            document.getElementById(
                "focusWeakTopic"
            ).textContent =
                "Not enough data";


            document.getElementById(
                "focusWeakSkill"
            ).textContent =
                "Not enough data";


            noData
                .classList
                .remove(
                    "hidden"
                );


            startActions
                .classList
                .add(
                    "hidden"
                );

        }



        // =====================================================
        // START FOCUS PRACTICE
        // =====================================================

        startButton.addEventListener(
            "click",
            function () {

                startFocusPractice();

            }
        );



        // =====================================================
        // START PRACTICE
        // =====================================================

        function startFocusPractice() {


            // Recalculate weakness every time.

            analysis =
                GovLearnProgress
                    .getLearningAnalysis();


            priorityTopic =
                analysis.weakestTopic;


            prioritySkill =
                analysis.weakestCognitive;



            if (!priorityTopic) {

                alert(
                    "Not enough progress data is available yet."
                );

                return;

            }



            focusQuestions =
                buildAdaptiveQuestionSet();



            if (
                focusQuestions.length === 0
            ) {

                alert(
                    "There are currently no questions available for Focus Practice."
                );

                return;

            }



            currentQuestionIndex =
                0;


            latestScore =
                0;


            latestPercentage =
                0;


            studentAnswers =
                new Array(
                    focusQuestions.length
                ).fill(null);



            startCard
                .classList
                .add(
                    "hidden"
                );


            resultCard
                .classList
                .add(
                    "hidden"
                );


            reviewSection
                .classList
                .add(
                    "hidden"
                );


            quizCard
                .classList
                .remove(
                    "hidden"
                );



            document.getElementById(
                "focusPriorityBadge"
            ).textContent =
                "Focus: " +
                priorityTopic.title;



            loadFocusQuestion();



            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }



        // =====================================================
        // BUILD ADAPTIVE QUESTION SET
        // =====================================================

        function buildAdaptiveQuestionSet() {


            const selected = [];


            const usedIDs =
                new Set();



            const topicPool =
                questionBank.filter(

                    function (
                        question
                    ) {

                        return (
                            question.topic ===
                            priorityTopic.id
                        );

                    }

                );



            // =================================================
            // FIRST PRIORITY:
            // Weak Topic + Weak Cognitive Level
            // =================================================

            if (
                prioritySkill
            ) {

                const exactWeakQuestions =
                    shuffleArray(

                        topicPool.filter(

                            function (
                                question
                            ) {

                                return (
                                    question.cognitiveLevel
                                    ===
                                    prioritySkill.title
                                );

                            }

                        )

                    );



                exactWeakQuestions
                    .slice(
                        0,
                        2
                    )
                    .forEach(

                        function (
                            question
                        ) {

                            addUniqueQuestion(
                                question,
                                selected,
                                usedIDs
                            );

                        }

                    );

            }



            // =================================================
            // SECOND PRIORITY:
            // More Questions from Weak Topic
            // =================================================

            const remainingPriorityQuestions =
                shuffleArray(
                    topicPool
                );



            for (
                const question
                of remainingPriorityQuestions
            ) {


                if (
                    selected.length >=
                    PRIORITY_TOPIC_ITEMS
                ) {

                    break;

                }


                addUniqueQuestion(
                    question,
                    selected,
                    usedIDs
                );

            }



            // =================================================
            // THIRD PRIORITY:
            // Another Weak Topic if available
            // =================================================

            const otherWeakTopics =
                analysis.weakTopics.filter(

                    function (
                        topic
                    ) {

                        return (
                            topic.id !==
                            priorityTopic.id
                        );

                    }

                );



            if (
                selected.length <
                FOCUS_QUIZ_SIZE
                &&
                otherWeakTopics.length > 0
            ) {

                const secondWeakTopic =
                    otherWeakTopics[0];


                const secondaryPool =
                    shuffleArray(

                        questionBank.filter(

                            function (
                                question
                            ) {

                                return (
                                    question.topic ===
                                    secondWeakTopic.id
                                );

                            }

                        )

                    );



                for (
                    const question
                    of secondaryPool
                ) {


                    if (
                        selected.length >=
                        FOCUS_QUIZ_SIZE
                    ) {

                        break;

                    }


                    addUniqueQuestion(
                        question,
                        selected,
                        usedIDs
                    );

                }

            }



            // =================================================
            // FINAL FALLBACK:
            // Mixed Review
            // =================================================

            if (
                selected.length <
                FOCUS_QUIZ_SIZE
            ) {

                const remainingQuestions =
                    shuffleArray(

                        questionBank.filter(

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
                    of remainingQuestions
                ) {


                    if (
                        selected.length >=
                        FOCUS_QUIZ_SIZE
                    ) {

                        break;

                    }


                    addUniqueQuestion(
                        question,
                        selected,
                        usedIDs
                    );

                }

            }



            return shuffleArray(
                selected.slice(
                    0,
                    FOCUS_QUIZ_SIZE
                )
            );

        }



        // =====================================================
        // ADD UNIQUE QUESTION
        // =====================================================

        function addUniqueQuestion(
            question,
            selected,
            usedIDs
        ) {


            if (!question) {

                return;

            }


            if (
                usedIDs.has(
                    question.id
                )
            ) {

                return;

            }


            selected.push(
                question
            );


            usedIDs.add(
                question.id
            );

        }



        // =====================================================
        // LOAD QUESTION
        // =====================================================

        function loadFocusQuestion() {


            const question =
                focusQuestions[
                    currentQuestionIndex
                ];



            questionCounter.textContent =
                "Question " +
                (
                    currentQuestionIndex +
                    1
                )
                +
                " of "
                +
                focusQuestions.length;



            const progress =
                (
                    (
                        currentQuestionIndex +
                        1
                    )
                    /
                    focusQuestions.length
                )
                *
                100;



            progressFill
                .style
                .width =
                progress +
                "%";



            questionLevel.textContent =
                question.cognitiveLevel;



            questionTopic.textContent =
                getTopicTitle(
                    question.topic
                );



            questionText.textContent =
                question.question;



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



                    if (
                        studentAnswers[
                            currentQuestionIndex
                        ]
                        ===
                        choiceIndex
                    ) {

                        button
                            .classList
                            .add(
                                "selected"
                            );

                    }



                    button.addEventListener(
                        "click",
                        function () {

                            selectFocusAnswer(
                                choiceIndex
                            );

                        }
                    );



                    answerOptions.appendChild(
                        button
                    );

                }

            );



            previousButton.disabled =
                currentQuestionIndex === 0;



            if (
                currentQuestionIndex ===
                focusQuestions.length - 1
            ) {

                nextButton.textContent =
                    "Finish Focus Practice";

            }

            else {

                nextButton.textContent =
                    "Next Question";

            }

        }



        // =====================================================
        // SELECT ANSWER
        // =====================================================

        function selectFocusAnswer(
            choiceIndex
        ) {


            studentAnswers[
                currentQuestionIndex
            ] =
                choiceIndex;



            const buttons =
                answerOptions
                    .querySelectorAll(
                        ".answer-option"
                    );



            buttons.forEach(

                function (
                    button
                ) {

                    button
                        .classList
                        .remove(
                            "selected"
                        );

                }

            );



            if (
                buttons[
                    choiceIndex
                ]
            ) {

                buttons[
                    choiceIndex
                ]
                    .classList
                    .add(
                        "selected"
                    );

            }

        }



        // =====================================================
        // PREVIOUS
        // =====================================================

        previousButton.addEventListener(
            "click",
            function () {


                if (
                    currentQuestionIndex > 0
                ) {

                    currentQuestionIndex--;


                    loadFocusQuestion();

                }

            }
        );



        // =====================================================
        // NEXT
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
                    focusQuestions.length - 1
                ) {

                    currentQuestionIndex++;


                    loadFocusQuestion();

                }

                else {

                    finishFocusPractice();

                }

            }
        );



        // =====================================================
        // FINISH
        // =====================================================

        function finishFocusPractice() {


            let score =
                0;



            focusQuestions.forEach(

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



            latestScore =
                score;



            latestPercentage =
                Math.round(

                    (
                        score
                        /
                        focusQuestions.length
                    )
                    *
                    100

                );



            document.getElementById(
                "focusFinalScore"
            ).textContent =
                score
                +
                "/"
                +
                focusQuestions.length;



            document.getElementById(
                "focusFinalPercentage"
            ).textContent =
                latestPercentage
                +
                "%";



            document.getElementById(
                "focusCorrect"
            ).textContent =
                score;



            document.getElementById(
                "focusIncorrect"
            ).textContent =
                focusQuestions.length
                -
                score;



            document.getElementById(
                "focusResultTopic"
            ).textContent =
                priorityTopic.title;



            // =================================================
            // RESULT MESSAGE
            // =================================================

            const message =
                document.getElementById(
                    "focusResultMessage"
                );



            if (
                latestPercentage >=
                80
            ) {

                message.textContent =
                    "Great improvement. Continue practicing until this topic is no longer identified as a weak area.";

            }

            else if (
                latestPercentage >=
                60
            ) {

                message.textContent =
                    "You're improving. Review the incorrect answers and continue practicing this area.";

            }

            else {

                message.textContent =
                    "This area still needs attention. Review the lesson and explanations before trying again.";

            }



            // =================================================
            // SAVE PROGRESS
            // =================================================

            saveFocusProgress();



            quizCard
                .classList
                .add(
                    "hidden"
                );


            reviewSection
                .classList
                .add(
                    "hidden"
                );


            resultCard
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
        // SAVE FOCUS PROGRESS
        //
        // We save this as a normal practice attempt so it
        // contributes to topic mastery and weak-area detection.
        // =====================================================

        function saveFocusProgress() {


            if (
                typeof GovLearnProgress ===
                "undefined"
            ) {

                return;

            }



            const progressAnswers =
                focusQuestions.map(

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
                                false,

                            adaptive:
                                true

                        };

                    }

                );



            /*
             * Focus Practice can contain questions from
             * more than one topic.
             *
             * We save the attempt under the main priority
             * topic because that is the target area.
             */

            GovLearnProgress
                .savePracticeAttempt({

                    topicId:
                        priorityTopic.id,

                    topicTitle:
                        priorityTopic.title,

                    score:
                        latestScore,

                    total:
                        focusQuestions.length,

                    percentage:
                        latestPercentage,

                    answers:
                        progressAnswers

                });

        }



        // =====================================================
        // REVIEW BUTTON
        // =====================================================

        document.getElementById(
            "focusReviewButton"
        )
        .addEventListener(

            "click",

            function () {


                buildFocusReview();


                resultCard
                    .classList
                    .add(
                        "hidden"
                    );


                reviewSection
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

        function buildFocusReview() {


            document.getElementById(
                "focusReviewTopic"
            ).textContent =
                priorityTopic.title;



            document.getElementById(
                "focusReviewScore"
            ).textContent =
                latestScore
                +
                " / "
                +
                focusQuestions.length;



            document.getElementById(
                "focusReviewAccuracy"
            ).textContent =
                latestPercentage
                +
                "%";



            reviewList.innerHTML =
                "";



            focusQuestions.forEach(

                function (
                    question,
                    index
                ) {


                    const selected =
                        studentAnswers[
                            index
                        ];



                    const correct =
                        selected
                        ===
                        question.correctAnswer;



                    const selectedText =
                        question.choices[
                            selected
                        ];



                    const selectedLetter =
                        String.fromCharCode(
                            65 +
                            selected
                        );



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
                                    ${
                                        correct
                                        ?
                                        "correct-status"
                                        :
                                        "incorrect-status"
                                    }
                                "
                            >

                                ${
                                    correct
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

                                    ${selectedLetter}.
                                    ${selectedText}

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



                    reviewList
                        .appendChild(
                            card
                        );

                }

            );

        }



        // =====================================================
        // BACK TO RESULT
        // =====================================================

        document.getElementById(
            "focusBackResultButton"
        )
        .addEventListener(

            "click",

            function () {


                reviewSection
                    .classList
                    .add(
                        "hidden"
                    );


                resultCard
                    .classList
                    .remove(
                        "hidden"
                    );

            }

        );



        // =====================================================
        // PRACTICE AGAIN
        // =====================================================

        document.getElementById(
            "focusAgainButton"
        )
        .addEventListener(

            "click",

            function () {

                restartAdaptivePractice();

            }

        );



        document.getElementById(
            "focusReviewAgainButton"
        )
        .addEventListener(

            "click",

            function () {

                restartAdaptivePractice();

            }

        );



        // =====================================================
        // RESTART
        // =====================================================

        function restartAdaptivePractice() {


            /*
             * Important:
             * Recalculate progress before making the next
             * adaptive quiz.
             *
             * If the learner improved, GovLearn can change
             * the priority topic automatically.
             */

            analysis =
                GovLearnProgress
                    .getLearningAnalysis();


            priorityTopic =
                analysis.weakestTopic;


            prioritySkill =
                analysis.weakestCognitive;



            if (!priorityTopic) {

                window.location.href =
                    "progress.html";

                return;

            }



            focusQuestions =
                buildAdaptiveQuestionSet();



            currentQuestionIndex =
                0;


            studentAnswers =
                new Array(
                    focusQuestions.length
                ).fill(null);



            resultCard
                .classList
                .add(
                    "hidden"
                );


            reviewSection
                .classList
                .add(
                    "hidden"
                );


            quizCard
                .classList
                .remove(
                    "hidden"
                );



            document.getElementById(
                "focusPriorityBadge"
            ).textContent =
                "Focus: "
                +
                priorityTopic.title;



            loadFocusQuestion();



            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }



        // =====================================================
        // TOPIC TITLE
        // =====================================================

        function getTopicTitle(
            topicID
        ) {


            const topic =
                topics.find(

                    function (
                        item
                    ) {

                        return (
                            item.id ===
                            topicID
                        );

                    }

                );



            return (
                topic
                ?
                topic.title
                :
                topicID
            );

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


                const randomIndex =
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
                    copy[
                        randomIndex
                    ];


                copy[
                    randomIndex
                ] =
                    temp;

            }



            return copy;

        }


    }
);