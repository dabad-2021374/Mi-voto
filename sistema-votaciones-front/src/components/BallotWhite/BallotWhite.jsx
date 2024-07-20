import React, { useState, useEffect } from 'react'
import './BallotWhite.css'
import Navbar from '../Nabvar/Navbar'
import { BallotNavigation } from '../BallotNavigation/BallotNavigation'
import { useGetAllWhiteT } from '../../shared/hooks/BallotWhite/useGetAllWhiteT'
import { useAddWhiteB } from '../../shared/hooks/BallotWhite/useAddWhiteB'
import imgDefault from '../../assets/images/defaultImage.png'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

 
export const BallotWhite = () => {
    const { getWhiteTeams, isLoading, whiteTeams } = useGetAllWhiteT()
    const { addBallotWhite, isLoading: isAdding } = useAddWhiteB()
    const [selectedTeam, setSelectedTeam] = useState(null)
    const navigate = useNavigate()

    const userName = 'Joshua Elí Isaac'
    const surname = 'Realiquez Sosa'
    const userDPI = '3012746060101'
    const pageTitle = 'Candidatos | 2024'

    useEffect(() => {
        getWhiteTeams()
    }, [])
    useEffect(() => {
    }, [getWhiteTeams])
    
    const handleCardClick = (team) => {
        setSelectedTeam(prevSelectedTeam => (prevSelectedTeam && prevSelectedTeam._id === team._id ? null : team))
    }
 
    const handleVoteClick = () => {
        if (selectedTeam) {
            const selectedTeamId = selectedTeam._id
            addBallotWhite(selectedTeamId)
            navigate('/papeleta-verde')
        } else {
            toast.error('Por favor, seleccione un equipo antes de votar.')
        }
    }

    return (
        <div className="page-container">
            <Navbar userName={userName} surname={surname} userDPI={userDPI} pageTitle={pageTitle} />
            <div className="outer-container">
                <div className="header-container">
                    <div className="header-content">
                        <img src="https://tse.org.gt/images/logo_TSE_-_PNG_TRANSPARENTE_-_200_DPI.png" alt="Tribunal Supremo Electoral" className="header-logo" />
                        <div className="header-text">
                            <h1>ELECCIÓN DE PRESIDENTE Y VICEPRESIDENTE DE LA REPÚBLICA - 2024</h1>
                            <p>*Debe seleccionar un único cuadro, o bien puede votar nulo.</p>
                        </div>
                    </div>
                    <BallotNavigation />
                </div>
                <div className="card-grid-container">
            {isLoading ? (
                <p>Cargando...</p>
            ) : (
                whiteTeams && whiteTeams.length > 0 ? (
                    whiteTeams.map((whiteTeam) => (
                        <div
                            key={whiteTeam._id}
                            className={`card ${selectedTeam && selectedTeam._id === whiteTeam._id ? 'selected' : selectedTeam !== null ? 'not-selected' : ''}`}
                            onClick={() => handleCardClick(whiteTeam)}
                        >
                            <div className="image-row">
                                {whiteTeam.candidates.map((candidate) => (
                                    <div key={candidate._id} className="image image-vertical">
                                        <img src={candidate.user.photo} alt={`${candidate.role === 'PRESIDENTE' ? 'Presidente' : 'Vicepresidente'}`} />
                                    </div>
                                ))}
                            </div>
                            <div className="party-section">
                                <div className="party-logo">
                                    <img src={whiteTeam.partie.logo} alt="Partido" />
                                </div>
                                <div className="party-color" style={{ backgroundColor: whiteTeam.partie.colorHex }}></div>
                            </div>
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
 
