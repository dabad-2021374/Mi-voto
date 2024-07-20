'use strict';

import { Schema, model } from "mongoose";

const userSchema = new Schema({
    code: {
        type: String,
        unique: [true, 'Código debe de ser único.'],
        required: [true, 'Código es requerido']
    },
    username: {
        type: String,
        unique: [true, 'Nombre de usuario debe ser único.'],
        lowercase: true,
        required: [true, 'Nombre de usuario es requerido.']
    },
    password: {
        type: String,
        required: [true, 'Contraseña es requerida.']
    },
    name: {
        type: String,
        required: [true, 'Nombres son requeridos.']
    },
    surname: {
        type: String,
        required: [true, 'Apellidos son requeridos.']
    },
    birthdate: {
        type: Date,
        required: [true, 'Fecha de nacimiento es requerida.']
    },
    DPI: {
        type: String,
        minLength: [13, '13 caracteres permitidos.'],
        maxLength: [13, '13 caracteres permitidos.'],
        unique: [true, 'DPI ya existe'],
        required: [true, 'DPI es requerido.']
    },
    phone: {
        type: String,
        minLength: [8, 'Mínimo de caracteres: 8'],
        maxLength: [11, 'Máximo de caracteres: 11'],
        required: [true, 'Celular es requerido.']
    },
    gender: {
        type: String,
        uppercase: true,
        enum: ['M', 'F'],
        required: [true, 'Género es requerido.']
    },
    department: {
        type: Schema.ObjectId,
        ref: 'department',
        required: [true, 'Departamento es requerido.']
    },
    town: {
        type: String,
        required: [true, 'Municipio es requerido.']
    },
    address: {
        type: String,
        required: [true, 'Dirección actual requerida.']
    },
    profession: {
        type: Schema.ObjectId,
        ref: 'profession',
        required: [true, 'Profesión es requerida.']
    },
    email: {
        type: String,
        unique: [true, 'Email ya existe.'],
        required: [true, 'Email es requerido.']
    },
    role: {
        type: String,
        enum: ['ADMINISTRADOR-PLATAFORMA', 'USUARIO', 'FUNCIONARIO', 'ADMINISTRADOR-PARTIDO'],
        uppercase: true,
        required: [true, 'Rol usuario es requerido.']
    },
    partie: {
        type: Schema.ObjectId,
        ref: 'partie'
    },
    photo: {
        type: String,
        default: 'userImages/defaultProfile.jpg'
    },
    state: {
        type: Boolean,
        default: true
    },
    voterRegistration: {
        type: Boolean,
        default: false,
        required: [true, 'Estado de empadronamiento requerido.']
    },
    dateVoterRegistration: {
        type: String
    },
    literacy:{
        type: String,
        enum: ['No lee, No escribe', 'Lee', 'Escribe', 'Lee, Escribe']
    },
    sight:{
        type: String,
        enum: ['No vidente', 'Vidente']
    }
}, {
    versionKey: false
});

export default model('user', userSchema);
