const bgBtn = document.querySelectorAll("li");

const selectedLi = localStorage.getItem("selectedLi");
if (selectedLi) {
    bgBtn.forEach((li) => {
        if (li.classList.contains(selectedLi)) {
            li.classList.add("active");
        } else {
            li.classList.remove("active");
        }
    });
}

bgBtn.forEach((link) => {
    link.addEventListener("click", function (event) {
        bgBtn.forEach((li) => {
            li.classList.remove("active");
        });
        this.classList.add("active");

        localStorage.setItem("selectedLi", this.classList[0]);
    });
});
