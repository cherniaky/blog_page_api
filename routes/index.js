var express = require("express");
var router = express.Router();

const Post = require("../models/post");
const User = require("../models/user");
const Comment = require("../models/comment");

const passport = require("passport");
const postController = require("../controllers/postController");
const jwt = require("jsonwebtoken");

const commentController = require("../controllers/commentController");
const userController = require("../controllers/userController");
// Posts

const Authmidd = function (req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        // console.log(authorizationHeader);
        if (!authorizationHeader) {
            return res.status(401).send("Autorization");
        }
        //console.log(req.headers.autorization);

        const accessToken = authorizationHeader.split(" ")[1];

        //console.log(accessToken);
        if (!accessToken) {
            return res.status(402).send("Autorization");
        }

        // const userData = tokenService.validateAccessToken(accessToken);
        const { user: userData } = jwt.verify(
            accessToken,
            process.env.SECRET_KEY
        );
        //console.log(userData);
        if (!userData|| userData.username == "cherniak") {
            return res.status(403).send("Autorization");
        }

        req.user = userData;
        next();
    } catch (e) {
        return res.status(401).send("Autorization");
    }
};

router.get("/posts", postController.posts_get);

router.post("/posts", Authmidd, postController.create_post);

router.get("/posts/:id", postController.get_single_post);


router.put("/posts/:id", Authmidd, postController.update_post);

router.post("/posts/:id", Authmidd, postController.togglePostPublish);

router.delete("/posts/:id", Authmidd, postController.delete_post);

router.post("/posts/:postid/comments", commentController.create_comment);

router.get("/posts/:postid/comments/:commentid", commentController.get_comment);

router.get("/posts/:postid/comments", commentController.get_comments);

router.put(
    "/posts/:postid/comments/:commentid",
    Authmidd,
    commentController.update_comment
);

router.delete(
    "/posts/:postid/comments",
    Authmidd,
    commentController.delete_post_comments
);

router.delete(
    "/posts/:postid/comments/:commentid",
    Authmidd,
    commentController.delete_comment
);

router.post("/signup", userController.signup);

router.post("/login", userController.login);

router.get("/logout", userController.logout);

router.get("/refresh", userController.refresh);

module.exports = router;
