
import { Schema, model } from 'mongoose';

const whiteBallotSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'user',
        required: [true, 'Votante es requerido.']
    },
    whiteTeam: {
        type: Schema.ObjectId,
        ref: 'whiteTeam',
        required: [true, 'Equipo blanco seleccionado es requerido']
    }
}, {
    versionKey: false,
    timestamps: true
})

export default model('whiteBallot', whiteBallotSchema);