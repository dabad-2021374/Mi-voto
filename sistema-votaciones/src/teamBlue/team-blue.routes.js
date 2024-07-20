import {Router} from 'express'
import { createBlueTeam, deleteBlueTeam, getAllBlueTeams, getBlueTeamByPartyId, getBlueTeamByPartyName, updateBlueTeam } from './team-blue.controller.js'
import { isAdminPartie, isAdminPlatform, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createBlueTeam',[validateJwt, isAdminPlatform], createBlueTeam)
api.put('/updateBlueTeam/:id',[validateJwt, isAdminPlatform], updateBlueTeam)
api.delete('/deleteBlueTeam/:id',[validateJwt, isAdminPlatform], deleteBlueTeam)
api.get('/getAllBlueTeams', getAllBlueTeams)
api.get('/getBlueTeamByPartyName/:name', getBlueTeamByPartyName)
api.get('/getBlueTeamByPartyId/:id', getBlueTeamByPartyId)


export default api