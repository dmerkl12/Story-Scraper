const express = require("express");
// Initialize Express
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");

const Note = require("../models/note")
const Article = require("../models/article")

module.exports = function (app){
    app.get("/", function(req, res){
        Article.find( {saved: false }, function(err, data) {
            const hbsObject = {
                article: data
            }
            console.log(hbsObject)
            res.render("index", hbsObject)
        } )
    })
    app.get("/saved", function(req, res){
        Article.find( {saved: true })
        .populate("notes")
        .exec(function(err, articles) {
            const hbsSaved = {
                article: articles
            }
            res.render("saved", hbsSaved)
        })
    })
    // A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".css-6p6lnl").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find("h2")
          .text()
          .trim();
  
        result.summary = $(this)
          .find("p")
          .text()
          .trim();
  
          result.link = "https://www.nytimes.com" + $(this)
          .find("a")
          .attr("href")
  
        // Create a new Article using the `result` object built from scraping
        const entry = new Article(result)
        entry.save(function(err, doc){
            if (err){
                console.log(err)
            }
          })
        })
        console.log("Scrape Complete")
      })
  })
}
