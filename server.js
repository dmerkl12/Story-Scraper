const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Set the port of our application
// process.env.PORT lets the port be set by Heroku
const PORT = process.env.PORT || 3010;

// Require all models
// const db = require("./models");


// Initialize Express
const app = express();



// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require("./routes/routes")(app);

// Make public a static folder
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "/public")));

//Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);
//mongoose.connect("mongodb://localhost/27017", { useNewUrlParser: true });

const db = mongoose.connection;

//Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Start the server
app.listen(PORT, function () {
  // Log (server-side) when our server has started
  console.log("Server listening on: http://localhost:" + PORT);
});