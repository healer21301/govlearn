/* =========================================================
   GOVLEARN PROGRESS SYSTEM
   STEP 9 - PROGRESS + LEARNING ANALYSIS
========================================================= */

const GovLearnProgress = (() => {

    const STORAGE_KEY =
        "govlearn_progress_v1";


    const MAX_ATTEMPTS =
        100;



    // =====================================================
    // DEFAULT DATA
    // =====================================================

    function createEmptyProgress() {

        return {

            version: 2,

            practiceAttempts: [],

            challengeAttempts: []

        };

    }



    // =====================================================
    // LOAD
    // =====================================================

    function load() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!saved) {

                return createEmptyProgress();

            }


            const parsed =
                JSON.parse(saved);


            if (
                !parsed ||
                typeof parsed !== "object"
            ) {

                return createEmptyProgress();

            }


            if (
                !Array.isArray(
                    parsed.practiceAttempts
                )
            ) {

                parsed.practiceAttempts = [];

            }


            if (
                !Array.isArray(
                    parsed.challengeAttempts
                )
            ) {

                parsed.challengeAttempts = [];

            }


            return parsed;

        }

        catch (error) {

            console.error(
                "Unable to load GovLearn progress:",
                error
            );


            return createEmptyProgress();

        }

    }



    // =====================================================
    // SAVE
    // =====================================================

    function save(data) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

        }

        catch (error) {

            console.error(
                "Unable to save GovLearn progress:",
                error
            );

        }

    }



    // =====================================================
    // ATTEMPT ID
    // =====================================================

    function createAttemptID() {

        return (

            Date.now().toString()

            +

            "-"

            +

            Math.random()
                .toString(16)
                .slice(2)

        );

    }



    // =====================================================
    // SAVE PRACTICE ATTEMPT
    // =====================================================

    function savePracticeAttempt(
        attempt
    ) {

        const data =
            load();


        const record = {

            id:
                createAttemptID(),

            type:
                "practice",

            date:
                new Date()
                    .toISOString(),

            topicId:
                attempt.topicId,

            topicTitle:
                attempt.topicTitle,

            score:
                attempt.score,

            total:
                attempt.total,

            percentage:
                attempt.percentage,

            answers:
                Array.isArray(
                    attempt.answers
                )
                ?
                attempt.answers
                :
                []

        };


        data.practiceAttempts.push(
            record
        );


        if (
            data.practiceAttempts.length
            >
            MAX_ATTEMPTS
        ) {

            data.practiceAttempts =
                data.practiceAttempts.slice(
                    -MAX_ATTEMPTS
                );

        }


        save(data);


        return record;

    }



    // =====================================================
    // SAVE CHALLENGE ATTEMPT
    // =====================================================

    function saveChallengeAttempt(
        attempt
    ) {

        const data =
            load();


        const record = {

            id:
                createAttemptID(),

            type:
                "challenge",

            date:
                new Date()
                    .toISOString(),

            score:
                attempt.score,

            total:
                attempt.total,

            percentage:
                attempt.percentage,

            expired:
                attempt.expired || 0,

            answers:
                Array.isArray(
                    attempt.answers
                )
                ?
                attempt.answers
                :
                []

        };


        data.challengeAttempts.push(
            record
        );


        if (
            data.challengeAttempts.length
            >
            MAX_ATTEMPTS
        ) {

            data.challengeAttempts =
                data.challengeAttempts.slice(
                    -MAX_ATTEMPTS
                );

        }


        save(data);


        return record;

    }



    // =====================================================
    // ALL ATTEMPTS
    // =====================================================

    function getAllAttempts() {

        const data =
            load();


        const attempts = [

            ...data.practiceAttempts,

            ...data.challengeAttempts

        ];


        attempts.sort(

            function (
                a,
                b
            ) {

                return (

                    new Date(
                        b.date
                    )

                    -

                    new Date(
                        a.date
                    )

                );

            }

        );


        return attempts;

    }



    // =====================================================
    // OVERALL STATISTICS
    // =====================================================

    function getOverallStatistics() {

        const data =
            load();


        const allAttempts = [

            ...data.practiceAttempts,

            ...data.challengeAttempts

        ];


        const practiceCount =
            data.practiceAttempts.length;


        const challengeCount =
            data.challengeAttempts.length;


        let average = 0;

        let best = 0;


        if (
            allAttempts.length > 0
        ) {

            const percentages =
                allAttempts.map(

                    function (
                        attempt
                    ) {

                        return (
                            attempt.percentage
                        );

                    }

                );


            const total =
                percentages.reduce(

                    function (
                        sum,
                        value
                    ) {

                        return (
                            sum +
                            value
                        );

                    },

                    0

                );


            average =
                Math.round(
                    total /
                    percentages.length
                );


            best =
                Math.max(
                    ...percentages
                );

        }


        return {

            totalAttempts:
                allAttempts.length,

            practiceCount,

            challengeCount,

            average,

            best

        };

    }



    // =====================================================
    // TOPIC STATISTICS
    // Practice Quiz averages
    // =====================================================

    function getTopicStatistics() {

        const data =
            load();


        const topicMap = {};


        data.practiceAttempts
            .forEach(

                function (
                    attempt
                ) {

                    if (
                        !topicMap[
                            attempt.topicId
                        ]
                    ) {

                        topicMap[
                            attempt.topicId
                        ] = {

                            topicId:
                                attempt.topicId,

                            title:
                                attempt.topicTitle,

                            attempts: [],

                            average: 0,

                            best: 0,

                            latest: 0,

                            change: 0

                        };

                    }


                    topicMap[
                        attempt.topicId
                    ]
                    .attempts
                    .push(
                        attempt
                    );

                }

            );



        Object.values(
            topicMap
        )
        .forEach(

            function (
                topic
            ) {

                const percentages =
                    topic.attempts.map(

                        function (
                            attempt
                        ) {

                            return (
                                attempt.percentage
                            );

                        }

                    );


                topic.average =
                    Math.round(

                        percentages.reduce(

                            function (
                                total,
                                percentage
                            ) {

                                return (
                                    total +
                                    percentage
                                );

                            },

                            0

                        )

                        /

                        percentages.length

                    );


                topic.best =
                    Math.max(
                        ...percentages
                    );


                const chronological =
                    [...topic.attempts]
                        .sort(

                            function (
                                a,
                                b
                            ) {

                                return (

                                    new Date(
                                        a.date
                                    )

                                    -

                                    new Date(
                                        b.date
                                    )

                                );

                            }

                        );


                topic.latest =
                    chronological[
                        chronological.length - 1
                    ].percentage;


                if (
                    chronological.length >=
                    2
                ) {

                    topic.change =

                        topic.latest

                        -

                        chronological[
                            chronological.length - 2
                        ].percentage;

                }

            }

        );


        return topicMap;

    }



    // =====================================================
    // GET ALL QUESTION PERFORMANCE
    // =====================================================

    function getQuestionPerformance() {

        const data =
            load();


        const answers = [];


        data.practiceAttempts
            .forEach(

                function (
                    attempt
                ) {

                    attempt.answers.forEach(

                        function (
                            answer
                        ) {

                            answers.push({

                                ...answer,

                                source:
                                    "practice",

                                attemptDate:
                                    attempt.date

                            });

                        }

                    );

                }

            );



        data.challengeAttempts
            .forEach(

                function (
                    attempt
                ) {

                    attempt.answers.forEach(

                        function (
                            answer
                        ) {

                            answers.push({

                                ...answer,

                                source:
                                    "challenge",

                                attemptDate:
                                    attempt.date

                            });

                        }

                    );

                }

            );


        return answers;

    }



    // =====================================================
    // CREATE PERFORMANCE BUCKET
    // =====================================================

    function createPerformanceBucket(
        id,
        title
    ) {

        return {

            id:
                id,

            title:
                title,

            total:
                0,

            correct:
                0,

            incorrect:
                0,

            expired:
                0,

            accuracy:
                0

        };

    }



    // =====================================================
    // CALCULATE BUCKET ACCURACY
    // =====================================================

    function calculateBucket(
        bucket
    ) {

        if (
            bucket.total === 0
        ) {

            bucket.accuracy = 0;

            return bucket;

        }


        bucket.accuracy =
            Math.round(

                (
                    bucket.correct
                    /
                    bucket.total
                )

                *

                100

            );


        return bucket;

    }



    // =====================================================
    // GET TOPIC TITLE
    // =====================================================

    function getTopicTitle(
        topicID
    ) {

        if (
            typeof topics !==
            "undefined"
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


            if (topic) {

                return (
                    topic.title
                );

            }

        }


        return (
            topicID ||
            "Unknown Topic"
        );

    }



    // =====================================================
    // LEARNING ANALYSIS
    // =====================================================

    function getLearningAnalysis() {

        const answers =
            getQuestionPerformance();


        const topicPerformance = {};

        const cognitivePerformance = {};


        // =============================================
        // CREATE INITIAL TOPIC BUCKETS
        // =============================================

        if (
            typeof topics !==
            "undefined"
        ) {

            topics.forEach(

                function (
                    topic
                ) {

                    topicPerformance[
                        topic.id
                    ] =
                        createPerformanceBucket(

                            topic.id,

                            topic.title

                        );

                }

            );

        }



        // =============================================
        // ANALYZE EACH SAVED ANSWER
        // =============================================

        answers.forEach(

            function (
                answer
            ) {


                // -----------------------------------------
                // TOPIC
                // -----------------------------------------

                const topicID =
                    answer.topic;


                if (
                    !topicPerformance[
                        topicID
                    ]
                ) {

                    topicPerformance[
                        topicID
                    ] =
                        createPerformanceBucket(

                            topicID,

                            getTopicTitle(
                                topicID
                            )

                        );

                }



                const topicBucket =
                    topicPerformance[
                        topicID
                    ];


                topicBucket.total++;


                if (
                    answer.correct
                ) {

                    topicBucket.correct++;

                }

                else {

                    topicBucket.incorrect++;

                }


                if (
                    answer.expired
                ) {

                    topicBucket.expired++;

                }



                // -----------------------------------------
                // COGNITIVE LEVEL
                // -----------------------------------------

                const level =
                    answer.cognitiveLevel
                    ||
                    "Unknown";


                if (
                    !cognitivePerformance[
                        level
                    ]
                ) {

                    cognitivePerformance[
                        level
                    ] =
                        createPerformanceBucket(

                            level,

                            level

                        );

                }



                const cognitiveBucket =
                    cognitivePerformance[
                        level
                    ];


                cognitiveBucket.total++;


                if (
                    answer.correct
                ) {

                    cognitiveBucket.correct++;

                }

                else {

                    cognitiveBucket.incorrect++;

                }


                if (
                    answer.expired
                ) {

                    cognitiveBucket.expired++;

                }

            }

        );



        // =============================================
        // FINALIZE TOPIC ACCURACY
        // =============================================

        Object.values(
            topicPerformance
        )
        .forEach(

            function (
                bucket
            ) {

                calculateBucket(
                    bucket
                );

            }

        );



        // =============================================
        // FINALIZE COGNITIVE ACCURACY
        // =============================================

        Object.values(
            cognitivePerformance
        )
        .forEach(

            function (
                bucket
            ) {

                calculateBucket(
                    bucket
                );

            }

        );



        // =============================================
        // TOPICS WITH DATA
        // =============================================

        const topicsWithData =
            Object.values(
                topicPerformance
            )
            .filter(

                function (
                    topic
                ) {

                    return (
                        topic.total > 0
                    );

                }

            );



        // Prefer topics with at least 2 answers
        // before identifying weakest/strongest.

        let reliableTopics =
            topicsWithData.filter(

                function (
                    topic
                ) {

                    return (
                        topic.total >= 2
                    );

                }

            );


        if (
            reliableTopics.length === 0
        ) {

            reliableTopics =
                topicsWithData;

        }



        // =============================================
        // SORT TOPICS
        // =============================================

        const sortedTopics =
            [...reliableTopics]
                .sort(

                    function (
                        a,
                        b
                    ) {

                        return (
                            a.accuracy
                            -
                            b.accuracy
                        );

                    }

                );



        const weakestTopic =
            sortedTopics.length > 0
            ?
            sortedTopics[0]
            :
            null;



        const strongestTopic =
            sortedTopics.length > 0
            ?
            sortedTopics[
                sortedTopics.length - 1
            ]
            :
            null;



        // =============================================
        // COGNITIVE LEVELS WITH DATA
        // =============================================

        const cognitiveWithData =
            Object.values(
                cognitivePerformance
            )
            .filter(

                function (
                    level
                ) {

                    return (
                        level.total > 0
                    );

                }

            );



        let reliableCognitive =
            cognitiveWithData.filter(

                function (
                    level
                ) {

                    return (
                        level.total >= 2
                    );

                }

            );


        if (
            reliableCognitive.length === 0
        ) {

            reliableCognitive =
                cognitiveWithData;

        }



        const sortedCognitive =
            [...reliableCognitive]
                .sort(

                    function (
                        a,
                        b
                    ) {

                        return (
                            a.accuracy
                            -
                            b.accuracy
                        );

                    }

                );



        const weakestCognitive =
            sortedCognitive.length > 0
            ?
            sortedCognitive[0]
            :
            null;



        const strongestCognitive =
            sortedCognitive.length > 0
            ?
            sortedCognitive[
                sortedCognitive.length - 1
            ]
            :
            null;



        // =============================================
        // WEAK AREAS
        // =============================================

        const weakTopics =
            topicsWithData

            .filter(

                function (
                    topic
                ) {

                    return (
                        topic.accuracy < 70
                    );

                }

            )

            .sort(

                function (
                    a,
                    b
                ) {

                    return (
                        a.accuracy
                        -
                        b.accuracy
                    );

                }

            );



        return {

            totalAnswers:
                answers.length,

            topicPerformance:
                topicPerformance,

            cognitivePerformance:
                cognitivePerformance,

            weakestTopic:
                weakestTopic,

            strongestTopic:
                strongestTopic,

            weakestCognitive:
                weakestCognitive,

            strongestCognitive:
                strongestCognitive,

            weakTopics:
                weakTopics

        };

    }



    // =====================================================
    // RESET
    // =====================================================

    function reset() {

        localStorage.removeItem(
            STORAGE_KEY
        );

    }



    // =====================================================
    // PUBLIC API
    // =====================================================

    return {

        load,

        savePracticeAttempt,

        saveChallengeAttempt,

        getAllAttempts,

        getTopicStatistics,

        getOverallStatistics,

        getQuestionPerformance,

        getLearningAnalysis,

        reset

    };

})();