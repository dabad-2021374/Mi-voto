import React, { useState, useEffect } from 'react'
import Navbar from '../Nabvar/Navbar'
import './BallotBlue.css'
import { BallotNavigation } from '../BallotNavigation/BallotNavigation'
import { useGetAllBlueT } from '../../shared/hooks/BallotBlue/useGetAllBlueT'
//import { useAddGreenB } from '../../shared/hooks/BallotGreen/useAddGreenB'
import { useAddBlueB } from '../../shared/hooks/BallotBlue/useAddBlueB'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const BallotBlue = () => {

    const { getBlueTeams, isLoading, blueTeams } = useGetAllBlueT()
    const { addBallotBlue, isLoading: isAdding } = useAddBlueB()
    const [selectedTeam, setSelectedTeam] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getBlueTeams()
    }, [])

    useEffect(() => {
    }, [blueTeams])

    //Seleccionar teamAzul/card
    const handleCardClick = (team) => {
        setSelectedTeam(prevSelectedTeam => (prevSelectedTeam && prevSelectedTeam._id === team._id ? null : team))
    }

    //Confirmar voto
    const handleVoteClick = () => {
        if (selectedTeam) {
            const selectedTeamId = selectedTeam._id
            addBallotBlue(selectedTeamId)
            navigate('/papeleta-amarilla')
        } else {
            toast.error('Por favor, seleccione un equipo antes de votar.')
        }
    }

    const userName = 'Joshua Elí Isaac'
    const surname = 'Realiquez Sosa'
    const userDPI = '1234567899999'
    const pageTitle = 'Candidatos | 2024'

    return (
        <div className="page-container">
            <Navbar userName={userName} surname={surname} userDPI={userDPI} pageTitle={pageTitle} />
            <div className="outer-container-blue">
                <div className="header-container">
                    <div className="header-content">
                        <img src="https://tse.org.gt/images/logo_TSE_-_PNG_TRANSPARENTE_-_200_DPI.png" alt="Tribunal Supremo Electoral" className="header-logo" />
                        <div className="header-text">
                            <h1>ELECCIÓN DE DIPUTADOS AL CONGRESO DE LA REPÚBLICA POR DISTRITO ELECTORAL - 2024</h1>
                            <p>*Debe seleccionar un único cuadro, o bien puede votar nulo.</p>
                        </div>
                    </div>
                    <BallotNavigation />
                </div>
                <div className="card-grid-container-blue">
                    {isLoading ? (
                        <p>Cargando...</p>
                    ) : (
                        blueTeams && blueTeams.length > 0 ? (
                            blueTeams.map((blueTeam) => (
                                <div
                                    key={blueTeam._id}
                                    className={`card ${selectedTeam && selectedTeam._id === blueTeam._id ? 'selected' : selectedTeam !== null ? 'not-selected' : ''}`}
                                    onClick={() => handleCardClick(blueTeam)}
                                >
                                    <div className="deputies-container">
                                        <div className="deputies-column">
                                            {blueTeam.candidates.slice(0, Math.ceil(blueTeam.candidates.length / 3)).map((candidate, idx) => (
                                                <p key={idx}>{candidate.user.name} {candidate.user.surname}</p>
                                            ))}
                                        </div>
                                        <div className="deputies-column">
                                            {blueTeam.candidates.slice(Math.ceil(blueTeam.candidates.length / 3), 2 * Math.ceil(blueTeam.candidates.length / 3)).map((candidate, idx) => (
                                                <p key={idx}>{candidate.user.name} {candidate.user.surname}</p>
                                            ))}
                                        </div>
                                        <div className="deputies-column">
                                            {blueTeam.candidates.slice(2 * Math.ceil(blueTeam.candidates.length / 3)).map((candidate, idx) => (
                                                <p key={idx}>{candidate.user.name} {candidate.user.surname}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-grow"></div>
                                    {blueTeam.partie && (
                                        <div className="party-section-g">
                                            <div className="party-logo-container-g">
                                                <div className="party-logo-g">
                                                    <img src={blueTeam.partie.logo} alt="Partido" />
                                                </div>
                                                <div className="party-color-g" style={{ backgroundColor: blueTeam.partie.colorHex }}></div>
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
    )
}