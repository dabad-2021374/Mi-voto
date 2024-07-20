import { Schema, model } from "mongoose";

const pinkTeamSchema = Schema({
    partie: {
        type: Schema.Types.ObjectId,
        ref: 'partie',
        required: true
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
                enum: ['ALCALDE'],
                uppercase: true,
                required: [true, 'Rol obligatorio.']
            },
            departament: {
                type: Schema.Types.ObjectId,
                ref: 'department',
                required: true
            },
            town: {
                type: String,
                required: true
            }
        }
    ],
    year: {
        type: Date,
        default: Date.now,
        required: [true, 'Fecha de inscripción requerida.']
    }
}, {
    versionKey: false
})

export default model('pinkTeam', pinkTeamSchema)