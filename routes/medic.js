const express = require("express");
const app = express();
const Medic = require("../models/medic");
const mdwAuthorize = require("../middlewares/auth");

// =================================
// Get medics
// =================================

app.get("/", function(req, res) {
    let notifications = null;
    let success = true;
    let data = null;
    let from = Number(req.query.from) || 0;

    Medic.find({})
        .populate('user', 'email name')
        .populate('hospital')
        .skip(from)
        .limit(5)
        .exec((err, medics) => {
            if (err) {
                notifications = err;
                message: "Error loading medics";
                success = false;
            }

            Medic.count({}, (err, count) => {

                return res.status(200).json({
                    success,
                    notifications,
                    data: {
                        medics: medics,
                        total: count
                    }
                });
            });
        });
});

// =================================
// Create a medic
// =================================

app.post("/", mdwAuthorize.verifyToken, (req, res) => {
    let body = req.body;
    let medic = new Medic({ name: body.name, user: req.user._id, hospital: body.hospital });

    medic.save((err, createdMedic) => {
        if (err) {
            return res.status(400).json({
                notifications: err,
                data: null,
                success: false
            });
        }

        return res.status(201).json({
            success: true,
            data: createdMedic,
            notifications: null
        });
    });
});

// =================================
// Update a medic
// =================================

app.put("/:id", mdwAuthorize.verifyToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Medic.findById(id, (err, medic) => {
        if (err) {
            return res.status(500).json({
                success: false,
                notifications: err,
                data: null
            });
        }

        if (!medic) {
            return res.status(400).json({
                success: false,
                notifications: err,
                data: null,
                message: "There is no medic that matches with provided ID."
            });
        }

        medic.name = body.name;
        medic.user = req.user._id;
        medic.hospital = body.hospital;

        medic.save((err, updatedMedic) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    notifications: err,
                    data: null
                });
            }
            return res.status(200).json({
                success: true,
                medic: updatedMedic
            });
        });
    });
});

// =================================
// Delete an medic
// =================================

app.delete("/:id", mdwAuthorize.verifyToken, (req, res) => {
    let id = req.params.id;

    Medic.findByIdAndRemove(id, (err, deletedMedic) => {
        if (err) {
            return res.status(500).json({
                success: false,
                notifications: err,
                message: "Oops! there was an error when trying to delete the medic",
                data: null
            });
        }
        if (!deletedMedic) {
            return res.status(400).json({
                success: false,
                notifications: err,
                message: "There is no medic that matches with provided id.",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            notifications: null,
            data: deletedMedic
        });
    });
});

module.exports = app;