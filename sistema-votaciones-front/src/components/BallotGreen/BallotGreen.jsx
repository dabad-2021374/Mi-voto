import React, { useState, useEffect } from 'react'
import Navbar from '../Nabvar/Navbar'
import './BallotGreen.css'
import { BallotNavigation } from '../BallotNavigation/BallotNavigation'
import { useGetAllGreenT } from '../../shared/hooks/BallotGreen/useGetAllGreenT'
import { useAddGreenB } from '../../shared/hooks/BallotGreen/useAddGreenB'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const BallotGreen = () => {
    const { getGreenTeams, isLoading, greenTeams } = useGetAllGreenT()
    const { addBallotGreen, isLoading: isAdding } = useAddGreenB()
    const [selectedTeam, setSelectedTeam] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getGreenTeams()
    }, [])

    useEffect(() => {
    }, [greenTeams])

    //Seleccionar teamVerde/card
    const handleCardClick = (team) => {
        setSelectedTeam(prevSelectedTeam => (prevSelectedTeam && prevSelectedTeam._id === team._id ? null : team))
    }

    //Confirmar voto
    const handleVoteClick = () => {
        if (selectedTeam) {
            const selectedTeamId = selectedTeam._id
            addBallotGreen(selectedTeamId)
            navigate('/papeleta-rosa')
        } else {
            toast.error('Por favor, seleccione un equipo antes de votar.')
        }
    }

    const userName = 'Joshua Elí Isaac'
    const surname = 'Realiquez Sosa'
    const userDPI = '3012746060101'
    const pageTitle = 'Candidatos | 2024'

    return (
        <div className="page-container">
            <Navbar userName={userName} surname={surname} userDPI={userDPI} pageTitle={pageTitle} />
            <div className="outer-container-green">
                <div className="header-container">
                    <div className="header-content">
                        <img src="https://tse.org.gt/images/logo_TSE_-_PNG_TRANSPARENTE_-_200_DPI.png" alt="Tribunal Supremo Electoral" className="header-logo" />
                        <div className="header-text">
                            <h1>ELECCIÓN DE DIPUTADOS DE LA REPÚBLICA - 2024</h1>
                            <p>*Debe seleccionar un único cuadro, o bien puede votar nulo.</p>
                        </div>
                    </div>
                    <BallotNavigation />
                </div>
                <div className="card-grid-container-green">
                    {isLoading ? (
                        <p>Cargando...</p>
                    ) : (
                        greenTeams && greenTeams.length > 0 ? (
                            greenTeams.map((greenTeam) => (
                                <div
                                    key={greenTeam._id}
                                    className={`card ${selectedTeam && selectedTeam._id === greenTeam._id ? 'selected' : selectedTeam !== null ? 'not-selected' : ''}`}
                                    onClick={() => handleCardClick(greenTeam)}
                                >
                                    <div className="deputies-container">
                                        <div className="deputies-column">
                                            {greenTeam.candidates.slice(0, Math.ceil(greenTeam.candidates.length / 3)).map((candidate, idx) => (
                                                <p key={idx}>{candidate.user.name} {candidate.user.surname}</p>
                                            ))}
                                        </div>
                                        <div className="deputies-column">
                                            {greenTeam.candidates.slice(Math.ceil(greenTeam.candidates.length / 3), 2 * Math.ceil(greenTeam.candidates.length / 3)).map((candidate, idx) => (
                                                <p key={idx}>{candidate.user.name} {candidate.user.surname}</p>
                                            ))}
                                        </div>
                                        <div className="deputies-column">
                                            {greenTeam.candidates.slice(2 * Math.ceil(greenTeam.candidates.length / 3)).map((candidate, idx) => (
                                                <p key={idx}>{candidate.user.name} {candidate.user.surname}</p>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-grow"></div>
                                    {greenTeam.partie && (
                                        <div className="party-section-g">
                                            <div className="party-logo-container-g">
                                                <div className="party-logo-g">
                                                    <img src={greenTeam.partie.logo} alt="Partido" />
                                                </div>
                                                <div className="party-color-g" style={{ backgroundColor: greenTeam.partie.colorHex }}></div>
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
