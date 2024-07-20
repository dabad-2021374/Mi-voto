import { Router } from "express";
import { addInitiative, deleteInitiative, getAllInitiatives, getInitiativeByNumber, getInitiatives, getInitiativesByUser, updateInitiative } from "./initiatives.controller.js";
import { isFuncionary, validateJwt } from "../middlewares/validate-jwt.js"

const api = Router()

api.post('/addInitiative',[validateJwt, isFuncionary], addInitiative)
api.put('/updateInitiative/:id',[validateJwt, isFuncionary], updateInitiative)
api.delete('/deleteInitiative/:id',[validateJwt, isFuncionary], deleteInitiative)
api.get('/getAllInitiatives', getAllInitiatives)
api.get('/getInitiativesByUser/:id', getInitiativesByUser)
api.get('/getInitiatives',[validateJwt], getInitiatives)
api.get('/getInitiativeByNumber', getInitiativeByNumber)

export default api