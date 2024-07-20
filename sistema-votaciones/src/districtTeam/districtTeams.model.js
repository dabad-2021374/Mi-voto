import { Schema, model } from "mongoose";

const districtTeamSchema = Schema({
    nameDistrict:{
        type: String, 
        required: true, 
        unique: true
    }
}, {
    versionKey: false
})

export default model('districtTeam', districtTeamSchema)