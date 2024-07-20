import { Router } from "express";
import { validateJwt, isUser, isAdminPlatform } from "../middlewares/validate-jwt.js";
import { createDepartments, getDepartments, getMunicipios, getTownsByDepartment } from "./department.controller.js";

const api = Router();

//=========================//
//      Rutas Privadas    //
//=======================//

api.post('/upload', [validateJwt, isAdminPlatform], createDepartments);
api.get('/getMunicipios', getMunicipios)
api.get('/getDepartments', getDepartments)
api.get('/getTownsByDepartment/:id', getTownsByDepartment)

export default api