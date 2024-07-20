import { Router } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs'; // Importar el módulo fs
import { test, register, login, get, getProfile, deleteUser, deleteOtherUser, updateProfile, updateProfileUser, modifyPassword, empadronamiento, resetRegisterUser, getAdminPartieNotAsigned, registerAdmin } from "./user.controller.js";
import { validateJwt, isAdminPlatform, isUser, isVoter } from './../middlewares/validate-jwt.js';

const api = Router();

// Crear el directorio si no existe
const ensureDirExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = 'dataImages/';
        ensureDirExists(dir); // Verificar y crear el directorio si no existe
        cb(null, dir); // Directorio donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        const userId = req.user._id.toString(); // Convertir ObjectId a cadena
        const extension = path.extname(file.originalname); // Obtener la extensión del archivo
        cb(null, `${userId}${extension}`); // Configurar el nombre del archivo como userId con extensión
    }
});

const upload = multer({ storage: storage });

//=========================//
//      Rutas Publicas    //
//=======================//

//test
api.get('/test', test);

//logearse
api.post('/', login);

api.post('/register', register);

api.get('/getAdminsPartie', getAdminPartieNotAsigned);

/*============================ */
/*Rutas Privadas - PERSONALES */
/*============================ */

//eliminar cuenta de forma personal
api.put('/delete', [validateJwt], deleteUser);

//modificar de forma personal una cuenta
api.put('/update', [validateJwt, upload.single('userImagePath')], updateProfile);

//modificar password
api.put('/change-password', [validateJwt], modifyPassword);

//obtener funcionarios
api.get('/get/:id', get);

//obtener perfil personal
api.get('/myProfile', [validateJwt], getProfile);

api.put('/empadronamiento', [validateJwt, isVoter], empadronamiento);

/*============================== */
/*Rutas Privadas - AdminPlatform */
/*============================== */

//eliminar la cuenta a otro usuario
api.put('/deleteUser/:id', [validateJwt, isAdminPlatform], deleteOtherUser);

//modificar cuentas a usuarios
api.put('/updateUsers/:id', [validateJwt, isAdminPlatform, upload.single('userImagePath')], updateProfileUser);

api.put('/reset', [validateJwt, isAdminPlatform], resetRegisterUser);

api.post('/registerAdmin', [validateJwt, isAdminPlatform], registerAdmin);

export default api;