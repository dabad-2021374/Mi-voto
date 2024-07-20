import {Router} from 'express'
import { createPinkTeam, deletePinkTeam, getMayorByTown, getAllPinkTeams, getPinkTeamByPartyId, getPinkTeamByPartyName, getPinkTeamCandidatesByLocation, updatePinkTeam } from './team-pink.controller.js'
import { isAdminPartie, isAdminPlatform, isVoter, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/createPinkTeam',[validateJwt, isAdminPlatform], createPinkTeam)
api.put('/updatePinkTeam/:id',[validateJwt, isAdminPlatform], updatePinkTeam)
api.delete('/deletePinkTeam/:id',[validateJwt, isAdminPlatform], deletePinkTeam)
api.get('/getAllPinkTeams', getAllPinkTeams)
api.get('/getPinkTeamByPartyName/:name', getPinkTeamByPartyName)
api.get('/getPinkTeamByPartyId/:id', getPinkTeamByPartyId)
api.get('/getPinkTeamCandidatesByLocation', getPinkTeamCandidatesByLocation)
api.get('/get', [validateJwt], getMayorByTown);

export default api