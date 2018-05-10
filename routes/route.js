const express = require("express");

const app = express();
// Routes
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        notifications: [],
        data: "Hello world"
    });
});


module.exports = app;