var express = require("express");
var router = express.Router();

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const passport = require("passport");
const postController = require("../controllers/postController");

const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
// Posts

router.get("/posts", postController.posts_get);

router.post(
    "/posts",
    passport.authenticate("jwt", { session: false }),
    postController.create_post
);

router.get("/posts/:id", postController.get_single_post);

router.put(
    "/posts/:id",
    passport.authenticate("jwt", { session: false }),
    postController.update_post
);

router.delete(
    "/posts/:id",
    passport.authenticate("jwt", { session: false }),
    postController.delete_post
);

router.post("/posts/:postid/comments", commentController.create_comment);


router.get(
    "/posts/:postid/comments/:commentid",
    commentController.get_comment
);


router.get("/posts/:postid/comments", commentController.get_comments);


router.put(
    "/posts/:postid/comments/:commentid",
    passport.authenticate("jwt", { session: false }),
    commentController.update_comment
);


router.delete(
    "/posts/:postid/comments",
    passport.authenticate("jwt", { session: false }),
    commentController.delete_post_comments
);


router.delete(
    "/posts/:postid/comments/:commentid",
    passport.authenticate("jwt", { session: false }),
    commentController.delete_comment
);


// router.post("/sign-up", userController.signup);

 router.post("/login", userController.login);

 router.get("/logout", userController.logout);

module.exports = router;
