import { Router } from "express"
import { addProfesion, deleteProfesion, editProfession, getProfesions } from "./professions.controller.js"
import { isAdminPlatform, validateJwt } from "../middlewares/validate-jwt.js"

const api = Router()

api.post('/addProfesion',[validateJwt, isAdminPlatform], addProfesion)
api.get('/getProfesions', getProfesions)
api.delete('/deleteProfesion/:id',[validateJwt, isAdminPlatform], deleteProfesion)
api.put('/editProfession/:id',[validateJwt, isAdminPlatform], editProfession)


export default api
