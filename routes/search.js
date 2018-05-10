const express = require("express");

const app = express();
const Hospital = require('../models/hospital');
const Medic = require('../models/medic');
const User = require('../models/user');


// Find by collection

app.get("/by/:collection/:term", (req, res) => {
    const term = req.params.term;
    const regex = new RegExp(term, 'i');
    const collection = req.params.collection;
    let promise;
    let success = true;
    let notifications = []
    let data = null;


    switch (collection) {
        case 'users':
            promise = findUsers(term, regex);
            break;
        case 'medics':
            promise = findMedics(term, regex);
            break;
        case 'hospitals':
            promise = findHospitals(term, regex);
            break;
        default:
            notifications.push('You must provide some of the following collections "medics", "users" or "hospitals"');
            return res.status(400).json({
                data,
                success,
                notifications
            });
    }


    promise.then(data => {
        return res.status(200).json({
            success,
            data: {
                [collection]: data
            },
            notifications
        });
    });
});


// Find in all collections
app.get("/all/:term", (req, res) => {
    let statusCode = 200;
    let notifications = [];
    let data = null;
    let success = true;

    const term = req.params.term;
    const regex = new RegExp(term, 'i');

    Promise.all([
            findHospitals(term, regex),
            findMedics(term, regex),
            findUsers(term, regex)
        ])
        .then(results => {
            if (results.length === 0) {
                notifications.push(`No records match with "${term}"`);
                data = null;
            } else {

                data = {
                    hospitals: results[0],
                    medics: results[1],
                    users: results[2]
                };
            }


            return res.status(statusCode).json({
                success,
                notifications,
                data
            });
        })
        .catch(err => {
            notifications.push(err);
            success = false;
            statusCode = 400;

            return res.status(statusCode).json({
                success,
                notifications,
                data
            });
        });

});

function findHospitals(term, regex) {
    return new Promise((resolve, reject) => {

        Hospital.find({
                name: regex
            })
            .populate('user', 'name email')
            .exec((err, results) => {
                if (err) {
                    reject('Oops! there was an error searching hospitals. Please try again', err);
                } else {
                    resolve(results);
                }
            });

    });

}

function findMedics(term, regex) {
    return new Promise((resolve, reject) => {

        Medic.find({
                name: regex
            })
            .populate('user', 'name email')
            .populate('hospital')
            .exec((err, results) => {
                if (err) {
                    reject('Oops! there was an error searching medics. Please try again', err);
                } else {
                    resolve(results);
                }
            });

    });

}

function findUsers(term, regex) {
    return new Promise((resolve, reject) => {

        User.find({}, 'name email')
            .or([{ 'name': regex }, { 'email': regex }])
            .exec((err, results) => {
                if (err) {
                    reject('Oops! there was an error searching users. Please try again', err);
                } else {
                    resolve(results);
                }
            });

    });

}
module.exports = app;