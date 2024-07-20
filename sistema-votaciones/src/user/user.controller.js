'use strict'
import jwt from 'jsonwebtoken';
import User from './user.model.js';
import Department from './../department/department.model.js';
import { checkEncrypt, encrypt, checkUpdate } from './../../utils/validator.js';
import { generateJwt } from './../../utils/jwt.js';
import Initiative from './../initiatives/initiatives.model.js';
import Experience from './../experience/experience.model.js';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';
import { google } from 'googleapis';
const OAuth2 = google.auth.OAuth2;
import accountTransport from './../../account_transport.json' assert { type: 'json' };


// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio base de la aplicación
const __dirname = dirname(__filename);
/*====================*/
/*        EMAIL       */
/*====================*/

const mail_rover = async (callback) => {
    const oauth2Client = new OAuth2(
        accountTransport.auth.clientId,
        accountTransport.auth.clientSecret,
        "https://developers.google.com/oauthplayground",
    );
    oauth2Client.setCredentials({
        refresh_token: accountTransport.auth.refreshToken,
        tls: {
            rejectUnauthorized: false
        }
    });
    oauth2Client.getAccessToken((err, token) => {
        if (err)
            return console.log(err);;
        accountTransport.auth.accessToken = token;
        callback(nodemailer.createTransport(accountTransport));
    });
};

function sendMail(req, user, callback) {
    const baseUrl = `${req.protocol}://${req.get('host')}/`;
    const mailOptions = {
        from: accountTransport.user,
        to: user.email,
        bcc: 'mivoto.gt@gmail.com',
        subject: 'Mi Voto | Credenciales',
        text: `Hola ${user.username}, tu código de acceso es ${user.code}. Bienvenido a nuestra plataforma.`,
        html: `<p>Hola ${user.username},</p><p>Tu código de acceso es <strong>${user.code}</strong>. Bienvenido a nuestra plataforma.</p>`
    };

    mail_rover(function (emailTransporter) {
        emailTransporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error al enviar el correo:', error);
            } else {
                console.log('Correo enviado correctamente:', info.response);
                callback(); // Llama al callback cuando el correo se haya enviado correctamente
            }
        });
    });
}

// Configuración del transportador SMTP
/* const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mivoto@gmail.com',
        pass: '9ypZbjZx%123',
    },
}); */

// Detalles del correo
/* const mailOptions = {
    from: 'tu_correo@gmail.com',
    to: 'correo_destino@example.com',
    subject: 'Prueba de envío de correo desde Node.js',
    text: 'Este es un correo de prueba enviado con Nodemailer desde Node.js.',
}; */

/*====================*/
/*        TEST        */
/*====================*/

export const test = (req, res) => {
    console.log('User test is runing.')
    return res.send({ message: 'User test is running...' })
}

function generarCodigo() {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
}

function saveUserImage(file, userId) {
    const newName = `${userId}.jpg`
    const newPath = `userImages/${newName}`;
    fs.renameSync(file.path, newPath);
    console.log('USANDO SAVE USER IMAGEEE');
    return newPath;
}

/*====================*/
/*       LOGIN        */
/*====================*/

//Funcion para logearse con usuario o correo (clientes y administradores)
export const login = async (req, res) => {
    try {
        //solicitamos el codigo unico, el username y la password del usuario.
        let { code, username, password, location } = req.body;
        //buscamos al usuario por su username o por su email
        let user = await User.findOne({ $or: [{ username }, { email: username }] });
        if (!user) return res.status(404).send({ message: `Credenciales no válidas.` })

        //validamos el codigo del usuario
        if (code != user.code) return res.status(400).send({ message: `Credenciales inválidas.` })

        //validamos que el usuario este activo
        if (user.status == false) return res.status(403).send({ message: `Sin acceso.` });


        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        // Obtener la dirección IP del usuario
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        //realizar un checkEncrypt de password
        if (await checkEncrypt(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                surname: user.surname,
                DPI: user.DPI,
                role: user.role,
                partie: user.partie,
                voterRegistration: user.voterRegistration,
                photo: `${baseUrl}${user.photo}`
            }

            console.log(ip);

            //generar el token y enviarlo como respuesta.
            let token = await generateJwt(loggedUser);
            // Enviar correo


            return res.send({
                message: `Bienvenido ${user.username}`,
                loggedUser,
                token
            });

        }
        //si no coincide la contrasenia
        return res.status(400).send({ message: `Credenciales inválidas.` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error en login.`, err });
    }
}

/*====================*/
/*      CREATE        */
/*====================*/

//función para registrar usuarios a votar.
export const register = async (req, res) => {
    try {
        // Pedimos la data del body.
        let data = req.body;

        // Se asigna imagen default al usuario desde el modelo...
        // El usuario podrá modificar su foto desde su perfil.

        let existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).send({ message: 'El nombre de usuario ya está en uso.' });
        }

        // Encriptar la contraseña
        data.password = await encrypt(data.password);

        // Ingresamos el rol cliente por defecto
        if (!data.role) data.role = 'USUARIO';

        //buscamos el departamento
        let departmentFind = await Department.findOne({ _id: data.department });
        if (!departmentFind) return res.status(404).send({ message: `Departamento no encontrado` });

        //buscar el municipio
        let municipality = departmentFind.town.find(m => m.name === data.town);
        if (!municipality) return res.status(404).send({ message: `Municipio no encontrado` });

        //validar email
        if (!data.email) return res.status(400).send({ message: `Email requerido.` })

        //generar codigo
        let code;
        let exist = true;

        while (exist) {
            code = generarCodigo();
            const codeExist = await User.findOne({ code });
            if (!codeExist) {
                exist = false;
            }
        }

        // Almacenamos el código en los datos del usuario
        data.code = code;

        //validamos el genero para colocar la foto de perfil por defecto.
        if (data.gender && data.gender == 'F') {
            data.photo = 'userImages/defaultProfileWoman.jpg'
        }//si no es F entonces el modelo asigna automaticamente el M

        // Almacenamos el usuario en la base de datos
        let user = new User(data);
        await user.save();

        const baseUrl = `${req.protocol}://${req.get('host')}/`;

        //generamos el token
        let loggedUser = {
            uid: user._id,
            username: user.username,
            name: user.name,
            surname: user.surname,
            DPI: user.DPI,
            role: user.role,
            partie: user.partie,
            voterRegistration: user.voterRegistration,
        };

        let token = await generateJwt(loggedUser);


        //inyectamos la foto con base http para la consulta en el servidor.
        user.photo = `${baseUrl}${user.photo}`;
        // Opciones del correo electrónico

        sendMail(req, user, () => {
            // Retornar respuesta de registro exitoso
            return res.send({ message: `Usuario registrado exitosamente!`, user, token });
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al registrar usuario.`, err });
    }
}

//función para que un adminsitrador registre usuarios
export const registerAdmin = async (req, res) => {
    try {
        //solicitamos la data del body.
        let data = req.body;

        //se asigna imagen default al usuario desde el modelo...
        //el usuario podra modificar su foto desde su perfil

        //validamos que venga el rol
        if (!data.role) {
            return res.status(400).send({ message: `Rol es requerido.` });
        }

        //validamos si el rol es admin platform
        //si es admin platform lo denegamos, se lleva otro proceso para crear un administrador de plataforma
        if (data.role.toUpperCase() == 'ADMINISTRADOR-PLATAFORMA') return res.status(400).send({ message: 'Rol inválido' });

        //encriptar la contrasenia
        data.password = await encrypt(data.password);

        //generar codigo
        let code;
        let exist = true;

        while (exist) {
            code = generarCodigo();
            const codeExist = await User.findOne({ code });
            if (!codeExist) {
                exist = false;
            }
        }

        // Almacenamos el código en los datos del usuario
        data.code = code;

        //guardamos el usuario en la db.
        let user = new User(data);
        await user.save();

        //retornamos respuesta de registro exitoso.
        return res.send({ message: `Usuario registrado exitosamente!`, user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al registrar usuario.`, err });
    }
}

/*====================*/
/*       READ         */
/*====================*/

//método para obtener un usuario de rol funcionario
export const get = async (req, res) => {
    try {
        //obtenemos el id de los parametros. /:id
        let { id } = req.params;

        //buscamos al funcionario
        let user = await User.findOne({ _id: id, role: 'FUNCIONARIO' })
            .select('-password -code -DPI -phone -address -email')
            .populate('department', 'department')
            .populate('profession', 'nameProfession')
            .populate('partie', 'name');

        //validamos si se encontro algun fincionario.
        if (!user) {
            return res.status(404).send({ message: `Funcionario no encontrado.` });
        }

        //traemos las iniciativas que tenga ese funcionario
        let initiatives = await Initiative.find({ user: id });
        //traemos la experiencia que contenga
        let experience = await Experience.find({ user: id });

        //validamos si tiene experiencia o iniciativas
        if (initiatives || experience) {
            user = user.toObject();//objeto mongoose en un objeto js.
            user.initiatives = initiatives;
            user.experience = experience;
        }

        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        user.photo = `${baseUrl}${user.photo}`

        //mensaje de respuesta
        return res.send({ user });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: `Error al obtener usuario`, err })
    }
}

//metodo para obtener el perfil de la persona logeada.
export const getProfile = async (req, res) => {
    try {
        //obtener el id de la sesion de usuario
        let { _id } = req.user;
        //buscamos el usuario
        let user = await User.findOne({ _id }).select('-code -password').populate('profession');
        //retornamos el usuario
        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        user.photo = `${baseUrl}${user.photo}`
        return res.send({ message: user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al obtener perfil.` });
    }
}

//funcion para obtener administradores de partido sin partido asignado
export const getAdminPartieNotAsigned = async (req, res) => {
    try {
        const users = await User.find({
            role: 'ADMINISTRADOR-PARTIDO',
            partie: { $exists: false }
        }).select('name surname');

        return res.send({ users });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error al obtener administradores de partido.' });
    }
}
/*====================*/
/*       UPDATE       */
/*====================*/


//modificar perfil personal - user
export const updateProfile = async (req, res) => {
    try {
        //obtenemos los datos del body
        let data = req.body;
        //obtenemos el id y el rol del usuario logeado.
        let { _id, role } = req.user;

        //validamos el formulario
        if (!data || Object.entries(data).length == 0) return res.status(400).send({ message: `Formulario vacio.` });
        //validamos que se pueda modificar la data.
        if (!checkUpdate(data, role)) return res.status(400).send({ message: `No se pudo modificar.` });

        //filtramos los datos que se pueden modificar
        //(phone, profession, email)

        let updateData = {}
        if (data.phone && data.phone.length < 8) return res.status(400).send({ message: `Longitud de teléfono incorrecto.` });
        if (data.profession && data.profession.trim() == '') return res.status(400).send({ message: `Profesion inválida` });
        if (data.email && data.email.trim() == '') return res.status(400).send({ message: `Email inválido.` });
        if (data.phone && data.phone.length >= 8) updateData.phone = data.phone;
        if (data.profession && data.profession.trim() != '') updateData.profession = data.profession;
        if (data.email && data.email.trim() != '') updateData.email = data.email;

        //validamos si hay un cambio de imagen
        if (req.file) {
            const imagePath = saveUserImage(req.file, _id);
            updateData.photo = imagePath;

            //elimino la foto de la base de datos si no es la imagen por defecto
            const oldUser = await User.findById(_id);
            if (oldUser.photo && !['userImages/defaultProfile.jpg', 'userImages/defaultProfileWoman.jpg'].includes(oldUser.photo)) {
                const oldImagePath = path.join(__dirname, `../${oldUser.photo}`);
                fs.unlink(oldImagePath, (err) => {
                    if (err) console.error(err);
                });
            }
        }

        //buscamos el usuario y actualizamos
        let user = await User.findOneAndUpdate(
            { _id },
            updateData,
            { new: true }
        );

        //mensaje de respuesta
        return res.send({ user });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error to modify profile`, err })
    }
}

//modificar usuario -adminplatform
export const updateProfileUser = async (req, res) => {
    try {
        let { id } = req.params;
        let { password, role } = req.user;
        let data = req.body;

        //validar el body
        if (!data || Object.entries(data).length == 0) return res.status(400).send({ meesgae: `Data is empty` });
        if (!data.adminPassword) return res.status(400).send({ message: `Confirm your admin password` });

        if (!checkUpdate(data, role)) {
            return res.status(400).send({ message: `Can't modify password` })
        }

        if (!checkEncrypt(data.adminPassword, password)) return res.status(401).send({ message: `Invalid admin credentials` });

        let user = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).select('-password -code');

        return res.send({ message: `Profile modify successfully`, user });

    } catch (err) {
        console.error(err);
        return res.status(500).send({ mesasge: `Error to mofidy other user` });
    }
}

//modificar contraseña - cuenta personal
export const modifyPassword = async (req, res) => {
    try {
        let { oldPassword, newPassword } = req.body;
        let { _id, password } = req.user;

        if (!oldPassword || oldPassword == '') return res.status(400).send({ message: `Entry your old password` });
        if (!newPassword || newPassword == '') return res.status(400).send({ message: `Entry your new password` });

        console.log('Compare: ', checkEncrypt(oldPassword, password));
        if (!await checkEncrypt(oldPassword, password)) return res.status(401).send({ mesasge: `Invalid credentials` });

        await User.findOneAndUpdate(
            { _id },
            { $set: { password: await encrypt(newPassword) } }
        );

        return res.send({ message: `Password modified successfully` });

    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: `Error modifying password` });
    }
}

/*====================*/
/*       DELETE       */
/*====================*/

//eliminar cuenta personal - user
export const deleteUser = async (req, res) => {
    try {
        //obtenemos los datos del usuario logeado
        let { _id, password } = req.user;
        //validar si el body tiene datos (eliminar a alguien mas)
        let data = req.body;
        if (data && Object.entries(data).length !== 0) {
            //pedir contraseña de la cuenta para confirmar eliminacion
            if (!data.password) return res.staus(400).send({ message: `Confirmation password required.` });
        } else {
            return res.status(400).send({ message: `Error: Data is empty` });
        }

        if (await checkEncrypt(data.password, password)) {
            await User.updateOne(
                { _id },
                { $set: { state: false } }
            )
            return res.send({ message: `Acount deleted successfully` });
        } else {
            return res.status(401).send({ message: `Invalid credentials.` });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error deleting account.`, err });
    }
}

//eliminar cuenta - admin
export const deleteOtherUser = async (req, res) => {
    try {
        //obtenemos el id del usuario a eliminar
        let { id } = req.params;
        //obtenemos la contraseña admin para poder confirmar luego
        let { password } = req.user;
        //obtenemos la data que envia el admin
        let data = req.body;

        //verificamos que exista el usuario
        let user = await User.findOne({ _id: id });
        if (!user) return res.status(404).send({ message: `User not found` });

        //validamos que el body traiga la data necesaria
        if (!data && Object.entries(data).length == 0) {
            return res.status(400).send({ message: `Data is empty` });
        } else {
            if (!data.password) return res.status(400).send({ message: `Confirm your passoword` });
        }

        //confirmacion de contrasenia
        if (!await checkEncrypt(data.password, password)) {
            return res.status(401).send({ message: `Invalid credentials` });
        }

        await User.updateOne(
            { id },
            { $set: { status: false } }
        );
        return res.send({ message: `Account deleted successfully` });
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: `Error deleting other user`, err });
    }
}

/*====================*/
/*  EMPADRONAMIENTO   */
/*====================*/

//Funcion para poder empadronarse (necesita tener una cuenta)

export const empadronamiento = async (req, res) => {
    try {
        //obtenemos el id del usuario registrado
        let id = req.user._id;
        //recopilamos la data esperada en el form
        let { phone, profession, email, department, town, address, literacy, sight } = req.body;

        //validamos la data
        if (!phone || !profession || !email || !department || !town || !address || !literacy || !sight) return res.status(400).send({ message: `Faltan campos obligatorios` });
        //validamos la longitud de la data
        if (phone.length < 8 || profession.length < 3 ||
            email.length < 9 || department.length < 4 ||
            town.length == 0 || address.length < 5 ||
            literacy.length < 3 || sight.length < 7) return res.status(400).send({ message: `Campos con longitud inválida.` });

        //obtenemos el año actual
        let year = new Date().getFullYear();

        //modificamos al usuario y si tiene un estado activo
        let user = await User.findOneAndUpdate(
            { _id: id, state: true, voterRegistration: false },
            { $set: { phone, profession, email, department, town, address, voterRegistration: true, dateVoterRegistration: year, literacy, sight } },
            { new: true }
        );

        if (!user) return res.status(404).send({ message: `Usuario no encontrado.` });

        return res.send({ message: `Usuario empadronado correctamente`, user });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al empadronarse` });
    }
}

//funcion para quitar el empadronamiento a todos los usuarios
export const resetRegisterUser = async (req, res) => {
    try {
        //buscamos a los usuarios empadronados
        let users = await User.find({ voterRegistration: true })

        //validamos users
        if (!users) return res.status(404).send({ message: `todos los usuarios en desempadronamiento` });

        //a cada usuario le quitamos el empadronamiento
        for (const user of users) {
            user.voterRegistration = false;
            await user.save();
        }

        //mensaje de respuesta
        return res.send({ message: `Usuarios desempadronados correctamente.` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: `Error al desempadronar a los usuarios.` });
    }
}

/*============================================================================ */

/* USUARIOS AL ARRANCAR EL PROYECTO */

// Función para crear un administrador de plataforma por defecto.
export const createAdminPlataform = async () => {
    try {
        let user = await User.findOne({ username: 'jnoj' });
        let department = 'Guatemala';
        let townName = 'Mixco';

        if (!user) {

            // Obtenemos el id del departamento de Guatemala
            let departamentoFind = await Department.findOne({ department: department });

            if (!departamentoFind || !departamentoFind._id) {
                console.log('Departamento no encontrado');
                return;
            }

            // Buscar si el municipio existe en el departamento seleccionado y obtener su id
            let municipality = departamentoFind.town.find(m => m.name === townName);

            if (!municipality) {
                console.log('Municipio no encontrado.');
                return;
            }

            // Generamos un código único
            let code;
            let existe = true;
            while (existe) {
                code = generarCodigo();
                const codigoExistente = await User.findOne({ code });
                if (!codigoExistente) {
                    existe = false;
                }
            }

            console.log('Creando admin-platform...');
            let admin = new User({
                code: code,
                username: 'jnoj',
                password: '12345',
                name: 'Josue',
                surname: 'Noj',
                birthdate: '1998/05/19',
                DPI: '1234567890123',
                phone: '87654321',
                gender: 'M',
                department: departamentoFind._id,
                town: municipality.name,
                address: '0 calle A, 0-00 zona 1',
                profession: '66567121ae0d3b5640dee1f5',
                email: 'jnoj@kinal.org.gt',
                role: 'ADMINISTRADOR-PLATAFORMA'
            });
            admin.password = await encrypt(admin.password);
            await admin.save();
            return console.log({ message: `Registro exitoso. \nPuede logearse con ${admin.username} y la contraseña 12345` });
        }
        console.log({ message: `ADMIN | Puede logearse con el username: ${user.username} y la contraseña 12345` });

    } catch (err) {
        console.error(err);
        return err;
    }
}

//funcion para crear un usuario por defecto.
export const createUser = async () => {
    try {
        let user = await User.findOne({ username: 'caltan' });

        const department = 'Sololá';
        const townName = 'Sololá';

        if (!user) {
            //buscar el departamento
            let departmentFind = await Department.findOne({ department });
            if (!departmentFind) return console.log(`Departamento no encontrado.`);

            //buscar si el municipio existe
            let municipality = departmentFind.town.find(m => m.name === townName);
            if (!municipality) return console.log(`Municipio no encontrado.`);

            // Generamos un código único
            let code;
            let existe = true;
            while (existe) {
                code = generarCodigo();
                const codigoExistente = await User.findOne({ code });
                if (!codigoExistente) {
                    existe = false;
                }
            }

            console.log('Creando usuario...')
            let admin = new User({
                code: code,
                username: 'caltan',
                password: '12345',
                name: 'Carlos Daniel',
                surname: 'Altán Cortez',
                birthdate: '2005/05/24',
                DPI: '1234567890321',
                phone: '12345678',
                gender: 'M',
                department: departmentFind._id,
                town: municipality.name,
                address: '0 calle A, 0-00 zona 2',
                profession: '66567121ae0d3b5640dee203',
                email: 'caltan@kinal.edu.gt',
                role: 'USUARIO'
            });
            admin.password = await encrypt(admin.password);
            await admin.save();
            return console.log({ message: `Registro exitoso. \nPuede logearse con ${admin.username} y la contraseña 12345` });
        }
        console.log({ message: `USUARIO | Puede logearse con el username: ${user.username} y la contraseña 12345` });

    } catch (err) {
        console.error(err);
        return err;
    }
}

//funcion para crear un funcionario por defecto.
export const createOfficer = async () => {
    try {
        let user = await User.findOne({ username: 'jrealiquez' });

        const department = 'Guatemala';
        const townName = 'Guatemala';

        if (!user) {
            //buscamos el departamento
            let departmentFind = await Department.findOne({ department });
            if (!departmentFind) return console.log(`Departamento no encontrado.`);

            //buscar el municipio
            let municipality = departmentFind.town.find(m => m.name === townName);
            if (!municipality) return console.log(`Municipio no encontrado`);

            //generar codigo
            let code;
            let exist = true;

            while (exist) {
                code = generarCodigo();
                const codeExist = await User.findOne({ code });
                if (!codeExist) {
                    exist = false;
                }
            }
            console.log('Creando funcionario...')
            let admin = new User({
                code: code,
                username: 'jrealiquez',
                password: '12345',
                name: 'Joshua Elí Isaac',
                surname: 'Realiquez Sosa',
                birthdate: '2005/07/19',
                DPI: '3012749090101',
                phone: '65432187',
                gender: 'M',
                department: departmentFind._id,
                town: municipality.name,
                address: '0 calle A, 0-00 zona 13',
                profession: '66567121ae0d3b5640dee203',
                email: 'jrealiquez@kinal.edu.gt',
                role: 'FUNCIONARIO',
                partie: '66551da39b86bcbd3283c1bd'
            });
            admin.password = await encrypt(admin.password);
            await admin.save();
            return console.log({ message: `Registro exitoso. \nPuede logearse con ${admin.username} y la contraseña 12345` });
        }
        console.log({ message: `FUNCIONARIO | Puede logearse con el username: ${user.username} y la contraseña 12345` });

    } catch (err) {
        console.error(err);
        return err;
    }
}