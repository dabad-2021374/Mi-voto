// app.js

import express from 'express';
import http from 'http'; // Importa el módulo http para usarlo con socket.io
import { Server } from 'socket.io'; // Importa el servidor de socket.io
import fs from 'fs';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { config } from 'dotenv';
import path from 'path';
import userRoutes from './../src/user/user.routes.js';
import voteRoutes from './../src/citizenVotes/citizen-votes.routes.js'
import pinkBallotRoutes from './../src/pinkBallot/pink-ballot.routes.js';
import whiteBallotRoutes from './../src/whiteBallot/white-ballot.routes.js';
import politicalPartiesRoutes from './../src/politicalParties/political-parties.routes.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import districtTeamRoutes from './../src/districtTeam/districtTeams.routes.js'
import professionRoutes from './../src/professions/professions.routes.js'
import initiativesRoutes from './../src/initiatives/initiatives.routes.js'
import experiencesRoutes from './../src/experience/experience.routes.js'
import greenBallotRoutes from './../src/greenBallot/green.ballot.routes.js'
import teamRoutes from './../src/team/team.routes.js'
import greenTeamRoutes from './../src/greenTeam/green-team.routes.js'
import yellowTeamRoutes from './../src/yellowTeam/yellow-team.routes.js'
import yellowBallotRoutes from './../src/yellowBallot/yellow-ballot.routes.js'
import blueBallotRoutes from './../src/blueBallot/blue-ballot.routes.js'
import blueTeamRoutes from './../src/teamBlue/team-blue.routes.js'
import pinkTeamRoutes from './../src/teamPink/team-pink.routes.js'
import departmentRoutes from './../src/department/department.routes.js'
import whiteTeamRoutes from './../src/whiteTeam/white-team.routes.js';
import statisticsRoutes from './../src/statistics/statistics.routes.js';


// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio base de la aplicación
const __dirname = dirname(__filename);

// Configuración
const app = express();
config();
const port = process.env.PORT || 3057;
const socketPort = process.env.SOCKET_PORT || 3060;

// Configuración del servidor
app.use(express.urlencoded({ extended: false }));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(express.json());
// Permitir solicitudes de origen cruzado
app.use(cors({
    origin: ['http://localhost:8001', process.env.SOCKET_ORIGIN || 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(morgan('dev'));

const userImagesPath = path.join(__dirname, '../userImages');
if (!fs.existsSync(userImagesPath)) {
    fs.mkdirSync(userImagesPath, { recursive: true });
}

//ruta para guardar imagenes varias
const staticFilesPath = path.join(__dirname, '../dataImages');
app.use('/dataImages', express.static(staticFilesPath));

//ruta para guardar foto de los usuarios
const staticUserFilesPath = path.join(__dirname, '../userImages');
app.use('/userImages', express.static(staticUserFilesPath));

//ruta para guardar foto de los partidos
const staticPartiesFilesPath = path.join(__dirname, '../partiesImages');
app.use('/partiesImages', express.static(staticPartiesFilesPath));

const server = http.createServer(app); // Crea un servidor HTTP con Express
// Configuración de socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.SOCKET_ORIGIN || "http://localhost:8001",
        methods: ["GET", "POST"],
        credentials: false
    }
});

//midleware
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Declaración de rutas
app.use('/user', userRoutes);
app.use('/vote', voteRoutes);
app.use('/w-ballot', whiteBallotRoutes);
app.use('/p-ballot', pinkBallotRoutes);
app.use('/districtTeam', districtTeamRoutes);
app.use('/profession', professionRoutes);
app.use('/initiative', initiativesRoutes);
app.use('/experience', experiencesRoutes);
app.use('/greenBallot', greenBallotRoutes);
app.use('/parties', politicalPartiesRoutes);
app.use('/team', teamRoutes);
app.use('/greenTeam', greenTeamRoutes);
app.use('/yellowTeam', yellowTeamRoutes);
app.use('/yellowBallot', yellowBallotRoutes);
app.use('/blueBallot', blueBallotRoutes);
app.use('/blueTeam', blueTeamRoutes);
app.use('/pinkTeam', pinkTeamRoutes);
app.use('/department', departmentRoutes);
app.use('/whiteTeam', whiteTeamRoutes);
app.use('/statistics', statisticsRoutes);

// Crea un servidor de websockets con socket.io
// Manejo de conexiones de sockets
io.on('connection', (socket) => {
    console.log('New client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Inicia el servidor HTTP
export const initServer = () => {
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

// Inicia el servidor de Socket.io (opcional, si necesitas escuchar en un puerto diferente)
// io.listen(socketPort);
