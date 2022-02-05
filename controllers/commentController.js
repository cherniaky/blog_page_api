var express = require("express");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const { body, validationResult } = require("express-validator");


exports.create_comment = [
    body("text", "Empty text").trim().escape(),
    body("user", "Empty user").trim().escape(),

    async function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({
                data: req.body,
                errors: errors.array(),
            });
            return;
        }
        const { text, user } = req.body;
        const postId = req.params.postid;
        const comment = new Comment({ text, user, postId });
        let post = await Post.findById(postId);
        post.comments = [...post.comments, comment];
        post = await post.save();
        console.log("post.comments", post.comments);
        comment.save((err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ msg: `comment ${comment._id} sent` });
        });
    },
];