const express = require("express");
const path = require('path');
const fs = require('fs');
const app = express();
// Routes
app.get("/:collection/:id", (req, res) => {
    const id = req.params.id;
    const collection = req.params.collection;
    const pathImage = path.resolve(__dirname, `../uploads/${collection}/${id}`);

    res.sendFile(path.resolve(__dirname, (fs.existsSync(pathImage) ? pathImage : '../assets/no-img.jpg')));
});


module.exports = app;