const express = require("express");
const app = express();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const mdwAuthorize = require('../middlewares/auth');

// =================================
// Get users
// =================================

app.get("/", function(req, res) {
    let notifications = null;
    let success = true;
    let data = null;

    User.find({}, (err, users) => {
        if (err) {
            notifications = err;
            success = false;
        }
        return res.status(200).json({
            success,
            notifications,
            data: {
                users: users
            }
        });
    });
});


// =================================
// Create a user
// =================================

app.post('/', mdwAuthorize.verifyToken, (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        avatar: body.avatar
    });

    user.save((err, user) => {
        if (err) {
            return res.status(400).json({
                notifications: err,
                data: null,
                success: false
            });
        }

        delete user['password'];

        return res
            .status(201)
            .json({
                success: true,
                data: user,
                notifications: null
            });
    });
});

// =================================
// Update a user
// =================================

app.put("/:id", mdwAuthorize.verifyToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    User.findById(id, "name email avatar role", (err, user) => {
        if (err) {
            return res.status(500).json({
                success: false,
                notifications: err,
                data: null
            });
        }

        if (!user) {
            return res.status(400).json({
                success: false,
                notifications: err,
                data: null
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.avatar = body.avatar;
        user.role = body.role;

        user.save((err, updatedUser) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    notifications: err,
                    data: null
                });
            }
            return res.status(200).json({
                success: true,
                user: updatedUser
            });
        });
    });
});


// =================================
// Delete an user
// =================================

app.delete("/:id", mdwAuthorize.verifyToken, (req, res) => {
    let id = req.params.id;

    User.findByIdAndRemove(id, (err, deletedUser) => {
        if (err) {
            return res.status(500).json({
                success: false,
                notifications: err,
                message: "Oops! there was an error when trying to delete the user",
                data: null
            });
        }
        if (!deletedUser) {
            return res.status(400).json({
                success: false,
                notifications: err,
                message: "There is not user that matches with provided id.",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            notifications: null,
            data: deletedUser
        });
    });
});

module.exports = app;