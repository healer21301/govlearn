/* =========================================================
   GOVLEARN
   STEP 13 - SHARED WEBSITE UI + ERROR HANDLING
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        // =====================================================
        // MOBILE NAVIGATION
        // =====================================================

        setupMobileNavigation();


        // =====================================================
        // CONNECTION STATUS
        // =====================================================

        setupConnectionStatus();


        // =====================================================
        // BACK TO TOP
        // =====================================================

        setupBackToTop();


        // =====================================================
        // ACTIVE NAVIGATION
        // =====================================================

        highlightActiveNavigation();


    }
);



/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function setupMobileNavigation() {


    const navContainer =
        document.querySelector(
            ".nav-container"
        );


    const nav =
        navContainer
        ?
        navContainer.querySelector(
            "nav"
        )
        :
        null;


    if (
        !navContainer ||
        !nav
    ) {

        return;

    }



    // DON'T CREATE TWICE

    if (
        document.getElementById(
            "mobileMenuButton"
        )
    ) {

        return;

    }



    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.id =
        "mobileMenuButton";


    button.className =
        "mobile-menu-button";


    button.setAttribute(
        "aria-label",
        "Open navigation menu"
    );


    button.setAttribute(
        "aria-expanded",
        "false"
    );


    button.innerHTML = `

        <span></span>
        <span></span>
        <span></span>

    `;



    navContainer.appendChild(
        button
    );



    button.addEventListener(
        "click",
        function () {


            const open =
                nav.classList.toggle(
                    "mobile-open"
                );


            button.classList.toggle(
                "open",
                open
            );


            button.setAttribute(
                "aria-expanded",
                open
                ?
                "true"
                :
                "false"
            );


            button.setAttribute(
                "aria-label",
                open
                ?
                "Close navigation menu"
                :
                "Open navigation menu"
            );

        }
    );



    // CLOSE AFTER CLICKING NAV LINK

    nav
        .querySelectorAll(
            "a"
        )
        .forEach(

            function (
                link
            ) {

                link.addEventListener(
                    "click",
                    function () {

                        closeMobileMenu(
                            nav,
                            button
                        );

                    }
                );

            }

        );



    // ESC KEY

    document.addEventListener(
        "keydown",
        function (
            event
        ) {


            if (
                event.key ===
                "Escape"
            ) {

                closeMobileMenu(
                    nav,
                    button
                );

            }

        }
    );



    // RESIZE BACK TO DESKTOP

    window.addEventListener(
        "resize",
        function () {


            if (
                window.innerWidth >
                700
            ) {

                closeMobileMenu(
                    nav,
                    button
                );

            }

        }
    );

}



/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

function closeMobileMenu(
    nav,
    button
) {


    nav.classList.remove(
        "mobile-open"
    );


    button.classList.remove(
        "open"
    );


    button.setAttribute(
        "aria-expanded",
        "false"
    );


    button.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

}



/* =========================================================
   ONLINE / OFFLINE STATUS
========================================================= */

function setupConnectionStatus() {


    const banner =
        document.createElement(
            "div"
        );


    banner.id =
        "connectionStatusBanner";


    banner.className =
        "connection-status hidden";


    banner.setAttribute(
        "role",
        "status"
    );


    document.body.appendChild(
        banner
    );



    function showStatus(
        message,
        status
    ) {


        banner.textContent =
            message;


        banner.className =
            "connection-status "
            +
            status;


        banner.classList.remove(
            "hidden"
        );



        clearTimeout(
            banner.hideTimer
        );



        banner.hideTimer =
            setTimeout(

                function () {

                    banner
                        .classList
                        .add(
                            "hidden"
                        );

                },

                3500

            );

    }



    window.addEventListener(
        "offline",
        function () {

            showStatus(
                "You are offline. GovLearn will use saved content where available.",
                "offline-status"
            );

        }
    );



    window.addEventListener(
        "online",
        function () {

            showStatus(
                "Connection restored.",
                "online-status"
            );

        }
    );



    if (
        !navigator.onLine
    ) {

        showStatus(
            "You are offline. GovLearn is using saved content.",
            "offline-status"
        );

    }

}



/* =========================================================
   BACK TO TOP BUTTON
========================================================= */

function setupBackToTop() {


    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.id =
        "backToTopButton";


    button.className =
        "back-to-top hidden";


    button.setAttribute(
        "aria-label",
        "Back to top"
    );


    button.innerHTML =
        "↑";



    document.body.appendChild(
        button
    );



    window.addEventListener(
        "scroll",
        function () {


            if (
                window.scrollY >
                500
            ) {

                button
                    .classList
                    .remove(
                        "hidden"
                    );

            }

            else {

                button
                    .classList
                    .add(
                        "hidden"
                    );

            }

        }
    );



    button.addEventListener(
        "click",
        function () {


            window.scrollTo({

                top:
                    0,

                behavior:
                    "smooth"

            });

        }
    );

}



/* =========================================================
   ACTIVE NAVIGATION LINK
========================================================= */

function highlightActiveNavigation() {


    const links =
        document.querySelectorAll(
            ".main-header nav a"
        );


    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
        ||
        "index.html";



    links.forEach(

        function (
            link
        ) {


            const href =
                link.getAttribute(
                    "href"
                );


            if (!href) {

                return;

            }



            const linkPage =
                href
                    .split("#")[0]
                    .split("?")[0];



            if (
                linkPage ===
                currentPage
            ) {

                link.classList.add(
                    "active-nav-link"
                );

            }


            else if (

                currentPage ===
                "index.html"

                &&

                (
                    linkPage ===
                    ""
                    ||
                    linkPage ===
                    "index.html"
                )

            ) {

                link.classList.add(
                    "active-nav-link"
                );

            }

        }

    );

}



/* =========================================================
   FRIENDLY ERROR HANDLING
========================================================= */

window.addEventListener(
    "error",
    function (
        event
    ) {


        /*
         * Keep full information in developer console.
         */

        console.error(
            "GovLearn detected an error:",
            event.error
            ||
            event.message
        );


        showWebsiteErrorNotice();

    }
);



window.addEventListener(
    "unhandledrejection",
    function (
        event
    ) {


        console.error(
            "GovLearn promise error:",
            event.reason
        );


        showWebsiteErrorNotice();

    }
);



/* =========================================================
   ERROR NOTICE
========================================================= */

let websiteErrorNoticeShown =
    false;


function showWebsiteErrorNotice() {


    if (
        websiteErrorNoticeShown
    ) {

        return;

    }


    websiteErrorNoticeShown =
        true;



    const notice =
        document.createElement(
            "div"
        );


    notice.className =
        "website-error-notice";


    notice.innerHTML = `

        <div>

            <strong>
                Something did not load correctly.
            </strong>

            <span>
                Refresh the page. If the problem continues,
                return to the homepage.
            </span>

        </div>

        <button
            type="button"
            aria-label="Close error notice"
        >
            ×
        </button>

    `;



    document.body.appendChild(
        notice
    );



    const closeButton =
        notice.querySelector(
            "button"
        );


    closeButton.addEventListener(
        "click",
        function () {

            notice.remove();

            websiteErrorNoticeShown =
                false;

        }
    );

}