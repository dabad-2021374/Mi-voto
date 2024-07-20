import {Router} from 'express'
import { createGreenTeam, deleteGreenTeam, getAllGreenTeams, getCandidatesByLocation, getGreenTeamByPartyId, getGreenTeamByPartyName, updateGreenTeam } from './green-team.controller.js'
import {isAdminPartie, isAdminPlatform, validateJwt} from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createGreenTeam', [validateJwt, isAdminPlatform], createGreenTeam)
api.put('/updateGreenTeam/:id', [validateJwt, isAdminPlatform], updateGreenTeam)
api.delete('/deleteGreenTeam/:id', [validateJwt, isAdminPlatform], deleteGreenTeam)
api.get('/getAllGreenTeams', getAllGreenTeams)
api.get('/getGreenTeamByPartyName/:name', getGreenTeamByPartyName)
api.get('/getGreenTeamByPartyId/:id', getGreenTeamByPartyId)
api.get('/getCandidatesByLocation', getCandidatesByLocation)

export default api