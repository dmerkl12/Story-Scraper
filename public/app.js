const axios = require("axios")

document.getElementById("scrapeButton").addEventListener("click", ()=> {
    axios.get("/scrape").then((response)=> {
        console.log("Scrape Complete");
        window.location = "/"
    })
})



// Handle Clear all Articles button
document.getElementById("clear").addEventListener("click", ()=> {
    axios.get("/articles/clear").then((response)=> {

        
        window.location = "/"
    })
});