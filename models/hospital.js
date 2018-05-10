const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const hospitalSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Hospital', hospitalSchema);