import { Router } from 'express'
import { validateJwt, isUser, isAdminPlatform, isFuncionary, isVoter } from '../middlewares/validate-jwt.js';
import { create, get, test } from './citizen-votes.controller.js';

const api = Router();

//=========================//
//      Rutas Publicas    //
//=======================//

api.get('/test', test)
api.get('/', get)


//=========================//
//      Rutas Privadas    //
//=======================//

api.post('/new', [validateJwt, isVoter], create);

export default api;