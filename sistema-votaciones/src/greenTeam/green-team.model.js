import { Schema, model } from "mongoose";

const greenTeamSchema = Schema({
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
                enum: ['DIPUTADO'],
                uppercase: true,
                required: [true, 'Rol obligatorio.']
            },
            district: {
                type: Schema.Types.ObjectId,
                ref: 'districtTeam',
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

export default model('greenTeam', greenTeamSchema)