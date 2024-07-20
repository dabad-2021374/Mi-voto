import { Schema, model } from "mongoose";

const initiativesSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    noInitiative: {
        type: Number,
        required: true,
        unique: [true, 'Numero de iniciativa ya existe.']
    },
    date: {
        type: Date,
        required: true
    },
    resume: {
        type: String,
        required: true
    }
}, {
    versionKey: false
})

export default model('initiatives', initiativesSchema)