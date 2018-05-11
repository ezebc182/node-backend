const express = require("express");
const app = express();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const SEED = require("../config/config").SEED;
const CLIENT_ID = require("../config/config").CLIENT_ID;
const jwt = require("jsonwebtoken");



// ==================================================
//  Login with Google
// ==================================================
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture
    }
}
//verify().catch(console.error);


app.post('/google', async(req, res) => {

    const token = req.body.token;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                success: false,
                notifications: 'Invalid token ' + err,
                data: null
            });
        });

    res.status(200).json({
        sucess: true,
        data: googleUser
    });

});

// ==================================================
//  Default Login
// ==================================================

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