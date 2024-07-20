import {Router} from 'express'
import { createYellowTeam, deleteYellowTeam, getAllYellowTeams, getYellowTeamByPartyId, getYellowTeamByPartyName, getYellowTeamCandidatesByLocation, updateYellowTeam } from './yellow-team.controller.js'
import {isAdminPartie, isAdminPlatform, validateJwt} from '../middlewares/validate-jwt.js'
const api = Router()

api.post('/createYellowTeam', [validateJwt, isAdminPlatform],  createYellowTeam)
api.put('/updateYellowTeam/:id', [validateJwt, isAdminPlatform], updateYellowTeam)
api.delete('/deleteYellowTeam/:id', [validateJwt, isAdminPlatform], deleteYellowTeam)
api.get('/getAllYellowTeams', getAllYellowTeams)
api.get('/getYellowTeamByPartyName/:name', getYellowTeamByPartyName)
api.get('/getYellowTeamByPartyId/:id', getYellowTeamByPartyId)
api.get('/getYellowTeamCandidatesByLocation', getYellowTeamCandidatesByLocation)


export default api