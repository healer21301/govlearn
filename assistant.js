document.addEventListener(
    "DOMContentLoaded",
    function () {


        console.log(
            "GovLearn Study Assistant loaded."
        );


        // =====================================================
        // ELEMENTS
        // =====================================================

        const topicButtonsContainer =
            document.getElementById(
                "assistantTopicButtons"
            );


        const quickQuestionsContainer =
            document.getElementById(
                "assistantQuickQuestions"
            );


        const messagesContainer =
            document.getElementById(
                "assistantMessages"
            );


        const assistantInput =
            document.getElementById(
                "assistantInput"
            );


        const askButton =
            document.getElementById(
                "assistantAskButton"
            );



        // =====================================================
        // URL TOPIC
        // =====================================================

        const urlParameters =
            new URLSearchParams(
                window.location.search
            );


        const requestedTopic =
            urlParameters.get(
                "topic"
            );


        let activeTopic =
            topics.some(
                function (topic) {

                    return (
                        topic.id ===
                        requestedTopic
                    );

                }
            )
            ?
            requestedTopic
            :
            "all";



        // =====================================================
        // BUILD FULL KNOWLEDGE BASE
        // =====================================================

        const knowledgeBase =
            buildKnowledgeBase();



        // =====================================================
        // INITIAL PAGE
        // =====================================================

        renderTopicButtons();

        renderQuickQuestions();

        renderProgressRecommendation();

        showWelcomeMessage();



        // =====================================================
        // BUILD KNOWLEDGE BASE FROM EXISTING LESSONS
        // =====================================================

        function buildKnowledgeBase() {


            const entries =
                [
                    ...assistantGuides
                ];



            topics.forEach(

                function (topic) {


                    // =========================================
                    // CONCEPTS
                    // =========================================

                    topic.concepts.forEach(

                        function (
                            concept,
                            index
                        ) {


                            entries.push({

                                id:
                                    "lesson-concept-"
                                    +
                                    topic.id
                                    +
                                    "-"
                                    +
                                    index,

                                topic:
                                    topic.id,

                                title:
                                    "What is "
                                    +
                                    concept.term
                                    +
                                    "?",

                                keywords: [

                                    concept.term,

                                    "what is "
                                    +
                                    concept.term,

                                    "define "
                                    +
                                    concept.term,

                                    "meaning of "
                                    +
                                    concept.term,

                                    "explain "
                                    +
                                    concept.term

                                ],

                                answer:
                                    concept.definition,

                                example:
                                    concept.example

                            });

                        }

                    );



                    // =========================================
                    // TOPIC SUMMARY
                    // =========================================

                    entries.push({

                        id:
                            "topic-summary-"
                            +
                            topic.id,

                        topic:
                            topic.id,

                        title:
                            "Summary of "
                            +
                            topic.title,

                        keywords: [

                            topic.title,

                            "summarize "
                            +
                            topic.title,

                            "summary "
                            +
                            topic.title,

                            "review "
                            +
                            topic.title,

                            "explain "
                            +
                            topic.title

                        ],

                        answer:
                            topic.overview,

                        bullets:
                            topic.takeaways

                    });



                    // =========================================
                    // SCENARIO GUIDE
                    // =========================================

                    if (
                        topic.scenario
                    ) {

                        entries.push({

                            id:
                                "scenario-"
                                +
                                topic.id,

                            topic:
                                topic.id,

                            title:
                                "Practice Scenario: "
                                +
                                topic.title,

                            keywords: [

                                "scenario "
                                +
                                topic.title,

                                "give me a scenario "
                                +
                                topic.title,

                                "practice scenario "
                                +
                                topic.title

                            ],

                            answer:
                                topic.scenario.text,

                            bullets: [

                                "Question: "
                                +
                                topic.scenario.question,

                                "Guide: "
                                +
                                topic.scenario.guide

                            ]

                        });

                    }

                }

            );



            return entries;

        }



        // =====================================================
        // TOPIC BUTTONS
        // =====================================================

        function renderTopicButtons() {


            topicButtonsContainer.innerHTML =
                "";



            createTopicButton(
                "all",
                "All Topics"
            );



            topics.forEach(

                function (topic) {

                    createTopicButton(
                        topic.id,
                        topic.title
                    );

                }

            );

        }



        function createTopicButton(
            topicID,
            label
        ) {


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "assistant-topic-button";


            button.textContent =
                label;



            if (
                activeTopic ===
                topicID
            ) {

                button.classList.add(
                    "active"
                );

            }



            button.addEventListener(
                "click",
                function () {


                    activeTopic =
                        topicID;


                    renderTopicButtons();

                    renderQuickQuestions();


                    const topicTitle =
                        topicID ===
                        "all"
                        ?
                        "all Politics and Governance topics"
                        :
                        getTopicTitle(
                            topicID
                        );


                    addAssistantTextMessage(

                        "Topic filter changed to "
                        +
                        topicTitle
                        +
                        ". Ask me a question or choose one of the quick questions."

                    );

                }
            );



            topicButtonsContainer
                .appendChild(
                    button
                );

        }



        // =====================================================
        // QUICK QUESTIONS
        // =====================================================

        function renderQuickQuestions() {


            quickQuestionsContainer.innerHTML =
                "";



            let availableEntries =
                knowledgeBase.filter(

                    function (entry) {

                        if (
                            activeTopic ===
                            "all"
                        ) {

                            return true;

                        }


                        return (
                            entry.topic ===
                            activeTopic
                        );

                    }

                );



            /*
             * Prefer overview / guide entries.
             */

            const guideEntries =
                availableEntries.filter(

                    function (entry) {

                        return (
                            !entry.id.startsWith(
                                "scenario-"
                            )
                        );

                    }

                );



            availableEntries =
                guideEntries.length > 0
                ?
                guideEntries
                :
                availableEntries;



            const selected =
                shuffleArray(
                    availableEntries
                )
                .slice(
                    0,
                    6
                );



            selected.forEach(

                function (entry) {


                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.className =
                        "assistant-quick-button";


                    button.textContent =
                        entry.title;



                    button.addEventListener(
                        "click",
                        function () {

                            askQuestion(
                                entry.title
                            );

                        }
                    );



                    quickQuestionsContainer
                        .appendChild(
                            button
                        );

                }

            );

        }



        // =====================================================
        // PERSONALIZED PROGRESS RECOMMENDATION
        // =====================================================

        function renderProgressRecommendation() {


            if (
                typeof GovLearnProgress ===
                "undefined"
            ) {

                return;

            }



            const analysis =
                GovLearnProgress
                    .getLearningAnalysis();



            const title =
                document.getElementById(
                    "recommendationTitle"
                );


            const text =
                document.getElementById(
                    "recommendationText"
                );


            const link =
                document.getElementById(
                    "recommendationLink"
                );



            if (
                !analysis ||
                !analysis.weakestTopic
            ) {

                title.textContent =
                    "Complete a practice activity";


                text.textContent =
                    "After completing Practice Quizzes or Timed Challenges, GovLearn can recommend which topic you should review first.";


                link.href =
                    "index.html#topics";


                link.textContent =
                    "Start Reviewing";


                return;

            }



            const weakest =
                analysis.weakestTopic;



            title.textContent =
                weakest.title;



            let recommendationText =

                "Your current accuracy in this area is "

                +

                weakest.accuracy

                +

                "%. Reviewing this topic may help improve your overall performance.";



            if (
                analysis.weakestCognitive
            ) {

                recommendationText +=

                    " Your current skill to improve is "

                    +

                    analysis
                        .weakestCognitive
                        .title

                    +

                    ".";

            }



            text.textContent =
                recommendationText;



            link.href =
                "assistant.html?topic="
                +
                weakest.id;



            link.textContent =
                "Review with Assistant";

        }



        // =====================================================
        // WELCOME MESSAGE
        // =====================================================

        function showWelcomeMessage() {


            if (
                activeTopic ===
                "all"
            ) {

                addAssistantTextMessage(

                    "Hello! I’m the GovLearn Study Assistant. Ask me about Politics and Governance concepts, or choose a topic and one of the quick questions."

                );

            }

            else {

                addAssistantTextMessage(

                    "You are currently reviewing "
                    +
                    getTopicTitle(
                        activeTopic
                    )
                    +
                    ". Ask a question about this topic or choose a quick question."

                );

            }

        }



        // =====================================================
        // ASK BUTTON
        // =====================================================

        askButton.addEventListener(
            "click",
            function () {


                const question =
                    assistantInput
                        .value
                        .trim();


                if (!question) {

                    return;

                }


                askQuestion(
                    question
                );

            }
        );



        // =====================================================
        // ENTER KEY
        // SHIFT + ENTER = NEW LINE
        // =====================================================

        assistantInput.addEventListener(
            "keydown",
            function (event) {


                if (
                    event.key ===
                    "Enter"
                    &&
                    !event.shiftKey
                ) {

                    event.preventDefault();


                    const question =
                        assistantInput
                            .value
                            .trim();


                    if (question) {

                        askQuestion(
                            question
                        );

                    }

                }

            }
        );



        // =====================================================
        // ASK QUESTION
        // =====================================================

        function askQuestion(
            question
        ) {


            addUserMessage(
                question
            );


            assistantInput.value =
                "";


            const matches =
                findBestMatches(
                    question
                );



            if (
                matches.length === 0
                ||
                matches[0].score < 5
            ) {

                showNoMatchResponse(
                    question
                );


                return;

            }



            const bestMatch =
                matches[0].entry;



            addKnowledgeResponse(
                bestMatch
            );



            /*
             * Show related suggestions if available.
             */

            const related =
                matches
                    .slice(
                        1,
                        4
                    )
                    .filter(

                        function (match) {

                            return (
                                match.score >=
                                4
                            );

                        }

                    );



            if (
                related.length > 0
            ) {

                addRelatedSuggestions(
                    related
                );

            }

        }



        // =====================================================
        // SEARCH / MATCH ENGINE
        // =====================================================

        function findBestMatches(
            query
        ) {


            const normalizedQuery =
                normalizeText(
                    query
                );


            const queryTokens =
                getUsefulTokens(
                    normalizedQuery
                );



            let searchableEntries =
                knowledgeBase;



            /*
             * Search selected topic first.
             */

            if (
                activeTopic !==
                "all"
            ) {

                const filtered =
                    knowledgeBase.filter(

                        function (entry) {

                            return (
                                entry.topic ===
                                activeTopic
                            );

                        }

                    );


                if (
                    filtered.length > 0
                ) {

                    searchableEntries =
                        filtered;

                }

            }



            const scored =
                searchableEntries.map(

                    function (entry) {


                        let score =
                            0;



                        const title =
                            normalizeText(
                                entry.title
                            );



                        if (
                            normalizedQuery ===
                            title
                        ) {

                            score += 50;

                        }



                        if (
                            title.includes(
                                normalizedQuery
                            )
                            &&
                            normalizedQuery.length >=
                            4
                        ) {

                            score += 15;

                        }



                        entry.keywords.forEach(

                            function (
                                keyword
                            ) {


                                const normalizedKeyword =
                                    normalizeText(
                                        keyword
                                    );



                                if (
                                    normalizedQuery ===
                                    normalizedKeyword
                                ) {

                                    score += 40;

                                }


                                else if (
                                    normalizedQuery.includes(
                                        normalizedKeyword
                                    )
                                ) {

                                    score +=

                                        15

                                        +

                                        normalizedKeyword
                                            .split(" ")
                                            .length;

                                }


                                else if (
                                    normalizedKeyword.includes(
                                        normalizedQuery
                                    )
                                    &&
                                    normalizedQuery.length >=
                                    4
                                ) {

                                    score += 8;

                                }

                            }

                        );



                        const entrySearchText =
                            normalizeText(

                                entry.title

                                +

                                " "

                                +

                                entry.keywords.join(
                                    " "
                                )

                                +

                                " "

                                +

                                entry.answer

                            );



                        queryTokens.forEach(

                            function (
                                token
                            ) {


                                if (
                                    entrySearchText
                                        .includes(
                                            token
                                        )
                                ) {

                                    score += 3;

                                }

                            }

                        );



                        if (
                            activeTopic !==
                            "all"
                            &&
                            entry.topic ===
                            activeTopic
                        ) {

                            score += 2;

                        }



                        return {

                            entry:
                                entry,

                            score:
                                score

                        };

                    }

                );



            scored.sort(

                function (
                    a,
                    b
                ) {

                    return (
                        b.score
                        -
                        a.score
                    );

                }

            );



            /*
             * If topic filter produces no useful result,
             * search all topics once.
             */

            if (
                activeTopic !==
                "all"
                &&
                (
                    scored.length === 0
                    ||
                    scored[0].score < 5
                )
            ) {

                const oldTopic =
                    activeTopic;


                activeTopic =
                    "all";


                const broadResult =
                    findBestMatches(
                        query
                    );


                activeTopic =
                    oldTopic;


                return broadResult;

            }



            return scored;

        }



        // =====================================================
        // NORMALIZE
        // =====================================================

        function normalizeText(
            text
        ) {

            return String(
                text
            )
            .toLowerCase()
            .replace(
                /[^a-z0-9\s-]/g,
                " "
            )
            .replace(
                /\s+/g,
                " "
            )
            .trim();

        }



        // =====================================================
        // USEFUL TOKENS
        // =====================================================

        function getUsefulTokens(
            text
        ) {


            const stopWords =
                new Set([

                    "a",
                    "an",
                    "and",
                    "are",
                    "as",
                    "at",
                    "be",
                    "between",
                    "can",
                    "define",
                    "do",
                    "does",
                    "explain",
                    "for",
                    "from",
                    "how",
                    "i",
                    "in",
                    "is",
                    "it",
                    "me",
                    "of",
                    "on",
                    "please",
                    "the",
                    "to",
                    "what",
                    "why",
                    "with"

                ]);



            return text
                .split(" ")
                .filter(

                    function (
                        token
                    ) {

                        return (
                            token.length >=
                            3
                            &&
                            !stopWords.has(
                                token
                            )
                        );

                    }

                );

        }



        // =====================================================
        // USER MESSAGE
        // =====================================================

        function addUserMessage(
            text
        ) {


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "assistant-message-row user-row";



            const bubble =
                document.createElement(
                    "div"
                );


            bubble.className =
                "assistant-message user-message";


            bubble.textContent =
                text;



            wrapper.appendChild(
                bubble
            );


            messagesContainer
                .appendChild(
                    wrapper
                );


            scrollMessages();

        }



        // =====================================================
        // SIMPLE ASSISTANT MESSAGE
        // =====================================================

        function addAssistantTextMessage(
            text
        ) {


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "assistant-message-row";



            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "assistant-message-avatar";


            avatar.textContent =
                "📘";



            const bubble =
                document.createElement(
                    "div"
                );


            bubble.className =
                "assistant-message assistant-message-bubble";


            bubble.textContent =
                text;



            wrapper.appendChild(
                avatar
            );


            wrapper.appendChild(
                bubble
            );


            messagesContainer
                .appendChild(
                    wrapper
                );


            scrollMessages();

        }



        // =====================================================
        // KNOWLEDGE RESPONSE
        // =====================================================

        function addKnowledgeResponse(
            entry
        ) {


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "assistant-message-row";



            const avatar =
                document.createElement(
                    "div"
                );


            avatar.className =
                "assistant-message-avatar";


            avatar.textContent =
                "📘";



            const bubble =
                document.createElement(
                    "div"
                );


            bubble.className =
                "assistant-message assistant-answer-card";



            // TOPIC

            const topicLabel =
                document.createElement(
                    "span"
                );


            topicLabel.className =
                "assistant-answer-topic";


            topicLabel.textContent =
                getTopicTitle(
                    entry.topic
                );



            // TITLE

            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                entry.title;



            // ANSWER

            const answer =
                document.createElement(
                    "p"
                );


            answer.textContent =
                entry.answer;



            bubble.appendChild(
                topicLabel
            );


            bubble.appendChild(
                title
            );


            bubble.appendChild(
                answer
            );



            // BULLETS

            if (
                Array.isArray(
                    entry.bullets
                )
                &&
                entry.bullets.length > 0
            ) {

                const list =
                    document.createElement(
                        "ul"
                    );


                entry.bullets.forEach(

                    function (
                        bullet
                    ) {

                        const item =
                            document.createElement(
                                "li"
                            );


                        item.textContent =
                            bullet;


                        list.appendChild(
                            item
                        );

                    }

                );


                bubble.appendChild(
                    list
                );

            }



            // EXAMPLE

            if (
                entry.example
            ) {

                const example =
                    document.createElement(
                        "div"
                    );


                example.className =
                    "assistant-example-box";



                const label =
                    document.createElement(
                        "strong"
                    );


                label.textContent =
                    "Example";



                const exampleText =
                    document.createElement(
                        "p"
                    );


                exampleText.textContent =
                    entry.example;



                example.appendChild(
                    label
                );


                example.appendChild(
                    exampleText
                );


                bubble.appendChild(
                    example
                );

            }



            // ACTIONS

            const actions =
                document.createElement(
                    "div"
                );


            actions.className =
                "assistant-answer-actions";



            const lessonLink =
                document.createElement(
                    "a"
                );


            lessonLink.href =
                "topic.html?id="
                +
                entry.topic;


            lessonLink.className =
                "assistant-small-link";


            lessonLink.textContent =
                "Review Lesson";



            const practiceLink =
                document.createElement(
                    "a"
                );


            practiceLink.href =
                "quiz.html?id="
                +
                entry.topic;


            practiceLink.className =
                "assistant-small-link";


            practiceLink.textContent =
                "Practice Topic";



            actions.appendChild(
                lessonLink
            );


            actions.appendChild(
                practiceLink
            );


            bubble.appendChild(
                actions
            );



            wrapper.appendChild(
                avatar
            );


            wrapper.appendChild(
                bubble
            );


            messagesContainer
                .appendChild(
                    wrapper
                );


            scrollMessages();

        }



        // =====================================================
        // RELATED SUGGESTIONS
        // =====================================================

        function addRelatedSuggestions(
            matches
        ) {


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "assistant-related-box";



            const label =
                document.createElement(
                    "span"
                );


            label.textContent =
                "You may also review:";



            wrapper.appendChild(
                label
            );



            matches.forEach(

                function (
                    match
                ) {


                    const button =
                        document.createElement(
                            "button"
                        );


                    button.type =
                        "button";


                    button.textContent =
                        match.entry.title;



                    button.addEventListener(
                        "click",
                        function () {

                            askQuestion(
                                match.entry.title
                            );

                        }
                    );



                    wrapper.appendChild(
                        button
                    );

                }

            );



            messagesContainer
                .appendChild(
                    wrapper
                );


            scrollMessages();

        }



        // =====================================================
        // NO MATCH
        // =====================================================

        function showNoMatchResponse(
            question
        ) {


            addAssistantTextMessage(

                "I could not find an exact explanation for that question in the current GovLearn lesson set. Try asking about one of the lesson concepts or choose a quick question from the left panel."

            );



            const fallbackEntries =
                knowledgeBase

                .filter(

                    function (
                        entry
                    ) {

                        return (
                            activeTopic ===
                            "all"
                            ||
                            entry.topic ===
                            activeTopic
                        );

                    }

                )

                .slice(
                    0,
                    3
                );



            if (
                fallbackEntries.length > 0
            ) {

                addRelatedSuggestions(

                    fallbackEntries.map(

                        function (
                            entry
                        ) {

                            return {

                                entry:
                                    entry,

                                score:
                                    1

                            };

                        }

                    )

                );

            }

        }



        // =====================================================
        // GET TOPIC TITLE
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
                "Politics and Governance"
            );

        }



        // =====================================================
        // SCROLL CHAT
        // =====================================================

        function scrollMessages() {


            requestAnimationFrame(

                function () {

                    messagesContainer
                        .scrollTop =
                        messagesContainer
                            .scrollHeight;

                }

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