'use strict'

import {Router} from 'express'
import { addGreenBallot, countVotesByParty } from './green-ballot.controller.js'
import { isUser, isVoter, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/addGreenBallot/:idTeam',[validateJwt, isVoter], addGreenBallot)
api.get('/countVotesByParty', countVotesByParty)

export default api