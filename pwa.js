/* =========================================================
   GOVLEARN PWA SYSTEM
   ALWAYS-VISIBLE INSTALL BUTTON
========================================================= */

let govLearnInstallPrompt = null;



document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =====================================================
        // ELEMENTS
        // =====================================================

        const installButton =
            document.getElementById(
                "installGovLearnButton"
            );



        // =====================================================
        // SERVICE WORKER
        // =====================================================

        if (
            "serviceWorker"
            in
            navigator
        ) {


            window.addEventListener(
                "load",
                function () {


                    navigator
                        .serviceWorker
                        .register(
                            "service-worker.js"
                        )

                        .then(

                            function (
                                registration
                            ) {

                                console.log(
                                    "GovLearn offline support ready.",
                                    registration.scope
                                );

                            }

                        )

                        .catch(

                            function (
                                error
                            ) {

                                console.error(
                                    "GovLearn Service Worker registration failed:",
                                    error
                                );

                            }

                        );

                }
            );

        }



        // =====================================================
        // CHECK IF CURRENTLY RUNNING AS INSTALLED APP
        // =====================================================

        const isStandalone =
            window.matchMedia(
                "(display-mode: standalone)"
            ).matches

            ||

            window.navigator.standalone ===
            true;



        if (
            installButton
            &&
            isStandalone
        ) {

            installButton.textContent =
                "✓ GovLearn Installed";


            installButton.classList.add(
                "installed-pwa-button"
            );


            installButton.disabled =
                true;

        }



        // =====================================================
        // CHROME PROVIDES INSTALL PROMPT
        // =====================================================

        window.addEventListener(
            "beforeinstallprompt",
            function (
                event
            ) {


                /*
                 * Stop Chrome from showing its
                 * automatic installation banner.
                 */

                event.preventDefault();



                /*
                 * Save the event so our custom
                 * button can use it.
                 */

                govLearnInstallPrompt =
                    event;



                console.log(
                    "GovLearn installation is available."
                );



                if (
                    installButton
                    &&
                    !isStandalone
                ) {

                    installButton.disabled =
                        false;


                    installButton.textContent =
                        "📲 Install GovLearn";


                    installButton.classList.remove(
                        "installed-pwa-button"
                    );

                }

            }
        );



        // =====================================================
        // CUSTOM INSTALL BUTTON
        // =====================================================

        if (
            installButton
            &&
            !isStandalone
        ) {


            installButton.addEventListener(
                "click",
                async function () {


                    // =========================================
                    // REAL INSTALL PROMPT AVAILABLE
                    // =========================================

                    if (
                        govLearnInstallPrompt
                    ) {


                        govLearnInstallPrompt.prompt();



                        const choice =
                            await govLearnInstallPrompt
                                .userChoice;



                        console.log(
                            "GovLearn installation choice:",
                            choice.outcome
                        );



                        if (
                            choice.outcome ===
                            "accepted"
                        ) {

                            installButton.textContent =
                                "✓ GovLearn Installed";


                            installButton.classList.add(
                                "installed-pwa-button"
                            );

                        }



                        govLearnInstallPrompt =
                            null;


                        return;

                    }



                    // =========================================
                    // PROMPT IS NOT AVAILABLE
                    // =========================================

                    const alreadyStandalone =
                        window.matchMedia(
                            "(display-mode: standalone)"
                        ).matches;



                    if (
                        alreadyStandalone
                    ) {

                        alert(
                            "GovLearn is already installed on this device."
                        );


                        return;

                    }



                    /*
                     * Chrome may not provide the install event
                     * when the website has already been installed.
                     *
                     * Your screenshot showing 'Open in app'
                     * is one example.
                     */

                    alert(
                        "GovLearn may already be installed, or Chrome is handling installation from the browser toolbar.\n\nLook for “Open in app” or the install icon in the Chrome address bar."
                    );

                }
            );

        }



        // =====================================================
        // INSTALL COMPLETED
        // =====================================================

        window.addEventListener(
            "appinstalled",
            function () {


                console.log(
                    "GovLearn installed successfully."
                );



                govLearnInstallPrompt =
                    null;



                if (
                    installButton
                ) {

                    installButton.textContent =
                        "✓ GovLearn Installed";


                    installButton.classList.add(
                        "installed-pwa-button"
                    );


                    installButton.disabled =
                        true;

                }

            }
        );


    }
);