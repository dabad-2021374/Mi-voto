import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './BallotNavigation.css'

export const BallotNavigation = () => {
    const location = useLocation()

    const isActive = (path) => location.pathname === path

    return (
        <div className="ballot-navigation">
            <Link to="/papeleta-blanca" className={`button-white ${isActive('/papeleta-blanca') ? 'active' : ''} disabled-link`}>
                Papeleta Blanca
            </Link>
            
            <Link to="/papeleta-verde" className={`button-green ${isActive('/papeleta-verde') ? 'active' : ''} disabled-link`}>
                Papeleta Verde
            </Link>

            <Link to="/papeleta-rosa" className={`button-pink ${isActive('/papeleta-rosa') ? 'active' : ''} disabled-link`}>
                Papeleta Rosada
            </Link>

            <Link to="/papeleta-azul" className={`button-blue ${isActive('/papeleta-azul') ? 'active' : ''} disabled-link`}>
                Papeleta Azul
            </Link>

            <Link to="/papeleta-amarilla" className={`button-yellow ${isActive('/papeleta-amarilla') ? 'active' : ''} disabled-link`}>
                Papeleta Amarilla
            </Link>
    
            <Link to="/finalizar-voto" className={`button-end ${isActive('/finalizar-voto') ? 'active' : ''} disabled-link`}>
                Finalizar voto
            </Link>
        </div>
    )
}
