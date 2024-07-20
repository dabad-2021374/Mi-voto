import { AuthPage } from "./pages/Auth/AuthPage";
import { PageNotFound } from "./pages/PageNotFound/PageNotFound";
import { Homepage } from "./pages/HomePage/Homepage";
import { Navigate } from 'react-router-dom';
import { Pruebas } from "./pages/Pruebas/Pruebas";
import { BallotWhite } from "./components/BallotWhite/BallotWhite";
import { BallotGreen } from "./components/BallotGreen/BallotGreen";
import { Join } from "./components/Join/Join";
import { Register } from "./components/Register/Register";
import { Statistics } from "./pages/Statistics/Statistics";
import Parties from "./components/Parties/Parties";
import Candidate from "./components/Candidate/CandidateProfile"
import { BallotBlue } from "./components/BallotBlue/BallotBlue";
import { BallotPink } from "./components/BallotPink/BallotPink";
import { BallotYellow } from "./components/BallotYellow/BallotYellow";
import { Profile } from "./components/Profile/Profile";
import { CitizenVotes } from "./components/CitizenVotes/CitizenVotes"
import {AdminParty} from "./components/AdminParty/AdminParty"
import { ExperienceAndInitiative } from "./components/ExperienceAndInitiative/ExperienceAndInitiative";
import {CandidateDetails} from './components/candidateDetails/CandidateDetails'

export const routes = [
    {
        path: '/',
        element: <Navigate to="/homepage" />
    },
    {
        path: '/homepage',
        element: <Homepage />
    },
    {
        path: '*',
        element: <PageNotFound />
    },
    {
        path: '/authpage',
        element: <AuthPage />
    },
    {
        path: '/registerUser',
        element: <Register />
    },
    {
        path: '/joinpage',
        element: <Join />
    },
    {

        path: '/pruebas',
        element: <Pruebas />
    },
    {
        path: '/papeleta-blanca',
        element: <BallotWhite />
    },
    {
        path: '/papeleta-verde',
        element: <BallotGreen />
    },
    {
        path: '/registrarPartido',
        element: <Parties />
    }, {
        path: '/estadistica',
        element: <Statistics />
    },
    {
        path: '/candidate',
        element: <Candidate />
    },
    {
        path: '/papeleta-azul',
        element: <BallotBlue />
    },
    {
        path: '/papeleta-rosa',
        element: <BallotPink />
    },
    {
        path: '/papeleta-amarilla',
        element: <BallotYellow />
    },
    {
        path: '/myProfile',
        element: <Profile />
    },
    {
        path: '/finalizar-voto',
        element: <CitizenVotes />
    },
    {
        path: '/administrarPartido',
        element: <AdminParty />
    },
    {
        path: '/ExperienciaAndIniciativas',
        element: <ExperienceAndInitiative />
    },
    {
        path: '/candidate-profile/*',
        element: <CandidateDetails/>
    }

];


