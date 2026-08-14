// NumberOnWings shared navigation
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("header");

    if (!header) {
        return;
    }

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const links = [
        { href: "index.html", label: "home" },
        { href: "videos.html", label: "videos" },
        { href: "tools.html", label: "tools" },
        { href: "puzzles.html", label: "puzzles" },
        { href: "dontclick.html", label: "don't click", dangerous: true }
    ];

    const navLinks = links
        .map(link => {
            const classes = [];

            if (currentPage === link.href) {
                classes.push("active");
            }

            if (link.dangerous) {
                classes.push("danger-zone");
            }

            const classAttribute =
                classes.length > 0
                    ? ` class="${classes.join(" ")}"`
                    : "";

            return `
                <a href="${link.href}"${classAttribute}>
                    ${link.label}
                </a>
            `;
        })
        .join("");

    header.innerHTML = `
        <div class="nav-shell">
            <a class="logo" href="index.html">
                <img src="IMG_3098.png" alt="IrAcoNAl mascot" class="logo-img">
                <span>Number<span>OnWings</span></span>
            </a>
            <nav aria-label="Main navigation">
                ${navLinks}
            </nav>
        </div>
    `;
});
