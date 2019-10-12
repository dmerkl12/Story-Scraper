
document.getElementById("scrapeButton").addEventListener("click", ()=> {
    axios.get("/scrape").then((response)=> {
        console.log("Scrape Complete");
        window.location = "/"
    }).catch((err) => {
        console.log(err)
    })
})



// Handle Clear all Articles button
document.getElementById("clear").addEventListener("click", () => {
    axios.delete("/delete").then((response) => {
        console.log("cleared");
        window.location = "/";
    }).catch((err) => {
        console.log(err)
    })
});



const SaveButtons = document.getElementsByClassName("SaveButton");
for (let i = 0; i < SaveButtons.length; i++) {

    SaveButtons[i].addEventListener("click", function () {
        const articleId = this.dataset.id;
        console.log(this, articleId);

        axios.put("/articles/favorite/" + articleId).then((response) => {

        }).catch((err) => {
            console.log(err);
        })
    })
}

const deleteSaveButtons = document.getElementsByClassName("deleteSaveButton");
for (let i = 0; i < deleteSaveButtons.length; i++) {

    deleteSaveButtons[i].addEventListener("click", function () {
        const articleId = this.dataset.id;

        axios.put("/articles/delete/" + articleId).then((response) => {

        }).catch((err) => {
            console.log(err)
        })
    })
}