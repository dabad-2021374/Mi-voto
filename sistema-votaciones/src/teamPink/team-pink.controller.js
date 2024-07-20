import Parties from "../politicalParties/political-parties.model.js";
import PinkTeam from "./team-pink.model.js";
/*
export const createPinkTeam = async (req, res) => {
    try {
        const { partyId } = req.body;

        if (!partyId) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' });
        }

        const party = await Parties.findOne({_id: partyId}).select('mayorTeam');

        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const  mayorTeam = party. mayorTeam;

        const newPinkTeam = new PinkTeam({
            parties: partyId,
            candidates:  mayorTeam
        });

        await newPinkTeam.save();

        return res.send({ message: 'equipo alcalde creado exitosamente.', pinkTeam: newPinkTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo alcalde', error: err.message });
    }
};*/

export const createPinkTeam = async (req, res) => {
    try {
        //obtenemos los partidos
        let parties = await Parties.find().select('name mayorTeam position').sort({ position: 1 });

        //validamos si existen partidos
        if (!parties || parties.length == 0) return res.status(404).send({ message: 'No se encontraron partidos' });
        const currentYear = new Date().getFullYear();
        const messages = [];  // Array para acumular mensajes de errores y confirmaciones

        //creamos los equipos alcaldes de cada partido
        for (const party of parties) {
            const mayorTeam = party.mayorTeam;
            console.log(party);
            //validamos que el equipo de alcalde exista y sea mayor a 0

            // Validamos que el equipo presidencial exista y tenga un máximo de 2
            if (!mayorTeam || mayorTeam.length <= 0) {
                messages.push(`Partido ${party.name} no cumple requisitos.`);
                continue;  // Salta a la siguiente iteración del bucle
            }

            //verificamos si ya existe un alcalde para el partido en el año actual
            // Verificamos si ya existe un equipo presidencial para el partido en el año actual
            const existingPinkTeam = await PinkTeam.findOne({
                partie: party._id,
                year: currentYear
            });

            if (existingPinkTeam) {
                console.log(`Equipo de alcalde ${party.name} en el año ${currentYear} ya existe`);
                messages.push(`Equipo de alcaldes ${party.name} en el año ${currentYear} ya existe.`)
                continue; // Saltar la creación de este alcalde
            } else {
                // Creamos el equipo alcalde
                const newPinkTeam = new PinkTeam({
                    partie: party._id,
                    candidates: mayorTeam,
                    year: currentYear  // Asegúrate de agregar el año actual
                });

                // Guardamos los partidos en la db
                await newPinkTeam.save();
                messages.push(`Equipo de alcaldes para ${party.name} creado exitosamente.`);
            }
        }
        return res.send({ message: 'Equipos de alacaldes creados exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo alcaldes', error: err.message });
    }
};

export const getMayorByTown = async (req, res) => {
    try {
        //municipio de la persona
        const town = req.user.town;
        const result = await PinkTeam.aggregate([
            { $unwind: '$candidates' },
            { $match: { 'candidates.town': town } }
        ])
        if (!result) return res.status(404).send({ message: `Candidatos no encontrados para el municipio de ${town}.` });
        console.log(result);

        //extraer los ids de usuarios y partidos para poblar
        const userIds = result.map(user => user.candidates.user);
        const partieIds = result.map(partie => partie.partie);

        const populatedUsers = await PinkTeam.populate(result, {
            path: 'candidates.user',
            match: { _id: { $in: userIds } },
            select: 'photo name surname'
        });

        const populatedParties = await PinkTeam.populate(populatedUsers, {
            path: 'partie',
            match: { _id: { $in: partieIds } },
            select: 'logo colorHex position'
        })

        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        for (let iteracy of populatedParties) {
            iteracy.partie.logo = `${baseUrl}${iteracy.partie.logo}`
            iteracy.candidates.user.photo = `${baseUrl}${iteracy.candidates.user.photo}`
        }

        return res.send({ populatedParties });
    } catch (error) {

    }
}

export const updatePinkTeam = async (req, res) => {
    try {
        let { newPartyId } = req.body;
        let { id } = req.params

        if (!id || !newPartyId) {
            return res.status(400).send({ message: 'ID de PinkTeam y nuevo ID del partido son obligatorios.' });
        }

        const newParty = await Parties.findById(newPartyId).select('mayorTeam');

        if (!newParty) {
            return res.status(404).send({ message: 'Nuevo partido no encontrado.' });
        }

        const mayorTeam = newParty.mayorTeam;

        const updatedPinkTeam = await PinkTeam.findByIdAndUpdate(
            id,
            {
                partie: newPartyId,
                candidates: mayorTeam
            },
            { new: true }
        );

        if (!updatedPinkTeam) {
            return res.status(404).send({ message: 'PinkTeam no encontrado.' });
        }

        return res.send({ message: 'PinkTeam actualizado exitosamente.', pinkTeam: updatedPinkTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el PinkTeam', error: err.message });
    }
};

export const deletePinkTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID de PinkTeam es obligatorio.' });
        }

        const deletedPinkTeam = await PinkTeam.findByIdAndDelete(id);

        if (!deletedPinkTeam) {
            return res.status(404).send({ message: 'PinkTeam no encontrado.' });
        }

        return res.send({ message: 'PinkTeam eliminado exitosamente.', pinkTeam: deletedPinkTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el PinkTeam', error: err.message });
    }
};


export const getAllPinkTeams = async (req, res) => {
    try {
        const pinkTeam = await PinkTeam.find().populate({
            path: 'partie',
            select: 'name logo colorHex', // Selecciona los campos que quieres poblar
        })
            .populate({
                path: 'candidates',
                populate: [
                    { path: 'user' },
                    { path: 'district' }
                ]
            })
        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        for (let item of pinkTeam) {
            item.partie.logo = `${baseUrl}${item.partie.logo}`
        }
        return res.send(pinkTeam);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los PinkTeam', error: err.message });
    }
};

export const getPinkTeamByPartyName = async (req, res) => {
    try {
        const { name } = req.params;

        if (!name) {
            return res.status(400).send({ message: 'Nombre del partido es obligatorio.' });
        }

        const parties = await Parties.find({ name: new RegExp(name, 'i') }).select('_id');

        if (!parties.length) {
            return res.status(404).send({ message: 'No se encontraron partidos con ese nombre.' });
        }

        const partyIds = parties.map(party => party._id);
        const pinkTeam = await PinkTeam.find({ partie: { $in: partyIds } }).populate({
            path: 'partie',
            select: 'name logo colorHex', // Selecciona los campos que quieres poblar
        })
            .populate({
                path: 'candidates',
                populate: [
                    { path: 'user' },
                    { path: 'district' }
                ]
            })

        if (!pinkTeam.length) {
            return res.status(404).send({ message: 'No se encontraron pinkTeam con ese nombre de partido.' });
        }

        return res.send(pinkTeam);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar los PinkTeam', error: err.message });
    }
};

export const getPinkTeamByPartyId = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' })
        }

        const pinkTeam = await PinkTeam.findOne({ partie: id }).populate({
            path: 'partie',
            select: 'name logo colorHex', // Selecciona los campos que quieres poblar
        })
            .populate({
                path: 'candidates',
                populate: [
                    { path: 'user' },
                    { path: 'district' }
                ]
            })

        if (!pinkTeam) {
            return res.status(404).send({ message: 'pinkTeam no encontrado.' })
        }
        return res.send(pinkTeam)
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar el pinkTeam', error: err.message })
    }
};

export const getPinkTeamCandidatesByLocation = async (req, res) => {
    try {
        const { departmentId, town } = req.body;

        if (!departmentId && !town) {
            return res.status(400).send({ message: 'Se requiere al menos el departamento o el municipio.' });
        }

        const match = {};
        if (departmentId) match.department = departmentId;
        if (town) match.town = town;

        const pinkTeams = await PinkTeam.find()
            .populate({
                path: 'candidates.user',
                match: match,
                select: 'name surname department town'
            });

        const candidatesByLocation = pinkTeams.reduce((acc, team) => {
            const candidates = team.candidates.filter(candidate => candidate.user);
            if (candidates.length > 0) {
                acc.push(...candidates.map(candidate => ({
                    name: candidate.user.name,
                    surname: candidate.user.surname,
                    role: candidate.role,
                    district: candidate.district
                })));
            }
            return acc;
        }, []);

        return res.send({ candidates: candidatesByLocation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los candidatos', error: err.message });
    }
};