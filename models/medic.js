const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medicSchema = new Schema({
    name: { type: String, required: [true, "El nombre es requerido"] },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    hospital: {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
        required: [true, "El id hospital es requerido"]
    }
});

module.exports = mongoose.model("Medic", medicSchema);