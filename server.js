const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");


const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);



const db = require("./models");

// Set the port of our application
// process.env.PORT lets the port be set by Heroku

const PORT = process.env.PORT || 3000;



// Initialize Express
const app = express();



// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Make public a static folder
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
// mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://localhost/27017", { useNewUrlParser: true });

const dbc = mongoose.connection;

//Show any mongoose errors
dbc.on("error", function (error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
dbc.once("open", function () {
  console.log("Mongoose connection successful.");
});


////////////

app.get("/", function (req, res) {
  db.Article.find({ "saved": false }, function (err, data) {
    const hbsObject = {
      article: data
    }
    console.log(hbsObject)
    res.render("index", hbsObject)
  })
})
app.get("/saved", function (req, res) {
  db.Article.find({ saved: true })
    .populate("notes")
    .then(function (err, articles) {
      const hbsSaved = {
        article: articles
      }
      res.render("saved", hbsSaved)
    })
})
// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with axios
  axios.get("https://www.nytimes.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $(".css-6p6lnl").each(function (i, element) {
      // Save an empty result object
      let result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();

      result.summary = $(this)
        .children("a")
        .text();

      result.link = $(this)
        .children("a")
        .attr("href")

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function (dbArticle) {
          console.log(dbArticle);
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    res.send("Scrape Complete");
  });
});


app.get("/articles", function (req, res) {
  db.Article.find({}, function (err, doc) {
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
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")

    .then(function (dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//I couldn't get the articles to be saved.

// app.get("articles/saved", function (req, res) {

//   db.articles.find({ "saved": true })
//     .limit(10)
//     .exec(function (err, data) {
//       res.render("saved", { article: data });
//       if (err) throw err;
//     })
// });

// Route for saving/updating an Article's associated Note
app.post("/articles/saved/:id", function (req, res) {
  // Use the article id to find and update its saved boolean
  db.Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })

    .then(function (err, doc) {

      if (err) {
        console.log(err);
      } else {

        res.send(doc);
      }
    });
});

app.delete("/articles/delete", function (req, res) {
  db.Article.remove({}, function (err, data) {
    if (err) {
      res.json({ deleted: false })
    }
    else {
      res.json({ deleted: true })
      console.log("deleted")
    }
  })
});





// Start the server
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});