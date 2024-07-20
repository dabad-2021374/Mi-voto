import Parties from "../politicalParties/political-parties.model.js";
import YellowTeam from "./yellow-team.model.js";
/*
export const createYellowTeam = async (req, res) => {
    try {
        const { partyId } = req.body;

        if (!partyId) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' });
        }

        const party = await Parties.findOne({_id: partyId}).select('parlamentDeputies');

        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const parlamentDeputies = party.parlamentDeputies;

        const newYellowTeam = new YellowTeam({
            partie: partyId,
            candidates: parlamentDeputies
        });

        await newYellowTeam.save();

        return res.send({ message: 'equipo diputados parlamento creado exitosamente.', yellowTeam: newYellowTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo diputados parlamento', error: err.message });
    }
};*/

export const createYellowTeam = async (req, res) => {
    try {
        //obtenemos los partidos
        let parties = await Parties.find().select('parlamentDeputies');

        //validamos si existen partidos
        if (!parties || parties.length == 0) return res.status(404).send({ message: 'No se encontraron partidos' });
        const currentYear = new Date().getFullYear();

        //creamos los equipos parlamentDeputies de cada partido
        for (const party of parties) {
            const parlamentDeputies = party.parlamentDeputies;

            //validamos que el equipo de parlamentDeputies exista y tenga un maximo de 2
            if (!parlamentDeputies) res.status(404).send({ message: `Partido ${party.name} no cumple requisitos.` });


            //verificamos si ya existe un equipo presidencial para el partido en el año actual
            const existingYellowTeam = await YellowTeam.findOne({
                partie: party._id,
                year: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lte: new Date(`${currentYear}-12-31`)
                }
            });

            if (existingYellowTeam) {
                console.log(`Equipo de Diputados del parlamento ${party.name} en el año ${currentYear} ya existe`);
                continue; // Saltar la creación de este equipo parlamentDeputies
            }

            //creamos el equipo parlamentDeputies
            const newYellowTeam = new YellowTeam({
                partie: party._id,
                candidates: parlamentDeputies
            })

            //guardamos los partidos en la db
            await newYellowTeam.save();
        }
        return res.send({ message: 'Equipos de Diputados del parlamento creados exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo Diputados del parlamento', error: err.message });
    }
};

export const updateYellowTeam = async (req, res) => {
    try {
        let { newPartyId } = req.body;
        let { id } = req.params

        if (!id || !newPartyId) {
            return res.status(400).send({ message: 'ID de Yellowteam y nuevo ID del partido son obligatorios.' });
        }

        const newParty = await Parties.findById(newPartyId).select('parlamentDeputies');

        if (!newParty) {
            return res.status(404).send({ message: 'Nuevo partido no encontrado.' });
        }

        const parlamentDeputies = newParty.parlamentDeputies;

        const updatedYellowTeam = await YellowTeam.findByIdAndUpdate(
            id,
            {
                partie: newPartyId,
                candidates: parlamentDeputies
            },
            { new: true }
        );

        if (!updatedYellowTeam) {
            return res.status(404).send({ message: 'Yellow Team no encontrado.' });
        }

        return res.send({ message: 'Yellow Team actualizado exitosamente.', yellowTeam: updatedYellowTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el GrYellow TeameenTeam', error: err.message });
    }
};

export const deleteYellowTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID de yellowTeam es obligatorio.' });
        }

        const deletedYellowTeam = await YellowTeam.findByIdAndDelete(id);

        if (!deletedYellowTeam) {
            return res.status(404).send({ message: 'YellowTeam no encontrado.' });
        }

        return res.send({ message: 'YellowTeam eliminado exitosamente.', greenTeam: deletedYellowTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el YellowTeam', error: err.message });
    }
};


export const getAllYellowTeams = async (req, res) => {
    try {
        const yellowTeam = await YellowTeam.find().populate({
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
        for (let item of yellowTeam) {
            item.partie.logo = `${baseUrl}${item.partie.logo}`
        }
        return res.send(yellowTeam)
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los yellowTeam', error: err.message });
    }
};

export const getYellowTeamByPartyName = async (req, res) => {
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
        const yellowTeams = await YellowTeam.find({ partie: { $in: partyIds } }).populate({
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

        if (!yellowTeams.length) {
            return res.status(404).send({ message: 'No se encontraron yellowTeams con ese nombre de partido.' });
        }

        return res.send(yellowTeams);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar los yellowTeams', error: err.message });
    }
};

export const getYellowTeamByPartyId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' });
        }

        const yellowTeam = await YellowTeam.findOne({ partie: id }).populate({
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

        if (!yellowTeam) {
            return res.status(404).send({ message: 'yellowTeam no encontrado.' });
        }

        return res.send(yellowTeam);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar el yellowTeam', error: err.message });
    }
};


export const getYellowTeamCandidatesByLocation = async (req, res) => {
    try {
        const { departmentId, town } = req.body;

        if (!departmentId && !town) {
            return res.status(400).send({ message: 'Se requiere al menos el departamento o el municipio.' });
        }

        const match = {};
        if (departmentId) match.department = departmentId;
        if (town) match.town = town;

        const yellowTeams = await YellowTeam.find()
            .populate({
                path: 'candidates.user',
                match: match,
                select: 'name surname department town'
            });

        const candidatesByLocation = yellowTeams.reduce((acc, team) => {
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
