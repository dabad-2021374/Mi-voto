'use strict'
import PinkBallot from './pink-ballot.model.js';

export const test = async (req, res) => {
    try {
        console.log('test pink ballot corriendo...');
        return res.send({ message: `Test pink ballot corriendo.` });
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
        const existingBallot = await PinkBallot.findOne({
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
        const pinkBallot = new PinkBallot({ user: userId, pinkTeam: idTeam })
        await pinkBallot.save()
        await pinkBallot.populate({ path: 'pinkTeam', populate: { path: 'partie', select: 'name colorHex acronym' } });
        const count = await PinkBallot.countDocuments({ pinkTeam: idTeam });
        console.log(pinkBallot);
        req.io.emit('newPinkBallot', {
            pinkTeam: { idTeam, name: pinkBallot.pinkTeam.partie.name, colorHex: pinkBallot.pinkTeam.partie.colorHex, acronym: pinkBallot.pinkTeam.partie.acronym },
            count
        });
        //respuesta de guardado
        return res.send({ message: 'Boleta rosada agregada', pinkBallot })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al crear papeleta rosada.` })
    }
}

export const get = async (req, res) => {
    try {
        let pinkBallot = await PinkBallot.find().populate('pinkTeam').select('-user');
        return res.send({pinkBallot});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: `Error al obtener papeletas rosadas`});
    }
}