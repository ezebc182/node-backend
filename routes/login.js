const express = require("express");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const SEED = require("../config/config").SEED;
const jwt = require("jsonwebtoken");

app.post('/', (req, res) => {
    const body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {

        if (err) {
            return res.status(500).json({
                notifications: err,
                message: 'Error',
                success: false,
                data: null
            });
        }

        if (!userDB) {
            return res
                .status(400)
                .json({
                    message: "Bad request - credentials-email",
                    success: false,
                    data: null
                });
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res
                .status(400)
                .json({
                    message: "Bad request - credentials-password",
                    success: false,
                    data: null
                });
        }

        // Create token

        userDB.password = ':)';

        let token = jwt.sign({ user: userDB }, SEED, {
            expiresIn: 14400
        });


        res.status(200).json({
            sucess: true,
            data: {
                user: userDB,
                token
            },
            notifications: null
        });
    });

});

module.exports = app;