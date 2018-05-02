// Requires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
// Intialize

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const appRoutes = require("./routes/route");
const loginRoutes = require("./routes/login");
const userRoutes = require("./routes/users");

app.use('/users', userRoutes);
app.use("/login", loginRoutes);
app.use("/", appRoutes);
// DB connection

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) throw err;
    console.log("MongoDB: \x1b[36m%s\x1b[0m", "online");
});


// Listeners

app.listen(3000, () => {
    console.log("Node/Express: \x1b[36m%s\x1b[0m", "online");
});