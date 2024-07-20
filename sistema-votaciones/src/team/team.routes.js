import {Router} from 'express'
import { createTeam, deleteTeam, getAllTeams, updateTeam } from './team.controller.js'

const api = Router()

api.post('/createTeam', createTeam)
api.put('/updateTeam/:id', updateTeam)
api.delete('/deleteTeam/:id', deleteTeam)
api.get('/getAllTeams/:id', getAllTeams)

export default api