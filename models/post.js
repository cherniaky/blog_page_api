const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true },
    text: { type: String, required: true },
    author: { type: String, required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    published: { type: Boolean , default: false },
    date: { type: Date },
    //imgUrl: { type: String },
    //likes: { type: Array, default: [] },
});

module.exports = mongoose.model("Post", PostSchema);
