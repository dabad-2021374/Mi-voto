'use strict'

import WhiteBallot from './../whiteBallot/white-ballot.model.js';
import WhiteTeam from './../whiteTeam/white-team.model.js';
import GreenBallot from './../greenBallot/green-ballot.model.js';
import GreenTeam from './../greenTeam/green-team.model.js';
import PinkTeam from './../teamPink/team-pink.model.js';
import PinkBallot from './../pinkBallot/pink-ballot.model.js';
import BlueTeam from './../teamBlue/team-blue.model.js';
import BlueBallot from './../blueBallot/blue-ballot.model.js';
import YellowTeam from './../yellowTeam/yellow-team.model.js';
import YellowBallot from './../yellowBallot/yellow-ballot.model.js';

export const getPresidential = async (req, res) => {
    try {
        let statistics = await WhiteBallot.aggregate([
            {
                $group: {
                    _id: '$whiteTeam',
                    count: { $sum: 1 }
                }
            }
        ])

        let whiteTeams = await WhiteTeam.find().select('-candidates').populate({ path: 'partie', select: 'name colorHex acronym' });

        let whiteTeamsMap = {};
        whiteTeams.forEach(team => {
            whiteTeamsMap[team._id.toString()] = team;
        })

        let combinedStatistics = statistics.map(stat => ({
            whiteTeam: whiteTeamsMap[stat._id.toString()],
            count: stat.count
        }));

        return res.send({ combinedStatistics });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener estadística presidencial.` });
    }
}

export const getNationalList = async (req, res) => {
    try {
        // Realizar la agregación para obtener las estadísticas
        let statistics = await GreenBallot.aggregate([
            {
                $group: {
                    _id: '$greenTeam',
                    count: { $sum: 1 }
                }
            }
        ]);

        let greenTeams = await GreenTeam.find().select('-candidates').populate({ path: 'partie', select: 'name colorHex acronym' });

        let greenTeamsMap = {};
        greenTeams.forEach(team => {
            greenTeamsMap[team._id.toString()] = team;
        })

        let combinedStatistics = statistics.map(stat => ({
            greenTeam: greenTeamsMap[stat._id.toString()],
            count: stat.count
        }));

        return res.send({ combinedStatistics });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener estadistica diputados por lista nacional.` })
    }
}

export const getMayor = async (req, res) => {
    try {
        // Realizar la agregación para obtener las estadísticas
        let statistics = await PinkBallot.aggregate([
            {
                $group: {
                    _id: '$pinkTeam',
                    count: { $sum: 1 }
                }
            }
        ]);

        let pinkTeams = await PinkTeam.find().select('-candidates').populate({ path: 'partie', select: 'name colorHex acronym' });

        let pinkTeamsMap = {};
        pinkTeams.forEach(team => {
            pinkTeamsMap[team._id.toString()] = team;
        })

        let combinedStatistics = statistics.map(stat => ({
            pinkTeam: pinkTeamsMap[stat._id.toString()],
            count: stat.count
        }));

        return res.send({ combinedStatistics });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener estadistica de alcaldes.` })
    }
}

export const getDistrictList = async (req, res) => {
    try {
        // Realizar la agregación para obtener las estadísticas
        let statistics = await BlueBallot.aggregate([
            {
                $group: {
                    _id: '$blueTeam',
                    count: { $sum: 1 }
                }
            }
        ]);

        let blueTeams = await BlueTeam.find().select('-candidates').populate({ path: 'partie', select: 'name colorHex acronym' });

        let blueTeamsMap = {};
        blueTeams.forEach(team => {
            blueTeamsMap[team._id.toString()] = team;
        })

        let combinedStatistics = statistics.map(stat => ({
            blueTeam: blueTeamsMap[stat._id.toString()],
            count: stat.count
        }));

        return res.send({ combinedStatistics });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener estadistica diputados distritales.` })
    }
}

export const getParlamentaltList = async (req, res) => {
    try {
        // Realizar la agregación para obtener las estadísticas
        let statistics = await YellowBallot.aggregate([
            {
                $group: {
                    _id: '$yellowTeam',
                    count: { $sum: 1 }
                }
            }
        ]);

        let yellowTeams = await YellowTeam.find().select('-candidates').populate({ path: 'partie', select: 'name colorHex acronym' });

        let yellowTeamsMap = {};
        yellowTeams.forEach(team => {
            yellowTeamsMap[team._id.toString()] = team;
        })

        let combinedStatistics = statistics.map(stat => ({
            yellowTeam: yellowTeamsMap[stat._id.toString()],
            count: stat.count
        }));

        return res.send({ combinedStatistics });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener estadistica diputados departamentales.` })
    }
}


