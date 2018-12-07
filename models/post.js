var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
    title: String,
    image: [String],
    desc: String,
    content: String,
    created: Date,
    author: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        username: String
    },
    comments: [
        { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }
    ]
});

module.exports = mongoose.model("Post", productSchema);
