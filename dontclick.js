// Easter egg: Displays a fake "hacking" interface when user clicks the trap button
window.addEventListener("load", function () {
    const btn = document.getElementById("trap-btn");

    if (!btn) return;

    btn.addEventListener("click", function () {
        // Replace page content with fake hacking interface
        document.body.innerHTML = `
            <div class="container">
                <h1>Hacking You...</h1>
                <p id="hack-message">Starting...</p>
                <div class="hack-bar">
                    <div id="hack-progress"></div>
                </div>
            </div>
        `;

        // Sequence of fake hacking messages to display
        const messages = [
            "Establishing secure connection...",
            "Accessing files...",
            "Downloading homework...",
            "Viewing browser history...",
            "Reading cookies...",
            "Scanning passwords...",
            "Analyzing search history...",
            "Locating secret documents...",
            "Compiling report...",
            "Finalizing hack..."
        ];

        let index = 0;
        let progress = 0;

        const messageEl = document.getElementById("hack-message");
        const progressEl = document.getElementById("hack-progress");

        // Update message and progress bar every 700ms
        const interval = setInterval(function () {
            messageEl.innerText = messages[index];
            progress += 10;
            progressEl.style.width = progress + "%";

            index++;

            if (index >= messages.length) {
                clearInterval(interval);

                // Show fake results after delay
                setTimeout(function () {
                    document.body.innerHTML = `
                        <div class="container">
                            <h1>Hack Complete.</h1>
                            <p>Files Found:</p>
                            <p>• [Redacted For Safety]</p>
                            <p>• [Redacted For Safety]</p>
                            <p>• [Redacted For Safety]</p>
                            <p></p>
                            <p>Site Visited In Web Browser:</p>
                            <p>numberonwings.com</p>
                            <p>ERROR: CAN'T VIEW WEBSITES OTHER THAT NUMBERONWIGS.COM DUE TO WEB BROWSER VERSION</p>
                            <p></p>
                            <p>Password:</p>
                            <p>******</p>
                            <p><strong>Security Level: Too High</strong></p>
                            <p>WHY ARE YOU LOOKING HERE THIS IS JUST A JOKE</p>
                        </div>
                    `;
                }, 800);
            }
        }, 700);
    });
});
