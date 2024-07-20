import { Schema, model } from 'mongoose';

const yellowBallotSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    yellowTeam: {
        type: Schema.Types.ObjectId,
        ref: 'yellowTeam',
        required: true
    }
}, {
    versionKey: false,
    timestamps: true // Agrega timestamps para createdAt y updatedAt
})

export default model('yellowBallot', yellowBallotSchema)