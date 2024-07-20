import WhiteTeam from './white-team.model.js';
import Parties from './../politicalParties/political-parties.model.js';

//funcion para unir los equipos blancos por partido
export const createWhiteTeam = async (req, res) => {
    try {
        // Obtenemos los partidos
        let parties = await Parties.find().select('name presidentialTeam position').sort({ position: 1 });

        // Validamos si existen partidos
        if (!parties || parties.length === 0) {
            return res.status(404).send({ message: 'No se encontraron partidos.' });
        }

        const currentYear = new Date().getFullYear();
        const messages = [];  // Array para acumular mensajes de errores y confirmaciones

        // Creamos los equipos presidenciales de cada partido
        for (const party of parties) {
            console.log('PARTIDO', party);
            const presidentialTeam = party.presidentialTeam;

            // Validamos que el equipo presidencial exista y tenga un máximo de 2
            if (!presidentialTeam || presidentialTeam.length !== 2) {
                messages.push(`Partido ${party.name} no cumple requisitos.`);
                continue;  // Salta a la siguiente iteración del bucle
            }

            // Verificamos si ya existe un equipo presidencial para el partido en el año actual
            const existingWhiteTeam = await WhiteTeam.findOne({
                partie: party._id,
                year: currentYear
            });

            if (existingWhiteTeam) {
                console.log(`Equipo presidencial ${party.name} en el año ${currentYear} ya existe.`);
                messages.push(`Equipo presidencial ${party.name} en el año ${currentYear} ya existe.`);
                continue;  // Saltar la creación de este equipo presidencial
            } else {
                // Creamos el equipo presidencial
                const newWhiteTeam = new WhiteTeam({
                    partie: party._id,
                    candidates: presidentialTeam,
                    year: currentYear  // Asegúrate de agregar el año actual
                });

                // Guardamos los partidos en la db
                await newWhiteTeam.save();
                messages.push(`Equipo presidencial para ${party.name} creado exitosamente.`);
            }
        }

        return res.send({ message: 'Proceso completado.', details: messages });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al crear los equipos presidenciales', error: err.message });
    }
};

//funcion para mostrar todos los equipos
export const get = async (req, res) => {
    try {
        let whiteTeams = await WhiteTeam.find()
            .populate({
                path: 'partie',
                select: 'colorHex logo position',
            })
            .populate({
                path: 'candidates.user',
                select: '-password -code -DPI -phone -address -email'
            })
            .populate('candidates.district');

        if (!whiteTeams || whiteTeams.length === 0) {
            return res.status(404).send({ message: 'No se encontraron equipos presidenciales.' });
        }

        whiteTeams.sort((a, b) => a.partie.position - b.partie.position);

        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        whiteTeams.forEach(team => {
            if (team.partie && team.partie.logo) {
                team.partie.logo = `${baseUrl}${team.partie.logo}`;
            } else {
                team.partie.logo = `${baseUrl}/partiesImage/defaultpartie.jpg`
            }

            team.candidates.forEach(cand => {
                if (cand && cand.user) {
                    if (cand.user.photo) {
                        if (!cand.user.photo.startsWith('http')) {
                            cand.user.photo = `${baseUrl}${cand.user.photo}`;
                        }
                    } else {
                        cand.user.photo = `${baseUrl}/partiesImage/defaultpartie.jpg`;
                    }
                } else if (cand) {
                    cand.user = { photo: `${baseUrl}/partiesImage/defaultpartie.jpg` };
                }
            });
        });
        return res.send({ whiteTeams });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener equipos presidenciales.` });
    }
}
