'use strict'
import GreenBallot from './green-ballot.model.js'

export const addGreenBallot = async (req, res) => {
    try {
        const userId = req.user._id
        const { idTeam } = req.params
        const currentYear = new Date().getFullYear()
        // Verificar si ya existe una boleta para el usuario o equipo verde en el mismo año
        const existingBallot = await GreenBallot.findOne({
            user: userId,
            createdAt: {
                $gte: new Date(`${currentYear}-01-01`),
                $lte: new Date(`${currentYear}-12-31`)
            }
        })

        if (existingBallot) return res.status(400).send({ message: `Sufragio ${currentYear} realizado` })

        const greenBallot = new GreenBallot({ user: userId, greenTeam: idTeam })
        await greenBallot.save();
        await greenBallot.populate({ path: 'greenTeam', populate: { path: 'partie', select: 'name colorHex acronym' } });
        const count = await GreenBallot.countDocuments({ greenTeam: idTeam });
        req.io.emit('newGreenBallot', {
            greenTeam: { idTeam, name: greenBallot.greenTeam.partie.name, colorHex: greenBallot.greenTeam.partie.colorHex, acronym: greenBallot.greenTeam.partie.acronym },
            count
        });
        return res.send({ message: 'Boleta verde agregada', greenBallot })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al agregar la boleta verde', error })
    }
}


export const getGreenBallots = async (req, res) => {
    try {
        const greenBallots = await GreenBallot.find().populate('greenTeam').select('-user');
        if (!greenBallots.length) return res.status(404).send({ message: 'No se encontraron boletas verdes' })

        return res.send(greenBallots)
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener las papeletas verdes', error })
    }
}

export const countVotesByParty = async (req, res) => {
    try {
        const voteCounts = await GreenBallot.aggregate([
            {
                $lookup: {
                    from: 'greenteams',
                    localField: 'greenTeam',
                    foreignField: '_id',
                    as: 'greenTeamDetails'
                }
            },
            {
                $unwind: '$greenTeamDetails'
            },
            {
                $group: {
                    _id: '$greenTeamDetails.parties',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'parties',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'partyDetails'
                }
            },
            {
                $unwind: '$partyDetails'
            },
            {
                $project: {
                    _id: 0,
                    party: '$partyDetails.name',
                    count: 1
                }
            }
        ]);

        return res.send(voteCounts)
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al realizar el conteo de votos por partido' })
    }
};