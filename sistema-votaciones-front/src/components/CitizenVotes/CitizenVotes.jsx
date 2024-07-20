import React, { useState, useEffect } from 'react'
import Navbar from '../Nabvar/Navbar'
import './CitizenVotes.css'
import { BallotNavigation } from '../BallotNavigation/BallotNavigation'
import { useAddCitizenVote } from '../../shared/hooks/CitizenVotes/useAddCitizenVote'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export const CitizenVotes = () => {
    const { addCitizenVote, isLoading: isAdding } = useAddCitizenVote()
    const navigate = useNavigate()

    //Confirmar votación
    const handleVoteClick = () => {
        addCitizenVote()
        navigate('/homepage')
    }

    const userName = 'Joshua Elí Isaac'
    const surname = 'Realiquez Sosa'
    const userDPI = '3012746060101'
    const pageTitle = 'Candidatos | 2024'

    return (
        <div className="page-container">
            <Navbar userName={userName} surname={surname} userDPI={userDPI} pageTitle={pageTitle} />
            <div className="outer-container-end">
                <div className="header-container">
                    <div className="header-content">
                        <img src="https://tse.org.gt/images/logo_TSE_-_PNG_TRANSPARENTE_-_200_DPI.png" alt="Tribunal Supremo Electoral" className="header-logo" />
                        <div className="header-text">
                            <h1>FINALIZA TU VOTACIÓN - 2024</h1>
                        </div>
                    </div>
                    <BallotNavigation />
                </div>
                <div className="vote-button-container">
                    <button onClick={handleVoteClick}>
                        {isAdding ? 'Registrando voto...' : 'Finalizar votación'}
                    </button>
                </div>
            </div>
        </div>
    )
}
