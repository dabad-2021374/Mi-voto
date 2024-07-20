import React, { useState, useEffect } from 'react'
import Navbar from '../Nabvar/Navbar'
import './BallotYellow.css'
import { BallotNavigation } from '../BallotNavigation/BallotNavigation'
import { useGetAllYellowT } from '../../shared/hooks/BallotYellow/useGetAllYellowT'
import { useAddYellowB } from '../../shared/hooks/BallotYellow/useAddYellowB'
import { useGetAllGreenT } from '../../shared/hooks/BallotGreen/useGetAllGreenT'
import { useAddGreenB } from '../../shared/hooks/BallotGreen/useAddGreenB'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const BallotYellow = () => {
    const { getYellowTeams, isLoading, yellowTeams  } = useGetAllYellowT()
    const { addBallotYellow, isLoading: isAdding } = useAddYellowB()
    const [selectedTeam, setSelectedTeam] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        getYellowTeams()
    }, [])

    useEffect(() => {
    }, [yellowTeams])


    //Seleccionar teamAmarillo/card
    const handleCardClick = (team) => {
        setSelectedTeam(prevSelectedTeam => (prevSelectedTeam && prevSelectedTeam._id === team._id ? null : team))
    }

    //Confirmar voto
    const handleVoteClick = () => {
        if (selectedTeam) {
            const selectedTeamId = selectedTeam._id
            addBallotYellow(selectedTeamId)
            navigate('/finalizar-voto')
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
            <div className="outer-container-yellow">
                <div className="header-container">
                    <div className="header-content">
                        <img src="https://tse.org.gt/images/logo_TSE_-_PNG_TRANSPARENTE_-_200_DPI.png" alt="Tribunal Supremo Electoral" className="header-logo" />
                        <div className="header-text">
                            <h1>ELECCIÓN DE DIPUTADOS AL PARLAMENTO CENTROAMERICANO - 2024</h1>
                            <p>*Debe seleccionar un único cuadro, o bien puede votar nulo.</p>
                        </div>
                    </div>
                    <BallotNavigation />
                </div>
                <div className="card-grid-container-yellow">
                    {isLoading ? (
                        <p>Cargando...</p>
                    ) : (
                        yellowTeams && yellowTeams.length > 0 ? (
                            yellowTeams.map((yellowTeam) => (
                                <div
                                    key={yellowTeam._id}
                                    className={`card ${selectedTeam && selectedTeam._id === yellowTeam._id ? 'selected' : selectedTeam !== null ? 'not-selected' : ''}`}
                                    onClick={() => handleCardClick(yellowTeam)}
                                >
                                    <div className="deputies-container">
                                        {yellowTeam.candidates.slice(0, Math.ceil(yellowTeam.candidates.length / 3)).map((candidate, idx) => (
                                            <div key={idx}>
                                                {candidate && candidate.user && <p>{candidate.user.name} {candidate.user.surname}</p>}
                                            </div>
                                        ))}
                                        {yellowTeam.candidates.slice(Math.ceil(yellowTeam.candidates.length / 3), 2 * Math.ceil(yellowTeam.candidates.length / 3)).map((candidate, idx) => (
                                            <div key={idx}>
                                                {candidate && candidate.user && <p>{candidate.user.name} {candidate.user.surname}</p>}
                                            </div>
                                        ))}
                                        {yellowTeam.candidates.slice(2 * Math.ceil(yellowTeam.candidates.length / 3)).map((candidate, idx) => (
                                            <div key={idx}>
                                                {candidate && candidate.user && <p>{candidate.user.name} {candidate.user.surname}</p>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex-grow"></div>
                                    {yellowTeam.partie && (
                                        <div className="party-section-g">
                                            <div className="party-logo-container-g">
                                                <div className="party-logo-g">
                                                    <img src={yellowTeam.partie.logo} alt="Partido" />
                                                </div>
                                                <div className="party-color-g" style={{ backgroundColor: yellowTeam.partie.colorHex }}></div>
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