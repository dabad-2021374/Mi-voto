import { initServer } from './configs/app.js';
import { connect } from './configs/mongo.js';
import { createUser, createAdminPlataform, createOfficer} from './src/user/user.controller.js';

initServer();
connect();
createAdminPlataform();
createUser();
createOfficer();