const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    user: { type: String, required: true, maxlength: 30 },
    text: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId , ref: "Post", required: true },
    timestamp: { type: Date },
});

module.exports = mongoose.model("Comment", CommentSchema);
