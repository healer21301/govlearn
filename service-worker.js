/* =========================================================
   GOVLEARN SERVICE WORKER
   STEP 12 - OFFLINE SUPPORT
========================================================= */


/*
 * IMPORTANT:
 *
 * When we make major changes later,
 * change v1 to v2, v3, etc.
 */

const CACHE_NAME =
    "govlearn-cache-v4";



/* =========================================================
   CORE WEBSITE FILES
========================================================= */

const CORE_FILES = [

    "./",

    "index.html",

    "topic.html",

    "quiz.html",

    "challenge.html",

    "assessment.html",

    "progress.html",

    "focus.html",

    "assistant.html",

    "offline.html",


    "style.css",


    "json.js",

    "tos-config.js",

    "progress.js",

    "script.js",

    "topic.js",

    "quiz.js",

    "challenge.js",

    "assessment.js",

    "assessment-data.js",

    "focus.js",

    "assistant-data.js",

    "assistant.js",

    "pwa.js",

    "site-ui.js",


    "manifest.json",

    "icon-192.png",

    "icon-512.png"

];



/* =========================================================
   CREATE FULL URL

   This is important because it allows the same Service
   Worker to work both on:

   localhost/project-folder/

   and later:

   username.github.io/project-folder/
========================================================= */

function getFileURL(
    file
) {

    return new URL(
        file,
        self.registration.scope
    ).toString();

}



/* =========================================================
   INSTALL
========================================================= */

self.addEventListener(
    "install",

    function (
        event
    ) {


        console.log(
            "GovLearn Service Worker installing..."
        );


        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )

                .then(

                    async function (
                        cache
                    ) {


                        /*
                         * Cache files individually.
                         *
                         * This means one missing file will not
                         * cause the entire Service Worker
                         * installation to fail.
                         */

                        const results =
                            await Promise.allSettled(

                                CORE_FILES.map(

                                    function (
                                        file
                                    ) {

                                        return cache.add(
                                            getFileURL(
                                                file
                                            )
                                        );

                                    }

                                )

                            );



                        results.forEach(

                            function (
                                result,
                                index
                            ) {


                                if (
                                    result.status ===
                                    "rejected"
                                ) {

                                    console.warn(

                                        "Could not cache:",

                                        CORE_FILES[
                                            index
                                        ]

                                    );

                                }

                            }

                        );

                    }

                )

                .then(

                    function () {

                        return self.skipWaiting();

                    }

                )

        );

    }
);



/* =========================================================
   ACTIVATE
========================================================= */

self.addEventListener(
    "activate",

    function (
        event
    ) {


        console.log(
            "GovLearn Service Worker activated."
        );


        event.waitUntil(

            caches
                .keys()

                .then(

                    function (
                        cacheNames
                    ) {


                        return Promise.all(

                            cacheNames.map(

                                function (
                                    cacheName
                                ) {


                                    if (

                                        cacheName
                                            .startsWith(
                                                "govlearn-cache-"
                                            )

                                        &&

                                        cacheName !==
                                        CACHE_NAME

                                    ) {

                                        console.log(
                                            "Deleting old cache:",
                                            cacheName
                                        );


                                        return caches.delete(
                                            cacheName
                                        );

                                    }


                                    return Promise.resolve();

                                }

                            )

                        );

                    }

                )

                .then(

                    function () {

                        return self.clients.claim();

                    }

                )

        );

    }
);



/* =========================================================
   FETCH

   NETWORK FIRST:
   - Use the newest file while internet is available.
   - Fall back to cached copy when offline.

   This is also easier while we are still developing.
========================================================= */

self.addEventListener(
    "fetch",

    function (
        event
    ) {


        const request =
            event.request;



        /*
         * Only handle GET requests.
         */

        if (
            request.method !==
            "GET"
        ) {

            return;

        }



        const requestURL =
            new URL(
                request.url
            );



        /*
         * Ignore outside websites.
         */

        if (
            requestURL.origin !==
            self.location.origin
        ) {

            return;

        }



        event.respondWith(

            networkFirst(
                request
            )

        );

    }
);



/* =========================================================
   NETWORK FIRST
========================================================= */

async function networkFirst(
    request
) {


    try {


        // =============================================
        // TRY INTERNET / LOCAL SERVER FIRST
        // =============================================

        const networkResponse =
            await fetch(
                request
            );



        if (
            networkResponse
            &&
            networkResponse.ok
        ) {


            const cache =
                await caches.open(
                    CACHE_NAME
                );



            /*
             * Save latest version.
             */

            await cache.put(

                request,

                networkResponse.clone()

            );

        }



        return networkResponse;

    }

    catch (
        error
    ) {


        console.log(
            "Network unavailable. Checking GovLearn cache."
        );



        // =============================================
        // TRY EXACT CACHE
        // =============================================

        const exactCache =
            await caches.match(
                request
            );


        if (
            exactCache
        ) {

            return exactCache;

        }



        // =============================================
        // REMOVE QUERY STRING
        //
        // Example:
        //
        // topic.html?id=power
        //
        // becomes:
        //
        // topic.html
        //
        // This allows dynamic topic pages to work offline.
        // =============================================

        const cleanURL =
            new URL(
                request.url
            );


        cleanURL.search =
            "";



        const cleanCache =
            await caches.match(
                cleanURL.toString()
            );


        if (
            cleanCache
        ) {

            return cleanCache;

        }



        // =============================================
        // OFFLINE PAGE FOR NAVIGATION
        // =============================================

        if (
            request.mode ===
            "navigate"
        ) {


            const offlinePage =
                await caches.match(

                    getFileURL(
                        "offline.html"
                    )

                );


            if (
                offlinePage
            ) {

                return offlinePage;

            }

        }



        /*
         * If absolutely nothing exists,
         * allow the request to fail normally.
         */

        throw error;

    }

}