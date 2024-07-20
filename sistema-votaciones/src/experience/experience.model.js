import { Schema, model } from "mongoose";

const experienceSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Fecha de inicio requerida.']

    },
    endDate: {
        type: Date,
        required: [true, 'Fecha de finalización requerida.'],
        validate: [
            {
                validator: function (value) {
                    return value > this.startDate;
                },
                message: 'Fecha de finalización debe ser posterior a la fecha de inicio.'
            },
            {
                validator: function (value) {
                    return value <= new Date();
                },
                message: 'Fecha de finalización no puede ser mayor a la fecha actual.'
            }
        ]
    },
    institution: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    photoTitle: {
        type: String,
    }
}, {
    versionKey: false
})

export default model('experience', experienceSchema)