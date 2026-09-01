"""Generate a single-file preview of NumberOnWings from the real source files.

Nothing here is hand-written site markup: the pages, stylesheet, scripts and
mascot are read straight off disk, so the preview cannot drift from the site.
The three pages become routes in one document because an Artifact is one file.
"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1]

PAGES = [("index", "index.html"), ("tools", "tools.html"), ("runaway", "runaway.html")]

def read(name):
    return open(os.path.join(ROOT, name), encoding="utf-8").read()

def body_of(html):
    inner = re.search(r"<body[^>]*>(.*)</body>", html, re.S).group(1)
    return re.sub(r'\s*<script src="[^"]+"></script>', "", inner).strip()

mascot = "data:image/png;base64," + base64.b64encode(
    open(os.path.join(ROOT, "assets/img/iraconal.png"), "rb").read()).decode()

routes = []
for key, filename in PAGES:
    content = body_of(read(filename))
    hidden = "" if key == "index" else " hidden"
    routes.append('<div class="route" id="route-%s"%s>\n%s\n</div>' % (key, hidden, content))

scripts = "\n".join(
    "/* ---- %s ---- */\n(function () {\n%s\n}());" % (f, read(f))
    for f in ["assets/js/game.js", "assets/js/problem.js",
              "assets/js/tools.js", "assets/js/runaway.js"])

# Preview chrome: the site's own tokens, so it recedes instead of competing.
chrome_css = """
/* ── preview chrome (not part of the site) ───────────────────────── */
.preview-tag {
    position: fixed;
    left: max(12px, env(safe-area-inset-left));
    bottom: max(12px, env(safe-area-inset-bottom));
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid var(--line);
    border-radius: 100px;
    background: rgba(19, 19, 23, 0.92);
    backdrop-filter: blur(8px);
    color: var(--fg-faint);
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.04em;
    pointer-events: none;
}
.preview-tag b { color: var(--accent); font-weight: 400; }
.preview-tag::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
}
@media (max-width: 560px) { .preview-tag .long { display: none; } }
"""

router_js = """
/* ---- preview router ----
   The real site is three separate documents; an Artifact is one. Links that
   would be page loads switch routes instead, and each switch fires a resize
   so the canvases size themselves once they are actually on screen. */
(function () {
    var routes = {
        "index.html": "route-index",
        "tools.html": "route-tools",
        "runaway.html": "route-runaway"
    };

    function show(id) {
        Object.keys(routes).forEach(function (file) {
            var el = document.getElementById(routes[file]);
            if (el) el.hidden = routes[file] !== id;
        });
        window.scrollTo(0, 0);
        window.dispatchEvent(new Event("resize"));
    }

    document.addEventListener("click", function (event) {
        var link = event.target.closest("a[href]");
        if (!link) return;
        var href = link.getAttribute("href");
        if (!routes[href]) return;          // external and in-page links behave normally
        event.preventDefault();
        show(routes[href]);
    });
}());
"""

# One copy of the drawing, assigned to every placement, instead of five
# copies of a 600KB data URI inlined into the markup.
mascot_js = """
(function () {
    var src = MASCOT_SRC;
    var nodes = document.querySelectorAll("img[data-mascot]");
    for (var i = 0; i < nodes.length; i++) nodes[i].src = src;
}());
"""

page = """<title>NumberOnWings</title>
<style>
%s
%s
</style>

%s

<p class="preview-tag"><span class="long">branch</span> <b>claude/homepage-design-nfu3z2</b></p>

<script>
%s
%s
%s
</script>
""" % (read("assets/css/site.css"), chrome_css, "\n\n".join(routes), mascot_js, scripts, router_js)

# The mascot ships inside the file: an Artifact cannot fetch a repo asset.
# The src is left off the tags and filled in once at runtime, so the drawing
# is carried in the document exactly once.
page = page.replace('src="assets/img/iraconal.png"', 'data-mascot')
page = page.replace("MASCOT_SRC", '"%s"' % mascot)

open(OUT, "w", encoding="utf-8").write(page)
print("wrote %s  (%.0f KB)" % (OUT, os.path.getsize(OUT) / 1024))
