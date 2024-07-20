import { Router } from "express";
import { validateJwt, isAdminPlatform } from "../middlewares/validate-jwt.js";
import { createWhiteTeam, get } from "./white-team.controller.js";

const api = Router();

//=========================//
//      Rutas Publicas    //
//=======================//

api.get('/get', get);

//=========================//
//      Rutas Privadas    //
//=======================//
api.post('/create', [validateJwt, isAdminPlatform], createWhiteTeam);

export default api;