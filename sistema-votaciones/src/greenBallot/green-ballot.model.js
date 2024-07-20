import { Schema, model } from 'mongoose';

const greenBallotSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    greenTeam: {
        type: Schema.Types.ObjectId,
        ref: 'greenTeam',
        required: true
    }
},{
    versionKey: false,
    timestamps: true // Agrega timestamps para createdAt y updatedAt
})

export default model('greenBallot', greenBallotSchema)