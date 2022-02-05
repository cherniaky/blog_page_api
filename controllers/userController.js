const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

exports.signup = [
    body("username", "Empty name").trim().escape(),
    body("password").isLength(6).withMessage("Minimum length 6 characters"),
    body("confirm-password").custom((value, { req }) => {
        if (value !== req.body.password) {
            return next("Password confirmation does not match password");
        }

        return true;
    }),
    async (req, res, next) => {
        // console.log("async");
        passport.authenticate(
            "signup",
            { session: false },
            (err, user, info) => {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.json({
                        username: req.body.username,
                        errors: errors.array(),
                    });
                }
                if (err) {
                    return next(err);
                }
                res.json({
                    message: "Signed-up sucessfuly",
                    user: req.user,
                });
            }
        )(req, res, next);
    },
];

exports.login = async (req, res, next) => {
    passport.authenticate("login", async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error("An error occurred.");

                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error) return next(error);
                // console.log(user._id)
                const body = { _id: user._id, username: user.username };
                const token = jwt.sign(
                    { user: body },
                    "process.env.SECRET_KEY",
                    {
                        expiresIn: "1d",
                    }
                );

                return res.json({ token: token });
            });
        } catch (error) {
            return next(error);
        }
    })(req, res, next);
};

exports.logout = function (req, res) {
    //console.log(req.user);
    req.logout();
    res.json({
        status: "logout",
        msg: "Please Log In again",
    });
};
