import { Router } from "express";
import { create, get, test } from "./pink-ballot.controller.js";
import { validateJwt, isVoter } from "../middlewares/validate-jwt.js";

const api = Router();

//=========================//
//      Rutas Publicas    //
//=======================//

api.get('/test', test);
api.get('/get', get);

//=========================//
//      Rutas Privadas    //
//=======================//

api.post('/create/:idTeam', [validateJwt, isVoter], create);

export default api;