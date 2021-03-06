const mongoose = require("mongoose");

const note =  require("./note");
const Schema = mongoose.Schema

const articleSchema = new Schema ({
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "note"
    }]
})

const Article = mongoose.model("article", articleSchema);

// Export the model
module.exports = Article;