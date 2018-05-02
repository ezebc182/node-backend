const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const privatePaths = require("mongoose-private-paths");

const Schema = mongoose.Schema;

const roles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

const userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El email es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
    avatar: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: roles }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' });
//userSchema.plugin(privatePaths);
module.exports = mongoose.model('User', userSchema);