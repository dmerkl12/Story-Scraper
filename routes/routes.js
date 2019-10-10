const express = require("express");
// Initialize Express
const app = express();

const axios = require("axios");
const cheerio = require("cheerio");

const Note = require("../models/note")
const Article = require("../models/article")

module.exports = function (app) {
  app.get("/", function (req, res) {
    Article.find({ saved: false }, function (err, data) {
      const hbsObject = {
        article: data
      }
      console.log(hbsObject)
      res.render("index", hbsObject)
    })
  })
  app.get("/saved", function (req, res) {
    Article.find({ saved: true })
      .populate("notes")
      .exec(function (err, articles) {
        const hbsSaved = {
          article: articles
        }
        res.render("saved", hbsSaved)
      })
  })
  // A GET route for scraping the echoJS website
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.nytimes.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $(".css-6p6lnl").each(function (i, element) {
        // Save an empty result object
        let result = {};

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
        entry.save(function (err, doc) {
          if (err) {
            console.log(err)
          }
        })
      })
      console.log("Scrape Complete")
    });
  });


  app.get("/articles", function (req, res) {
    Article.find({}, function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(doc)
      }
    });
  });
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")

      .exec(function (err, doc) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        if (err) {
          console.log(err)
        }
        else {
          res.send(doc);
        }
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/save/:id", function (req, res) {
    // Use the article id to find and update its saved boolean
    Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })

      .exec(function (err, doc) {

        if (err) {
          console.log(err);
        } else {

          res.send(doc);
        }
      });
  });

  app.post("/articles/delete/:id", function (req, res) {
    Article.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { saved: false, notes: [] } }
    )
      .exec(function (err, doc) {

        if (err) {
          console.log(err);
        } else {

          res.send(doc);
        }

      });
  });

//"post" a note
  app.post("/notes/save/:id", function (req, res) {
    let newNote = new Note({
      body: req.body.text,
      article: req.params.id
    });
    newNote.save(function (error, note) {
      if (error) {
        console.log(error);
      }
      else {
        // Use the article id to find and update it's notes
        Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { notes: note } }
        )
          .exec(function (err) {
            if (err) {
              console.log(err);
              res.send(err);
            } else {
              // Or send the note to the browser
              res.send(note);
            }
          });
        }
      });
  });

    app.delete("/articles/clear", function(req, res) {
      Article.remove({})
        .then(function() {
          return Note.remove({});
        })
        .then(function() {
          res.json({ ok: true });
        });
    });
  
}
