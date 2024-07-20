import { Schema, model } from "mongoose";

const professionsSchema = Schema({
    nameProfession: {
        type: String,
        required: true,
        unique: true
    }
}, {
    versionKey: false
})

export default model('profession', professionsSchema)