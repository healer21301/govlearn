console.log("Topic page loaded.");


// ========================================
// GET TOPIC ID FROM URL
// ========================================

const parameters =
    new URLSearchParams(
        window.location.search
    );

const topicID =
    parameters.get("id");


// ========================================
// FIND SELECTED TOPIC
// ========================================

const selectedTopic =
    topics.find(
        topic =>
            topic.id === topicID
    );


// ========================================
// TOPIC NOT FOUND
// ========================================

if (!selectedTopic) {

    document.getElementById(
        "topicTitle"
    ).textContent =
        "Topic Not Found";


    document.getElementById(
        "topicCompetency"
    ).textContent =
        "Please return to the homepage and select a valid topic.";

}


// ========================================
// DISPLAY SELECTED TOPIC
// ========================================

else {

    displayTopicInformation();

    displayConcepts();

    displayScenario();

    displayTakeaways();

}



// ========================================
// BASIC TOPIC INFORMATION
// ========================================

function displayTopicInformation() {

    // PAGE TITLE

    document.title =
        selectedTopic.title +
        " | GovLearn";


    // FIND TOPIC NUMBER

    const topicIndex =
        topics.findIndex(
            topic =>
                topic.id === topicID
        );


    document.getElementById(
        "topicNumber"
    ).textContent =
        "Topic " +
        String(
            topicIndex + 1
        ).padStart(
            2,
            "0"
        );


    // TITLE

    document.getElementById(
        "topicTitle"
    ).textContent =
        selectedTopic.title;


    // COMPETENCY

    document.getElementById(
        "topicCompetency"
    ).textContent =
        selectedTopic.competency;


    document.getElementById(
        "learningCompetency"
    ).textContent =
        selectedTopic.competency;


    // TOS ITEMS

    document.getElementById(
        "topicItems"
    ).textContent =
        selectedTopic.items;


    // LESSON TITLE

    document.getElementById(
        "lessonTitle"
    ).textContent =
        selectedTopic.title;


    // LESSON OVERVIEW

    document.getElementById(
        "lessonIntroduction"
    ).textContent =
        selectedTopic.overview;


    // COGNITIVE LEVELS

    const cognitiveContainer =
        document.getElementById(
            "cognitiveLevels"
        );


    cognitiveContainer.innerHTML = "";


    selectedTopic
        .cognitiveLevels
        .forEach(
            function(level) {

                const badge =
                    document.createElement(
                        "span"
                    );


                badge.className =
                    "cognitive-badge";


                badge.textContent =
                    level;


                cognitiveContainer
                    .appendChild(
                        badge
                    );

            }
        );

}



// ========================================
// DISPLAY KEY CONCEPTS
// ========================================

function displayConcepts() {

    const conceptContainer =
        document.getElementById(
            "conceptList"
        );


    conceptContainer.innerHTML = "";


    selectedTopic
        .concepts
        .forEach(
            function(concept, index) {

                const conceptCard =
                    document.createElement(
                        "div"
                    );


                conceptCard.className =
                    "concept-card";


                conceptCard.innerHTML = `

                    <div class="concept-heading">

                        <span class="concept-number">
                            ${index + 1}
                        </span>

                        <h3>
                            ${concept.term}
                        </h3>

                    </div>


                    <p class="concept-definition">
                        ${concept.definition}
                    </p>


                    <div class="concept-example">

                        <strong>
                            Example:
                        </strong>

                        <span>
                            ${concept.example}
                        </span>

                    </div>

                `;


                conceptContainer
                    .appendChild(
                        conceptCard
                    );

            }
        );

}



// ========================================
// DISPLAY ANALYSIS SCENARIO
// ========================================

function displayScenario() {

    document.getElementById(
        "scenarioTitle"
    ).textContent =
        selectedTopic.scenario.title;


    document.getElementById(
        "scenarioText"
    ).textContent =
        selectedTopic.scenario.text;


    document.getElementById(
        "scenarioQuestion"
    ).textContent =
        selectedTopic.scenario.question;


    document.getElementById(
        "scenarioGuide"
    ).textContent =
        selectedTopic.scenario.guide;

}



// ========================================
// DISPLAY KEY TAKEAWAYS
// ========================================

function displayTakeaways() {

    const takeawayContainer =
        document.getElementById(
            "takeawayList"
        );


    takeawayContainer.innerHTML = "";


    selectedTopic
        .takeaways
        .forEach(
            function(takeaway) {

                const listItem =
                    document.createElement(
                        "li"
                    );


                listItem.textContent =
                    takeaway;


                takeawayContainer
                    .appendChild(
                        listItem
                    );

            }
        );

}




// ========================================
// PRACTICE BUTTON
// ========================================

const practiceButton =
    document.getElementById(
        "practiceTopicButton"
    );


practiceButton.addEventListener(
    "click",
    function() {

        window.location.href =
            "quiz.html?id=" +
            topicID;

    }
);



// =====================================================
// OPEN STUDY ASSISTANT FOR THIS TOPIC
// =====================================================

const assistantTopicButton =
    document.getElementById(
        "assistantTopicButton"
    );


if (assistantTopicButton) {

    assistantTopicButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "assistant.html?topic="
                +
                topicID;

        }
    );

}