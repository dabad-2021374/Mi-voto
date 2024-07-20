'use strict'

import { Schema, model } from 'mongoose';

const votesSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        href: 'user',
        required: [true, 'Votante requerido.']
    },
    date: {
        type: Date,
        default: Date.now,
        required: [true, 'Fecha y hora de voto requerido.']
    },
    ballots: [
        {
            whiteBallot: {
                type: Schema.ObjectId,
                href: 'whiteBallot',
                required: [true, 'Papeleta blanca requerida.']
            },
            greenBallot: {
                type: Schema.ObjectId,
                href: 'greenBallot',
                required: [true, 'Papeleta verde requerida.']
            },
            blueBallot: {
                type: Schema.ObjectId,
                href: 'blueBallot',
                required: [false, 'Papeleta celeste requerida.']
            },
            pinkBallot: {
                type: Schema.ObjectId,
                href: 'pinkBallot',
                required: [false, 'Papeleta rosada requerida.']
            },
            yellowBallot: {
                type: Schema.ObjectId,
                href: 'yellowBallot',
                required: [false, 'Papeleta amarilla requerida.']
            }
            
        }
    ]
}, {
    versionKey: false
})

export default model('votes', votesSchema);
