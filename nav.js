// Initialize and inject the shared navigation bar into all pages
document.addEventListener("DOMContentLoaded", function() {
    let header = document.querySelector("header");
    
    // Only proceed if a header element exists in the page
    if (header) {
        header.innerHTML = `
            <div class="logo">
                <img src="IMG_3098.png" alt="Mascot" class="logo-img">
                Number<span>OnWings</span>
            </div>
            <nav>
                <a href="index.html">home</a>
                <a href="videos.html">videos</a>
                <a href="tools.html">tools</a>
                <a href="puzzles.html">puzzles</a>
                <a href="dontclick.html" class="danger-zone">don't click here</a>
            </nav>
        `;
    }
});
