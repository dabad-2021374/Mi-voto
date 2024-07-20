'use strict'

import WhiteBallot from './../whiteBallot/white-ballot.model.js';

export const test = async (req, res) => {
    try {
        console.log(`test white ballot corriendo...`);
        return res.send({ message: `Test white ballot corriendo.` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error en test.` });
    }
}

export const create = async (req, res) => {
    try {
        //traemos el votante logeado
        const userId = req.user._id;
        //traemos el equipo seleccionado por el votante
        const { idTeam } = req.params;
        //traemos el año
        const currentYear = new Date().getFullYear()
        //verificar si ya existe una boleta para el usuario o equipo verde en el mismo año
        const existingBallot = await WhiteBallot.findOne({
            user: userId,
            createdAt: {
                //greater than or equals - menor que o igual
                $gte: new Date(`${currentYear}-01-01`),
                //less than or equal - mayor que o igual
                $lte: new Date(`${currentYear}-12-31`)
            }
        })
        if (existingBallot) return res.status(400).send({ message: `Sufragio ${currentYear} realizado` })

        //guardamos la eleccion del usuario
        const whiteBallot = new WhiteBallot({ user: userId, whiteTeam: idTeam })
        await whiteBallot.save();
        await whiteBallot.populate({ path: 'whiteTeam', populate: { path: 'partie', select: 'name colorHex acronym'} });
        const count = await WhiteBallot.countDocuments({ whiteTeam: idTeam });
        req.io.emit('newWhiteBallot', {
            whiteTeam: { idTeam, name: whiteBallot.whiteTeam.partie.name, colorHex: whiteBallot.whiteTeam.partie.colorHex, acronym: whiteBallot.whiteTeam.partie.acronym },
            count
        });
        return res.send({ message: 'Boleta blanca agregada', whiteBallot })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al crear papeleta blanca` });
    }
}

export const get = async (req, res) => {
    try {
        let whiteBallot = await WhiteBallot.find().populate('whiteTeam').select('-user');
        return res.send({ whiteBallot });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener las papeletas blancas.` });
    }
}