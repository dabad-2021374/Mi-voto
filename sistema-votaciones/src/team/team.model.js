import { Schema, model } from "mongoose";

const teamSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    rol: {
        type: String,
        enum: ['PRESIDENTE', 'VICEPRESIDENTE', 'DIPUTADO', 'ALCALDE'],
        uppercase: true,
        required: [true, 'Rol obligatorio.']
    },
    district:{
        type: Schema.Types.ObjectId,
        ref: 'districtTeam',
        required: true

    }
 }, {
    versionKey: false
})

export default model('team', teamSchema)