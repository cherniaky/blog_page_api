var express = require("express");

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const { body, validationResult } = require("express-validator");

exports.posts_get = function (req, res, next) {
    Post.find({}, function (err, posts) {
        if (err) return next(err);

        res.json({ posts: posts });
    });
    // res.json({ title: "posts" });
};


exports.create_post = [
    body("author", "Empty name").trim().escape(),
    body("title", "text").trim().escape(),

    function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({
                data: req.body,
                errors: errors.array(),
            });
            return;
        }
        // title, date - default to created time, author, published - default to false
        const { author, title, text, description } = req.body;
        const post = new Post({
            author,
            title,
            text,
            description,
        });
        post.save((err) => {
            if (err) {
                return next(err);
            }
            res.status(200).json({ msg: "post sent" });
        });
    },
];

exports.get_single_post = async function (req, res, next) {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res
                .status(404)
                .json({ err: `post with id ${req.params.id} not found` });
        }
        res.status(200).json({ post });
    } catch (err) {
        next(err);
    }
};