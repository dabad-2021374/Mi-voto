import Team from './team.model.js'
import mongoose from 'mongoose';

import DistrictTeam from '../districtTeam/districtTeams.model.js'
import User from '../user/user.model.js'

export const createTeam = async (req, res) => {
    try {
        const data = req.body;

        const validRoles = ['PRESIDENTE', 'VICEPRESIDENTE', 'DIPUTADO', 'ALCALDE'];
        if (!validRoles.includes(data.rol.toUpperCase())) {
            return res.status(400).send({ message: 'Rol no válido. Debe ser PRESIDENTE, VICEPRESIDENTE, DIPUTADO o ALCALDE.' });
        }

        const userExists = await User.findById(data.user);
        if (!userExists) {
            return res.status(404).send({ message: 'Usuario no encontrado.' });
        }


        const districtExists = await DistrictTeam.findById(data.district);
        if (!districtExists) {
            return res.status(404).send({ message: 'Distrito no encontrado.' });
        }

        const team = new Team(data);

        await team.save();

        return res.send({ message: `Equipo creado exitosamente con el rol ${team.rol}`, team });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo', error: err });
    }
};

export const updateTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const newData = req.body;

        const existingTeam = await Team.findById(id);
        if (!existingTeam) {
            return res.status(404).send({ message: 'Equipo no encontrado.' });
        }

        for (const key in newData) {
            if (newData.hasOwnProperty(key) && newData[key] === '') {
                return res.status(400).send({ message: `El campo ${key} no puede estar vacío.` });
            }
        }

        const validRoles = ['PRESIDENTE', 'VICEPRESIDENTE', 'DIPUTADO', 'ALCALDE'];
        if (newData.rol && !validRoles.includes(newData.rol.toUpperCase())) {
            return res.status(400).send({ message: 'Rol no válido. Debe ser PRESIDENTE, VICEPRESIDENTE, DIPUTADO o ALCALDE.' });
        }

        if (newData.user) {
            const userExists = await User.findById(newData.user);
            if (!userExists) {
                return res.status(404).send({ message: 'Usuario no encontrado.' });
            }
        }

        if (newData.district) {
            const districtExists = await DistrictTeam.findById(newData.district);
            if (!districtExists) {
                return res.status(404).send({ message: 'Distrito no encontrado.' });
            }
        }

        const updatedTeam = await Team.findByIdAndUpdate(
            id,
            newData,
            { new: true }
        );

        return res.send({ message: 'Equipo actualizado exitosamente', team: updatedTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el equipo', error: err });
    }
};

export const deleteTeam = async (req, res) => {
    try {
        const { id } = req.params;

        const existingTeam = await Team.findById(id);
        if (!existingTeam) {
            return res.status(404).send({ message: 'Equipo no encontrado.' });
        }

        await Team.findByIdAndDelete(id);

        return res.send({ message: 'Equipo eliminado exitosamente', team: existingTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el equipo', error: err });
    }
};

export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find().populate('user').populate('district');

        if (!teams || teams.length === 0) {
            return res.status(404).send({ message: 'No se encontraron equipos' });
        }

        return res.send({ teams });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los equipos', error: err });
    }
};


