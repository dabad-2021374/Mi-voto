'use strict'

import { Schema, model } from "mongoose";

const departmentSchema = new Schema({
    department:{
        type: String,
        unique: [true, 'Departamento debe de ser único.'],
        required: [true, 'Departamento es requerido']
    },
    town:[
        {
            name:{
                type: String,
                required: true
            }
        }
    ]
}, {
    versionKey: false
})

export default model('department', departmentSchema);