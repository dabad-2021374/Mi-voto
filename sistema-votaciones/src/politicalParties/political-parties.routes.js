import { Router } from "express";
import { activateParty,  addDistrictDeputy, getMayorsByTown,  addMayorTeamMember,  addNationalListDeputy,  addParlamentDeputy,  addPresidentialTeam,  createPartiesMain, deactivateParty,  getActiveParties,  getAllParties, getPartiesByUser, getPartyByName, test, updateDistrictDeputies, updateMayorTeam, updateNationalListDeputies, updateParlamentDeputies, updatePartieMain, updatePresidentialTeam } from "./political-parties.controller.js";
import { isAdminPartie, isAdminPlatform, validateJwt } from "../middlewares/validate-jwt.js";
const api = Router();

api.get('/test', test )
api.post('/createPartiesMain', [validateJwt, isAdminPlatform],   createPartiesMain)
api.post('/addPresidentialTeam', [validateJwt, isAdminPartie],  addPresidentialTeam)
api.post('/addNationalListDeputy',  [validateJwt, isAdminPartie], addNationalListDeputy)
api.post('/addDistrictDeputy', [validateJwt, isAdminPartie], addDistrictDeputy)
api.post('/addParlamentDeputy', [validateJwt, isAdminPartie],  addParlamentDeputy)
api.post('/addMayorTeamMember', [validateJwt, isAdminPartie],  addMayorTeamMember)
api.get('/getPartiesByUser',[validateJwt], getPartiesByUser)

api.put('/updatePartieMain', [validateJwt, isAdminPartie],  updatePartieMain);
api.put('/updatePresidentialTeam', [validateJwt, isAdminPartie],  updatePresidentialTeam);
api.put('/updateNationalListDeputies',[validateJwt, isAdminPartie],  updateNationalListDeputies);
api.put('/updateDistrictDeputies', [validateJwt, isAdminPartie], updateDistrictDeputies);
api.put('/updateParlamentDeputies',[validateJwt, isAdminPartie],  updateParlamentDeputies);
api.put('/updateMayorTeam', [validateJwt, isAdminPartie], updateMayorTeam);

api.get('/deactivateParty', [validateJwt, isAdminPartie], deactivateParty)
api.get('/activateParty', [validateJwt, isAdminPartie], activateParty)
api.get('/getAllParties', getAllParties)
api.get('/getPartyByName/:name', [validateJwt], getPartyByName)
api.get('/getActiveParties', [validateJwt], getActiveParties)
api.get('/getMayorsByTown', [validateJwt], getMayorsByTown)

export default api;
