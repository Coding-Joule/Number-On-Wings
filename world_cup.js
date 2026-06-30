function toggleArticle() {
    const article = document.getElementById("article");

    if (article.style.display === "none") {
        article.style.display = "block";
        article.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        article.style.display = "none";
    }
}

function toggleBracket() {
    const bracket = document.getElementById("bracket");

    if (bracket.style.display === "none") {
        bracket.style.display = "block";
        bracket.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    } else {
        bracket.style.display = "none";
    }
}
