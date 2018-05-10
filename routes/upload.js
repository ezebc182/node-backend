const express = require("express");
const fileUpload = require('express-fileupload');
const fs = require('fs');
const User = require('../models/user');
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const mdwAuthorize = require("../middlewares/auth");
const app = express();


app.use(fileUpload());

// Routes
app.put("/:collection/:id", mdwAuthorize.verifyToken, (req, res) => {
    const collection = req.params.collection;
    const id = req.params.id;
    const availableCollections = ['medics', 'hospitals', 'users'];
    const validExtentions = ['png', 'jpg', 'gif', 'jpeg'];

    if (availableCollections.indexOf(collection) < 0) {
        return res.status(400).json({
            success: false,
            notifications: `Available collections are ${availableCollections.join(', ')}`,
            data: null
        });
    }



    if (!req.files) {
        return res.status(400).json({
            success: false,
            notifications: 'No files were uploaded',
            data: null
        });
    }



    let file = req.files.files;

    let splittedName = file.name.split('.');
    let extention = splittedName[splittedName.length - 1];

    if (validExtentions.indexOf(extention) < 0) {
        return res.status(400).json({
            success: false,
            notifications: `Available extentions are ${validExtentions.join(', ')}`,
            data: null
        });
    } else {

        let fileName = `${id}-${new Date().getMilliseconds()}.${extention}`;

        file.mv(`./uploads/${collection}/${fileName}`, err => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    notifications: 'There was an error trying to move the file ' + err,
                    data: null
                });
            }

            uploadFile(collection, id, fileName, res);
        });

    }


});

function uploadFile(collection, id, fileName, res) {

    if (collection === 'users' && id.match(/^[0-9a-fA-F]{24}$/)) {
        User.findById(id, (err, userDB) => {

            if (err) {
                return res.status(500).json({
                    data: null,
                    notifications: err,
                    success: false
                });
            } else if (!userDB) {
                return res.status(404).json({
                    data: null,
                    notifications: 'No user was found with id: ' + id,
                    success: false
                });
            } else {
                const oldFile = `./uploads/${collection}/${userDB.avatar}`;

                if (fs.existsSync(oldFile)) {
                    fs.unlink(oldFile);
                }

                userDB.avatar = fileName;

                userDB.save((err, userUpdated) => {

                    return res.status(200).json({
                        data: userUpdated,
                        notifications: null,
                        success: true
                    });
                });
            }
        });
    } else if (collection === 'hospitals' && id.match(/^[0-9a-fA-F]{24}$/)) {
        Hospital.findById(id, (err, hospitalDB) => {

            if (err) {
                return res.status(500).json({
                    data: null,
                    notifications: err,
                    success: false
                });
            } else if (!hospitalDB) {
                return res.status(404).json({
                    data: null,
                    notifications: 'No hospital was found with id: ' + id,
                    success: false
                });
            } else {
                const oldFile = `./uploads/${collection}/${hospitalDB.img}`;

                if (fs.existsSync(oldFile)) {
                    fs.unlink(oldFile);
                }

                hospitalDB.img = fileName;

                hospitalDB.save((err, hospitalUpdated) => {

                    return res.status(200).json({
                        data: hospitalUpdated,
                        notifications: null,
                        success: true
                    });
                });
            }
        });
    } else if (collection === 'medics' && id.match(/^[0-9a-fA-F]{24}$/)) {
        Medic.findById(id, (err, medicDB) => {

            if (err) {
                return res.status(500).json({
                    data: null,
                    notifications: err,
                    success: false
                });
            } else if (!medicDB) {
                return res.status(404).json({
                    data: null,
                    notifications: 'No medic was found with id: ' + id,
                    success: false
                });
            } else {
                const oldFile = `./uploads/${collection}/${medicDB.img}`;

                if (fs.existsSync(oldFile)) {
                    fs.unlink(oldFile);
                }

                medicDB.img = fileName;

                medicDB.save((err, medicUpdated) => {

                    return res.status(200).json({
                        data: medicUpdated,
                        notifications: null,
                        success: true
                    });
                });
            }
        });
    } else {

        return res.status(422).json({
            data: null,
            notifications: 'Invalid request',
            success: false
        });

    }
}


module.exports = app;