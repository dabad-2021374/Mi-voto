import { Schema, model } from "mongoose";

const whiteTeamSchema = new Schema({
    partie: {
        type: Schema.Types.ObjectId,
        ref: 'partie',
        required: [true, 'Partido requerido.']
    },
    candidates: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'user',
                required: true

            },
            role: {
                type: String,
                enum: ['PRESIDENTE', 'VICEPRESIDENTE'],
                uppercase: true,
                required: [true, 'Rol obligatorio.']
            },
            district: {
                type: Schema.Types.ObjectId,
                ref: 'districtTeam',
                required: false
            }
        }
    ],
    year: {
        type: String,
        required: [true, 'Año de inscripción requerida.']
    }
}, {
    versionKey: false
})

export default model('whiteTeam', whiteTeamSchema);