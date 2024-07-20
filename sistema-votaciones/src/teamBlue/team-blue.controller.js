import Parties from "../politicalParties/political-parties.model.js";
import BlueTeam from "./team-blue.model.js";

/*export const createBlueTeam = async (req, res) => {
    try {
        const { partyId } = req.body;

        if (!partyId) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' });
        }

        const party = await Parties.findOne({_id: partyId}).select('districtDeputies');

        if (!party) {
            return res.status(404).send({ message: 'Partido no encontrado.' });
        }

        const districtDeputies = party.districtDeputies;

        const newBlueTeam = new BlueTeam({
            parties: partyId,
            candidates: districtDeputies
        });

        await newBlueTeam.save();

        return res.send({ message: 'equipo diputados distrito electoral creado exitosamente.', blueTeam: newBlueTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo diputados distrito electoral', error: err.message });
    }
};*/

export const createBlueTeam = async (req, res) => {
    try {
        //obtenemos los partidos
        let parties = await Parties.find().select('districtDeputies');

        //validamos si existen partidos
        if (!parties || parties.length == 0) return res.status(404).send({ message: 'No se encontraron partidos' });
        const currentYear = new Date().getFullYear();

        //creamos los equipos de diputados distritales de cada partido
        for (const party of parties) {
            const districtDeputies = party.districtDeputies;

            //validamos que el equipo diputados distritales exista 
            if (!districtDeputies || districtDeputies.length == 0) res.status(404).send({ message: `Partido ${party.name} no cumple requisitos.` });


            //verificamos si ya existe un equipo presidencial para el partido en el año actual
            const existingBlueTeam = await BlueTeam.findOne({
                partie: party._id,
                year: {
                    $gte: new Date(`${currentYear}-01-01`),
                    $lte: new Date(`${currentYear}-12-31`)
                }
            });

            if (existingBlueTeam) {
                console.log(`Equipo de diputados distritales ${party.name} en el año ${currentYear} ya existe`);
                continue; // Saltar la creación de este equipo de diputados distritales
            }

            //creamos el equipo diputados distritales
            const newBlueTeam = new BlueTeam({
                partie: party._id,
                candidates: districtDeputies
            })

            //guardamos los partidos en la db
            await newBlueTeam.save();
        }
        return res.send({ message: 'Equipos Diputados distritales creados exitosamente.' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear el equipo Diputados distritales', error: err.message });
    }
};

export const updateBlueTeam = async (req, res) => {
    try {
        let { newPartyId } = req.body;
        let { id } = req.params

        if (!id || !newPartyId) {
            return res.status(400).send({ message: 'ID de BlueTeam y nuevo ID del partido son obligatorios.' });
        }

        const newParty = await Parties.findById(newPartyId).select('districtDeputies');

        if (!newParty) {
            return res.status(404).send({ message: 'Nuevo partido no encontrado.' });
        }

        const districtDeputies = newParty.districtDeputies;

        const updatedBlueTeam = await BlueTeam.findByIdAndUpdate(
            id,
            {
                partie: newPartyId,
                candidates: districtDeputies
            },
            { new: true }
        );

        if (!updatedBlueTeam) {
            return res.status(404).send({ message: 'BlueTeam no encontrado.' });
        }

        return res.send({ message: 'BlueTeam actualizado exitosamente.', blueTeam: updatedBlueTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al actualizar el BlueTeam', error: err.message });
    }
};

export const deleteBlueTeam = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID de BlueTeam es obligatorio.' });
        }

        const deletedBlueTeam = await BlueTeam.findByIdAndDelete(id);

        if (!deletedBlueTeam) {
            return res.status(404).send({ message: 'BlueTeam no encontrado.' });
        }

        return res.send({ message: 'BlueTeam eliminado exitosamente.', blueTeam: deletedBlueTeam });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al eliminar el BlueTeam', error: err.message });
    }
};


export const getAllBlueTeams = async (req, res) => {
    try {
        const blueTeam = await BlueTeam.find().populate({
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
        for(let item of blueTeam){
            item.partie.logo = `${baseUrl}${item.partie.logo}`
        }
        return res.send(blueTeam);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener los blueTeam', error: err.message });
    }
};

export const getBlueTeamByPartyName = async (req, res) => {
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
        const blueTeam = await BlueTeam.find({ partie: { $in: partyIds } }).populate({
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

        if (!blueTeam.length) {
            return res.status(404).send({ message: 'No se encontraron blueTeam con ese nombre de partido.' });
        }

        return res.send(blueTeam);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar los blueTeam', error: err.message });
    }
};

export const getBlueTeamByPartyId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: 'ID del partido es obligatorio.' });
        }

        const blueTeam = await BlueTeam.findOne({ partie: id }).populate({
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

        if (!blueTeam) {
            return res.status(404).send({ message: 'blueTeam no encontrado.' });
        }

        return res.send(blueTeam);
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al buscar el blueTeam', error: err.message })
    }
}