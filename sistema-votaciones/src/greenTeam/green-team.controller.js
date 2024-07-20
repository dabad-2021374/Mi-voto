import Parties from "../politicalParties/political-parties.model.js";
import GreenTeam from "./green-team.model.js";
import User from '../user/user.model.js'

/*export const createGreenTeam = async (req, res) => {
    try {
        const { partyId } = req.body;

        if (!partyId) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' });
        }

        const party = await Parties.findOne({_id: partyId}).select('nationalListDeputies');

        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const nationalListDeputies = party.nationalListDeputies;

        const newGreenTeam = new GreenTeam({
            parties: partyId,
            candidates: nationalListDeputies
        });

        await newGreenTeam.save();

        return res.send({ message: 'equipo diputados lista nacional creado exitosamente.', greenTeam: newGreenTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo diputados lista nacional', error: err.message });
    }
};*/


export const createGreenTeam = async (req, res) => {
    try {
        //obtenemos los partidos
        let parties = await Parties.find().select('nationalListDeputies');

        //validamos si existen partidos
        if (!parties || parties.length == 0) return res.status(404).send({ message: 'No se encontraron partidos' });
        const currentYear = new Date().getFullYear();

        //creamos los equipos nationalListDeputies de cada partido
        for (const party of parties) {
            const nationalListDeputies = party.nationalListDeputies;

            //validamos que el equipo de nationalListDeputies exista
            if (!nationalListDeputies) res.status(404).send({ message: `Partido ${party.name} no cumple requisitos.` });


            //verificamos si ya existe un equipo nationalListDeputies para el partido en el año actual
            const existingGreenTeam = await GreenTeam.findOne({
                partie: party._id,
                year: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lte: new Date(`${currentYear}-12-31`)
                }
            });

            if (existingGreenTeam) {
                console.log(`Equipo de Diputados de listado nacional ${party.name} en el año ${currentYear} ya existe`);
                continue; // Saltar la creación de este equipo parlamentDeputies
            }

            //creamos el equipo parlamentDeputies
            const newGreenTeam = new GreenTeam({
                partie: party._id,
                candidates: nationalListDeputies
            })

            //guardamos los partidos en la db
            await newGreenTeam.save();
        }
        return res.send({ message: 'Equipos de Diputados de listado nacional creados exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo Diputados de listado nacional', error: err.message });
    }
};

export const updateGreenTeam = async (req, res) => {
    try {
        let { newPartyId } = req.body;
        let { id } = req.params

        if (!id || !newPartyId) {
            return res.status(400).send({ message: 'ID de GreenTeam y nuevo ID del partido son obligatorios.' });
        }

        const newParty = await Parties.findById(newPartyId).select('nationalListDeputies');

        if (!newParty) {
            return res.status(404).send({ message: 'Nuevo partido no encontrado.' });
        }

        const nationalListDeputies = newParty.nationalListDeputies;

        const updatedGreenTeam = await GreenTeam.findByIdAndUpdate(
            id,
            {
                partie: newPartyId,
                candidates: nationalListDeputies
            },
            { new: true }
        );

        if (!updatedGreenTeam) {
            return res.status(404).send({ message: 'GreenTeam no encontrado.' });
        }

        return res.send({ message: 'GreenTeam actualizado exitosamente.', greenTeam: updatedGreenTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el GreenTeam', error: err.message });
    }
};

export const deleteGreenTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID de GreenTeam es obligatorio.' });
        }

        const deletedGreenTeam = await GreenTeam.findByIdAndDelete(id);

        if (!deletedGreenTeam) {
            return res.status(404).send({ message: 'GreenTeam no encontrado.' });
        }

        return res.send({ message: 'GreenTeam eliminado exitosamente.', greenTeam: deletedGreenTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el GreenTeam', error: err.message });
    }
};


export const getAllGreenTeams = async (req, res) => {
    try {
        const greenTeams = await GreenTeam.find()
            .populate({
                path: 'partie',
                select: 'colorHex logo position',
            })
            .populate({
                path: 'candidates',
                populate: [
                    { path: 'user', select: 'name surname' },
                    { path: 'district' }
                ]
            });

        greenTeams.sort((a, b) => a.partie.position - b.partie.position);
        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        greenTeams.forEach(team => {
            if (team.partie && team.partie.logo) {
                if (!/^https?:\/\//.test(team.partie.logo)) {
                    team.partie.logo = `${baseUrl}${team.partie.logo}`;
                }
            } else {
                team.partie = {
                    logo: `${baseUrl}partiesImage/defaultpartie.jpg`
                };
            }
        });

        return res.send(greenTeams);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los GreenTeams', error: err.message });
    }
};

export const getGreenTeamByPartyName = async (req, res) => {
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
        const greenTeams = await GreenTeam.find({ partie: { $in: partyIds } }).populate({
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

        if (!greenTeams.length) {
            return res.status(404).send({ message: 'No se encontraron GreenTeams con ese nombre de partido.' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        greenTeams.forEach(team => {
            team.logo = `${baseUrl}${team.logo}`
        })

        return res.send(greenTeams);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar los GreenTeams', error: err.message });
    }
};

export const getGreenTeamByPartyId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' });
        }

        const greenTeam = await GreenTeam.findOne({ partie: id }).populate({
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

        if (!greenTeam) {
            return res.status(404).send({ message: 'GreenTeam no encontrado.' });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        greenTeam.forEach(team => {
            team.logo = `${baseUrl}${team.logo}`
        })

        return res.send(greenTeam);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar el GreenTeam', error: err.message });
    }
};

export const getCandidatesByLocation = async (req, res) => {
    try {
        const { departmentId, town } = req.body;

        if (!departmentId && !town) {
            return res.status(400).send({ message: 'Se requiere al menos el departamento o el municipio.' });
        }

        const match = {};
        if (departmentId) match.department = departmentId;
        if (town) match.town = town;

        const greenTeams = await GreenTeam.find()
            .populate({
                path: 'candidates.user',
                match: match,
                select: 'name surname department town'
            });

        const candidatesByLocation = greenTeams.reduce((acc, team) => {
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