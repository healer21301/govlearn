console.log("GovLearn website loaded successfully.");


// START LEARNING BUTTON
const startLearningButton =
    document.getElementById("startLearningButton");

startLearningButton.addEventListener(
    "click",
    function () {

        document
            .getElementById("topics")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// PRACTICE BUTTON
const practiceButton =
    document.getElementById("practiceButton");

practiceButton.addEventListener(
    "click",
    function () {

        document
            .getElementById("assessments")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// =====================================================
// STUDY ASSISTANT
// =====================================================

const assistantButton =
    document.getElementById(
        "assistantButton"
    );

if (assistantButton) {

    assistantButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "assistant.html";

        }
    );

}



// =====================================
// TOPIC BUTTONS
// =====================================

const topicButtons =
    document.querySelectorAll(
        ".topic-btn"
    );


topicButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                const topicID =
                    this.dataset.topic;


                window.location.href =
                    "topic.html?id=" +
                    topicID;

            }
        );

    }
);

// =====================================================
// HOMEPAGE PROGRESS PREVIEW
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        if (
            typeof GovLearnProgress ===
            "undefined"
        ) {

            return;

        }


        const homeTitle =
            document.getElementById(
                "homeProgressTitle"
            );


        const homeText =
            document.getElementById(
                "homeProgressText"
            );


        if (
            !homeTitle ||
            !homeText
        ) {

            return;

        }


        const stats =
            GovLearnProgress
                .getOverallStatistics();


        if (
            stats.totalAttempts === 0
        ) {

            homeTitle.textContent =
                "No activity yet";


            homeText.textContent =
                "Complete your first practice quiz to begin tracking your progress.";


            return;

        }


        homeTitle.textContent =
            stats.average +
            "% Overall Average";


        homeText.textContent =
            stats.totalAttempts +
            " learning activities completed • Best performance: " +
            stats.best +
            "%";

    }
);