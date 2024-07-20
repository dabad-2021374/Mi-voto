import { Router } from 'express';
import { getDistrictList, getMayor, getNationalList, getParlamentaltList, getPresidential } from './statistics.controller.js';

const api = Router();

api.get('/get', getPresidential);

api.get('/getGreenBallot', getNationalList);
api.get('/getWhiteBallot', getPresidential);
api.get('/getPinkBallot', getMayor);
api.get('/getBlueBallot', getDistrictList);
api.get('/getYellowBallot', getParlamentaltList);

export default api;