'use strict'

import Vote from './citizen-votes.model.js';
import GreenBallot from './../greenBallot/green-ballot.model.js'
import BlueBallot from './../blueBallot/blue-ballot.model.js'
import PinkBallot from './../pinkBallot/pink-ballot.model.js'
import YellowBallot from './../yellowBallot/yellow-ballot.model.js'
import WhiteBallot from './../whiteBallot/white-ballot.model.js'


/*====================*/
/*        TEST        */
/*====================*/
export const test = async (req, res) => {
    try {
        console.log('test votes is running.');
        return res.send({ message: `Test votes corriendo...` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error en el test.` });
    }
}

/*====================*/
/*      CREATE        */
/*====================*/

//funcion para recopilar los votos por ciudadano
/*export const create = async (req, res) => {
    try {
        //traemos el votante logeado
        let { _id, role } = req.user;
        //validamos que el rol no sea adminsitrador de plataforma (no puede vota)
        if (role == 'ADMINISTRADOR-PLATAFORMA') return res.status(401).send({ message: `Error critico.` });

        //traemos las papeletas
        let data = req.body;

        //validar que venga el array
        if (data.length == 0 || !data.ballots || !Array.isArray(data.ballots)) return res.status(400).send({ message: `Formato de papeletas incorrecto.` });
        //validar que vengan las papeletas exactas
        if (data.ballots.length <= 5) return res.status(400).send({ message: `Paquete de papeletas incompleta.` })

        //pasamos el id del usuario logeado
        data.user = _id;
        let vote = new Vote(data);
        await vote.save()
        return res.send({ message: `Voto registrado!!` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al crear papeleta.` });
    }
}
*/
export const create = async (req, res) => {
    try {
        //traemos el votante logeado
        let { _id, role } = req.user
        //validamos que el rol no sea adminsitrador de plataforma (no puede vota)
        if (role === 'ADMINISTRADOR-PLATAFORMA') return res.status(401).send({ message: `Error critico.` })
        let vot = await Vote.findOne({user: _id})
        if(vot) return res.status(401).send({ message: `Error critico. Ya se mandaron las papeletas una vez` })
        let blueBallot = await BlueBallot.findOne({ user: _id }).select('_id').lean()
        let greenBallot = await GreenBallot.findOne({ user: _id }).select('_id').lean()
        let pinkBallot = await PinkBallot.findOne({ user: _id }).select('_id').lean()
        let whiteBallot = await WhiteBallot.findOne({ user: _id }).select('_id').lean()
        let yellowBallot = await YellowBallot.findOne({ user: _id }).select('_id').lean()
        // validar que todas las papeletas existan
        if (!yellowBallot ||!blueBallot || !pinkBallot || !greenBallot || !whiteBallot ) {
            return res.status(400).send({ message: `Paquete de papeletas incompleta.` })
        }
        const data = {
            user: _id,
            ballots: [
                {
                    blueBallot: blueBallot._id,
                    greenBallot: greenBallot._id,
                    pinkBallot: pinkBallot._id,
                    whiteBallot: whiteBallot._id,
                    yellowBallot: yellowBallot._id
                }
            ]
        }
        let vote = new Vote(data)
        await vote.save()
        return res.send({ message: `¡Voto registrado!` })

    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: `Error al crear papeleta.`, error: error })
    }
}

/*====================*/
/*       READ         */
/*====================*/

//funcion para obtener todos los votos
export const get = async (req, res) => {
    try {
        let votes = await Vote.find();
        return res.send({ votes });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener los paquetes de votos.` });
    }
}