'use strict'

import jwt from 'jsonwebtoken';
import User from './../user/user.model.js';

export const validateJwt = async (req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY;
        let { authorization } = req.headers;
        console.log(authorization);
        if (!authorization) return res.status(401).send({ message: `Acces no autorizado.` });
        let { uid } = jwt.verify(authorization, secretKey);
        //buscar el usuario por id
        let user = await User.findOne({ _id: uid });
        if (!user) return res.status(404).send({ message: `Usuario no registrado.` });
        //validar si esta activo para dar acceso
        if (user.status == false) return res.status(403).send({ message: `Unauthorized.` }) 
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send({ message: `Invalid token` })
    }
}

export const isAdminPlatform = async (req, res, next) => {
    try {
        let { user } = req;//req que ya tenemos
        if (!user || user.role !== 'ADMINISTRADOR-PLATAFORMA') return res.status(403).send({ message: `Acceso no autorizado.` });
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: `Rol no autorizado.` })
    }
}

export const isUser = async (req, res, next) => {
    try {
        let { user } = req;//req que ya tenemos
        if (!user || user.role !== 'USUARIO') return res.status(403).send({ message: `Acceso no autorizado.` });
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: `Rol no autorizado` })
    }
}

export const isFuncionary = async (req, res, next) => {
    try {
        let { user } = req;//req que ya tenemos
        if (!user || user.role !== 'FUNCIONARIO') return res.status(403).send({ message: `Acceso no autorizado.` });
        next();
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: `Rol no autorizado` })
    }
}

export const isVoter = async (req, res, next) => {
    try {
        let { user } = req;
        if (!user || (user.role !== 'USUARIO' && user.role !== 'FUNCIONARIO')) return res.status(403).send({ message: `Acceso no autorizado.` })
        next()
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: `Rol no autorizado` });
    }
}

export const isAdminPartie = async (req, res, next) => {
    try {
        let { user } = req; // req que ya tenemos
        if (!user || user.role !== 'ADMINISTRADOR-PARTIDO') {
            return res.status(403).send({ message: 'Acceso no autorizado.' });
        }
        next()
    } catch (err) {
        console.error(err);
        return res.status(403).send({ message: 'Rol no autorizado.' });
    }
};