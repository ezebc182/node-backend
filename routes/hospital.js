const express = require("express");
const app = express();
const Hospital = require("../models/hospital");
const mdwAuthorize = require("../middlewares/auth");

// =================================
// Get hospitals
// =================================

app.get("/", function(req, res) {
    let notifications = null;
    let success = true;
    let data = null;
    let from = Number(req.query.from) || 0;

    Hospital.find({})
        .skip(from)
        .limit(5)
        .populate('user', 'email name')
        .exec((err, hospitals) => {
            if (err) {
                notifications = err;
                message: "Error loading hospitals";
                success = false;
            }

            Hospital.count({}, (err, count) => {

                return res.status(200).json({
                    success,
                    notifications,
                    data: {
                        hospitals: hospitals,
                        total: count
                    }
                });
            })
        });
});

// =================================
// Create a hospital
// =================================

app.post("/", mdwAuthorize.verifyToken, (req, res) => {
    let body = req.body;
    let hospital = new Hospital({ name: body.name, user: req.user._id });

    hospital.save((err, createdHospital) => {
        if (err) {
            return res
                .status(400)
                .json({
                    notifications: err,
                    data: null,
                    success: false
                });
        }


        return res
            .status(201)
            .json({
                success: true,
                data: createdHospital,
                notifications: null
            });
    });
});

// =================================
// Update a hospital
// =================================

app.put("/:id", mdwAuthorize.verifyToken, (req, res) => {
    let body = req.body;
    let id = req.params.id;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                success: false,
                notifications: err,
                data: null
            });
        }

        if (!hospital) {
            return res.status(400).json({
                success: false,
                notifications: err,
                data: null,
                message: 'There is no hospital that matches with provided ID.'
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id

        hospital.save((err, updatedHospital) => {
            if (err) {
                return res.status(400).json({
                    success: false,
                    notifications: err,
                    data: null
                });
            }
            return res
                .status(200)
                .json({
                    success: true,
                    hospital: updatedHospital
                });
        });
    });
});

// =================================
// Delete an hospital
// =================================

app.delete("/:id", mdwAuthorize.verifyToken, (req, res) => {
    let id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {
        if (err) {
            return res.status(500).json({
                success: false,
                notifications: err,
                message: "Oops! there was an error when trying to delete the hospital",
                data: null
            });
        }
        if (!deletedHospital) {
            return res.status(400).json({
                success: false,
                notifications: err,
                message: "There is no hospital that matches with provided id.",
                data: null
            });
        }

        return res
            .status(200)
            .json({
                success: true,
                notifications: null,
                data: deletedHospital
            });
    });
});

module.exports = app;