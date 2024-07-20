'use strict'

import {Router} from 'express'
import {addDistrict, deleteDistrict, getDistrict, updateDistrict} from './districtTeams.controller.js'
import { isAdminPlatform, validateJwt } from '../middlewares/validate-jwt.js'

const api = Router()

api.post('/addDistrict',[validateJwt, isAdminPlatform], addDistrict)
api.get('/getDistrict',[validateJwt], getDistrict)
api.delete('/deleteDistrict/:id',[validateJwt, isAdminPlatform], deleteDistrict)
api.put('/updateDistrict/:id',[validateJwt, isAdminPlatform], updateDistrict)

export default api