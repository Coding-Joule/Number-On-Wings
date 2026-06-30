function openArticle() {
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
