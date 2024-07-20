import { Router } from 'express'
import { createYellowBallot, deleteYellowBallot, getAllYellowBallots, getYellowBallot, updateYellowBallot } from './yellow-ballot.controller.js'
import { isUser, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createYellowBallot/:idTeam', [validateJwt, isUser], createYellowBallot)
api.delete('/deleteYellowBallot/:id', [validateJwt, isUser], deleteYellowBallot)
api.get('/getAllYellowBallots',[validateJwt, isUser], getAllYellowBallots)
api.put('/updateYellowBallot/:id', updateYellowBallot)
api.get('/getYellowBallot', getYellowBallot) //Funcion a utilizar

export default api