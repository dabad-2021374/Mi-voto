import { Schema, model } from 'mongoose';

const blueBallotSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    blueTeam: {
        type: Schema.Types.ObjectId,
        ref: 'blueTeam',
        required: true
    }
}, {
    versionKey: false,
    timestamps: true 
})

export default model('blueBallot', blueBallotSchema)