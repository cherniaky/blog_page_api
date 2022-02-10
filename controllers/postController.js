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
    body("title").trim().escape(),
    body("text").trim().escape(),

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
        const { title, text } = req.body;
        const author = req.user.username;
        const post = new Post({
            author,
            title,
            text,
            date: Date.now(),
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

exports.update_post = async function (req, res, next) {
    try {
        let post = await Post.findById(req.params.id);
        post.title = req.body.title;
        post.author = req.body.author;
        post.text = req.body.text;
        //post.description = req.body.description;
        post = await post.save();
        if (!post) {
            return res.status(404).json({ msg: "updated failed" });
        }
        res.status(200).json({ msg: "updated sucessfuly" });
    } catch (err) {
        next(err);
    }
};

exports.delete_post = async function (req, res, next) {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res
                .status(404)
                .json({ err: `posts with id ${req.params.id} not found` });
        }
        res.status(200).json({
            msg: `post ${req.params.id} deleted sucessfuly`,
        });
    } catch (err) {
        next(err);
    }
};
