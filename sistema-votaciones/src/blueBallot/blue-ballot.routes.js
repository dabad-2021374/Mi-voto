import { Router } from 'express'
import { isUser, validateJwt } from '../middlewares/validate-jwt.js'
import { createBlueBallot, deleteBlueBallot, getAllBlueBallots, getBlueBallot, updateBlueBallot } from './blue-ballot.controller.js'

const api = Router()

api.post('/createBlueBallot/:idTeam', [validateJwt, isUser], createBlueBallot)
api.delete('/deleteBlueBallot/:id', [validateJwt, isUser], deleteBlueBallot)
api.put('/updateYellowBallot/:id', [validateJwt, isUser],  updateBlueBallot)
api.get('/getAllBlueBallots',  getAllBlueBallots)
api.get('/blueBallot', getBlueBallot) //funcion a usar



export default api