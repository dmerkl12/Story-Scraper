
document.getElementById("scrapeButton").addEventListener("click", ()=> {
    axios.get("/scrape").then((response)=> {
        console.log("Scrape Complete");
        window.location = "/";
    }).catch((err) => {
        console.log(err)
    })
})



// Handle Clear all Articles button
document.getElementById("clear").addEventListener("click", () => {
    axios.delete("/articles/delete").then((response) => {
        console.log("cleared");
        window.location = "/";
    }).catch((err) => {
        console.log(err)
    })
});



// const saveButtons = document.getElementById("SaveButton");
// for (let i = 0; i < saveButtons.length; i++) {

//     saveButtons[i].addEventListener("click", function () {
//         const articleId = this.dataset.id;
//         console.log(this, articleId);

//         axios.put("/articles/saved/" + articleId).then((response) => {
//             window.location = "/saved";
//         }).catch((err) => {
//             console.log(err);
//         })
//     })
// }

// const deleteArticleButton = document.getElementById("deleteArticleButton");
// for (let i = 0; i < deleteArticleButton.length; i++) {

//     deleteArticleButton[i].addEventListener("click", function () {
//         const articleId = this.dataset.id;

//         axios.put("/articles/delete/" + articleId).then((response) => {

//         }).catch((err) => {
//             console.log(err)
//         })
//     })
// }