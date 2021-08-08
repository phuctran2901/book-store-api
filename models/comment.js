const mongoose = require("mongoose");


const CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
    content: { type: String, required: true },
    reply: [
        {
            fullName: { type: String },
            avatar: { type: String },
            content: { type: String },
            date: { type: Date }
        }
    ]
}, { timestamps: true })

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;