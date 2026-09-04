/* Shared navigation.

   The nav lives here rather than being copied into each page, so adding a
   link is a one-line change instead of an edit per file. Pages opt in with
   an empty <header class="nav"></header>; CSS reserves its height so the
   page does not jump when this fills it in. */
(function () {
    "use strict";

    // Pages get added here once they exist. Nothing links to a page that
    // has not been built.
    var LINKS = [];

    var header = document.querySelector("header.nav");
    if (!header) return;

    // "/next/index.html" and "/next/" are the same place to a reader.
    var here = window.location.pathname.replace(/index\.html$/, "");

    var parts = [
        '<a class="brand" href="/">',
            '<span class="brand-mark"><img src="/iraconal.png" alt=""></span>',
            "Number<em>OnWings</em>",
        "</a>"
    ];

    if (LINKS.length) {
        parts.push('<nav class="nav-links">');
        LINKS.forEach(function (link) {
            parts.push(
                '<a href="' + link.href + '"' +
                (link.href === here ? ' aria-current="page"' : "") + ">" +
                link.label + "</a>"
            );
        });
        parts.push("</nav>");
    }

    header.innerHTML = parts.join("");
})();
