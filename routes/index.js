var express = require("express");
var router = express.Router();

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const postController = require("../controllers/postController")

// Posts

router.get("/posts", postController.posts_get);

router.post("/posts", postController.create_post);

router.get("/posts/:id", postController.get_single_post);



module.exports = router;
