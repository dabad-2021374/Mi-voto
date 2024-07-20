import { Schema, model } from "mongoose";

const partiesSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Nombre obligatorio']
    },
    acronym: {
        type: String,
        required: [true, 'Acrónimo Requerido.']
    },
    logo: {
        type: String,
        default: 'partiesImages/defaultpartie.jpg',
        required: [true, 'Logo obligatorio.']
    },
    creationDate: {
        type: Date,
        //default: Date.now,
        required: [true, 'Fecha de creación obligatoria.']
    },
    presidentialTeam: [
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
            }
        }
    ],
    nationalListDeputies: [
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
    districtDeputies: [
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
    parlamentDeputies: [
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
    mayorTeam: [
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
    state: {
        type: Boolean,
        default: true,
        required: [true, 'Estado obligatorio.']
    },
    colorHex: {
        type: String,
        required: [true, 'EL color en formato hexadecimal es obligatorio.']
    },
    position: {
        type: Number
    }
}, {
    versionKey: false
});

export default model('partie', partiesSchema);
