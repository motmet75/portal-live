(() => {
    "use strict";

    const toggle = document.querySelector("[data-nav-toggle]");
    const navigation = document.querySelector("[data-navigation]");
    if (toggle && navigation) {
        toggle.addEventListener("click", () => {
            const open = toggle.getAttribute("aria-expanded") === "true";
            toggle.setAttribute("aria-expanded", String(!open));
            navigation.classList.toggle("is-open", !open);
        });
    }

    document.querySelectorAll("[data-year]").forEach((year) => {
        year.textContent = String(new Date().getFullYear());
    });

    const header = document.querySelector("[data-header]");
    if (header) {
        const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
        updateHeader();
        window.addEventListener("scroll", updateHeader, { passive: true });
    }
})();
