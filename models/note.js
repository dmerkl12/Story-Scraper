const mongoose = require("mongoose");

const Schema =  mongoose.Schema;
const noteSchema = new Schema({
  // `title` is of type String
  title: String,
  // `body` is of type String
  body: String
});


const note = mongoose.model("note", noteSchema);

module.exports = note