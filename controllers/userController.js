require("dotenv").config();

const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const Token = require("../models/token");
const bcrypt = require("bcryptjs");

async function saveToken(userid, refreshToken) {
    const tokenData = await Token.findOne({ user: userid });
    if (tokenData) {
        tokenData.token = refreshToken;
        return tokenData.save();
    }
    const token = Token.create({ user: userid, token: refreshToken });
    return token;
}

exports.signup = [
    body("username", "Empty name")
        .custom(async (value, { req }) => {
            const user = await User.findOne({ username: req.body.username });
            //console.log(user);
            if (user !== {}) {
                return false;
            }

            return false;
        })
        .withMessage("Username already exist")
        .isLength(1)
        .trim()
        .escape(),
    body("password").isLength(6).withMessage("Minimum length 6 characters"),
    body("confirm-password")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                return false;
            }

            return true;
        })
        .withMessage("Password confirmation does not match password"),
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.json({
                username: req.body.username,
                errors: errors.array(),
            });
        }
        const userValid = await User.findOne({ username: req.body.username });
        //console.log(user);
        if (userValid) {
            return next(new Error("Username already exist"));
        }
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        const user = {
            username: req.body.username,
            password: hash,
        };
        await User.create({ ...user });
        res.json({
            message: "Signed-up sucessfuly",
            user,
        });
    },
];

exports.login = async (req, res, next) => {
    const user = await User.findOne({ username: req.body.username });

    if (!user) {
        return next(new Error("User not found"));
    }

    const validate = bcrypt.compareSync(req.body.password, user.password);
    //req.body.password === user.password;

    if (!validate) {
        return next(new Error("Wrong Password"));
    }

    try {
        const body = { _id: user._id, username: user.username };

        const accessToken = jwt.sign({ user: body }, process.env.SECRET_KEY, {
            expiresIn: "15m",
        });
        const refreshToken = jwt.sign(
            { user: body },
            process.env.SECRET_KEY_REFRESH,
            {
                expiresIn: "15d",
            }
        );

        await saveToken(user._id, refreshToken);

        res.cookie("refreshToken", refreshToken, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });
        return res.json({ accessToken, refreshToken, user: body });
    } catch (error) {
        return next(error);
    }
};

exports.logout = async function (req, res) {
    const { refreshToken } = req.cookies;

    await Token.deleteOne({ token: refreshToken });

    res.clearCookie("refreshToken");
    res.json({
        status: "logout",
        msg: "Please Log In again",
    });
};

exports.refresh = async function (req, res, next) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return next(new Error("No refresh token"));
    }

    const tokenData = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH);
    //console.log(tokenData.user);
    const dbToken = await Token.findOne({ token: refreshToken });

    if (!dbToken || !tokenData.user) {
        return next(new Error("No token in database or token invalid"));
    }
    const user = await User.findById(tokenData.user._id);

    const userData = {
        _id: user._id,
        username: user.username,
    };

    const accessToken = jwt.sign({ user: userData }, process.env.SECRET_KEY, {
        expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign(
        { user: userData },
        process.env.SECRET_KEY_REFRESH,
        {
            expiresIn: "15d",
        }
    );

    await saveToken(userData._id, newRefreshToken);

    res.cookie("refreshToken", newRefreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    });
    return res.json({
        accessToken,
        refreshToken: newRefreshToken,
        user: userData,
    });
};
