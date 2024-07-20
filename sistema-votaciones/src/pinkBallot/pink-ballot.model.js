import { Schema, model } from "mongoose";

const pinkBallotSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'Votante es requerido.']
    },
    pinkTeam: {
        type: Schema.ObjectId,
        ref: 'pinkTeam',
        required: [true, 'Equipo rosado seleccionado es requerido.']
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('pinkBallot', pinkBallotSchema);