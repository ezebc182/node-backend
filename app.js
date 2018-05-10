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
const hospitalRoutes = require("./routes/hospital");
const medicRoutes = require("./routes/medic");
const userRoutes = require("./routes/user");
const searchRoutes = require("./routes/search");
const uploadRoutes = require("./routes/upload");
const imageRoutes = require("./routes/image");

app.use("/hospitals", hospitalRoutes);
app.use("/medics", medicRoutes);
app.use('/users', userRoutes);
app.use("/login", loginRoutes);
app.use("/search", searchRoutes);
app.use("/upload", uploadRoutes);
app.use("/img", imageRoutes);

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