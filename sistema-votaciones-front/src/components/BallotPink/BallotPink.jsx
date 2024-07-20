import React, { useState, useEffect } from 'react';
import Navbar from '../Nabvar/Navbar';
import './BallotPink.css';
import { BallotNavigation } from '../BallotNavigation/BallotNavigation';
import { useGetMayorByTown } from '../../shared/hooks/BallotPink/getMayorByTown';
import { useAddPinkB } from '../../shared/hooks/BallotPink/useAddPinkB';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const BallotPink = () => {
    const { getPinkTeamsByTown, isLoading, pinkTeamsByTown } = useGetMayorByTown();
    const { addBallotPink, isLoading: isAdding } = useAddPinkB();
    const [selectedTeam, setSelectedTeam] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getPinkTeamsByTown();
    }, []);

    useEffect(() => {
        console.log(pinkTeamsByTown, 'JSX:');
    }, [pinkTeamsByTown]);

    const handleCardClick = (team) => {
        setSelectedTeam(prevSelectedTeam => (prevSelectedTeam && prevSelectedTeam._id === team._id ? null : team));
    };

    const handleVoteClick = () => {
        if (selectedTeam) {
            const selectedTeamId = selectedTeam._id;
            addBallotPink(selectedTeamId);
            navigate('/papeleta-azul');
        } else {
            toast.error('Por favor, seleccione un equipo antes de votar.');
        }
    };

    const userName = 'Joshua Elí Isaac';
    const surname = 'Realiquez Sosa';
    const userDPI = '3012746060101';
    const pageTitle = 'Candidatos | 2024';

    return (
        <div className="page-container">
            <Navbar userName={userName} surname={surname} userDPI={userDPI} pageTitle={pageTitle} />
            <div className="outer-container-pink">
                <div className="header-container">
                    <div className="header-content">
                        <img src="https://tse.org.gt/images/logo_TSE_-_PNG_TRANSPARENTE_-_200_DPI.png" alt="Tribunal Supremo Electoral" className="header-logo" />
                        <div className="header-text">
                            <h1>ELECCIÓN DE ALCALDE Y CORPORACIÓN MUNICIPAL - 2024</h1>
                            <p>*Debe seleccionar un único cuadro, o bien puede votar nulo.</p>
                        </div>
                    </div>
                    <BallotNavigation />
                </div>
                <div className="card-grid-container-pink">
                    {isLoading ? (
                        <p>Cargando...</p>
                    ) : (
                        pinkTeamsByTown && pinkTeamsByTown.length > 0 ? (
                            pinkTeamsByTown.map((pinkTeam) => (
                                <div
                                    key={pinkTeam._id}
                                    className={`card ${selectedTeam && selectedTeam._id === pinkTeam._id ? 'selected' : selectedTeam !== null ? 'not-selected' : ''}`}
                                    onClick={() => handleCardClick(pinkTeam)}
                                >
                                    <div className="deputies-container">
                                        {pinkTeam.candidates && pinkTeam.candidates.role === 'ALCALDE' && (
                                            <div className="image-container">
                                                {console.log(pinkTeam.candidates, 'Filtered ALCALDE candidate')}
                                                <img src={pinkTeam.candidates.user.photo} alt="Alcalde" className="candidate-photo" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow"></div>
                                    {pinkTeam.partie && (
                                        <div className="party-section-g">
                                            <div className="party-logo-container-g">
                                                <div className="party-logo-g">
                                                    <img src={pinkTeam.partie.logo} alt="Partido" />
                                                </div>
                                                <div className="party-color-g" style={{ backgroundColor: pinkTeam.partie.colorHex }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p>No hay datos disponibles</p>
                        )
                    )}
                </div>
                <div className="vote-button-container">
                    <button onClick={handleVoteClick} disabled={isAdding || selectedTeam === null}>
                        {isAdding ? 'Registrando voto...' : 'Registrar Voto'}
                    </button>
                </div>
            </div>
        </div>
    );
};
