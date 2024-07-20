'use strict'

import { Router } from 'express'
import { addExperience, addExperienceTwo, deleteExperience, deleteExperienceTwo, getAllExperiences, getExperiences, getExperiencesById, updateExperience, updateExperienceTwo } from './experience.controller.js'
import { isFuncionary, validateJwt } from '../middlewares/validate-jwt.js';

const api = Router()

api.post('/addExperience',[validateJwt, isFuncionary], addExperience)
api.put('/updateExperience',[validateJwt, isFuncionary], updateExperience)
api.delete('/deleteExperience',[validateJwt, isFuncionary], deleteExperience)
api.get('/getExperiences',[validateJwt, isFuncionary], getExperiences)
api.get('/getAllExperiences', getAllExperiences)
//Nuevas consultas
api.post('/addExperienceTwo',[validateJwt, isFuncionary], addExperienceTwo)
api.get('/getExperiencesById/:id', getExperiencesById)
api.delete('/deleteExperienceTwo/:id',[validateJwt, isFuncionary], deleteExperienceTwo)
api.put('/updateExperienceTwo/:id',[validateJwt, isFuncionary], updateExperienceTwo)


export default api