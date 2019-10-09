const mongoose = require("mongoose");

const Schema =  mongoose.Schema;
const noteSchema = new Schema({
    body: {
        type: String
    },
    article: {
        type: Schema.Types.ObjectId,
        ref: "Article"
    }

})
const note = mongoose.model("Note", noteSchema);

module.exports = note