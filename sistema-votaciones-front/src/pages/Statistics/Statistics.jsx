
import Navbar from './../../components/Nabvar/Navbar';
import './Statistics.css';
import { useState, useEffect } from 'react';
import { PresidentialStatistics } from "../../components/PresidentialStatistics/PresidentialStatistics";
import { NationalListStatistics } from "../../components/NationaListStatistics/NationalListStatistics";
import { MayorStatistics } from './../../components/MayorStatistics/MayorStatistics';
import { DistrictListStatistics } from './../../components/DistrictListStatistics/DistrictListStatistics';
import { ParlamentalListStatistics } from './../../components/ParlamentalListStatistics/ParlamentalListStatistics';

export const Statistics = () => {
    const currentYear = new Date().getFullYear();
    const [view, setView] = useState(1);
    const [title, setTitle] = useState('');
    const [background, setBackground] = useState('');
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        switch (view) {
            case 1:
                setBackground('#FFF9');
                setTitle(<h1>ELECCIÓN DE PRESIDENTE Y VICEPRESIDENTE -{currentYear}-</h1>);
                setStatistics(<PresidentialStatistics />);
                break;
            case 2:
                setBackground('#c4eeb190');
                setTitle(<h1>ELECCIÓN DE DIPUTADOS AL CONGRESO DE LA REPÚBLICA POR LISTA NACIONAL -{currentYear}-</h1>);
                setStatistics(<NationalListStatistics />);
                break;
            case 3:
                setBackground('#ecaeb190');
                setTitle(<h1>ELECCIÓN DE ALCALDE Y CORPORACIÓN MUNICIPAL -{currentYear}-</h1>);
                setStatistics(<MayorStatistics/>);
                break;
            case 4:
                setBackground('#acdff190');
                setTitle(<h1>ELECCIÓN DE DIPUTADOS AL CONGRESO DE LA REPÚBLICA POR DISTRITO ELECTORAL -{currentYear}-</h1>);
                setStatistics(<DistrictListStatistics/>);
                break;
            case 5:
                setBackground('#ede9b190');
                setTitle(<h1>ELECCIÓN DE DIPUTADOS AL PARLAMENTO CENTROAMERICANO -{currentYear}-</h1>);
                setStatistics(<ParlamentalListStatistics/>);
                break;
        }
    }, [view]);

    const pageTitle = `ESTADISTICAS | ${currentYear}`;

    return (
        <div className="page-container">
            <Navbar pageTitle={pageTitle} />
            <div className="outer-container" style={
                { backgroundColor: background }}>
                <div className="header-container">
                    <div className="header-content">
                        <img src="https://tse.org.gt/images/logo_TSE_-_PNG_TRANSPARENTE_-_200_DPI.png" alt="Tribunal Supremo Electoral" className="header-logo" />
                        <div className="header-text">
                            {title}
                            <p className='dataLive'>*DATOS EN VIVO</p>
                        </div>
                    </div>
                    <div className="ballot-navigation">
                        <button className="btn button-white" onClick={() => setView(1)}>Presidenciables</button>
                        <button className="btn button-green" onClick={() => setView(2)}>Lista Nacional</button>
                        <button className="btn button-red" onClick={() => setView(3)}>Alcaldes</button>
                        <button className="btn button-blue" onClick={() => setView(4)}>Diputados Distritales</button>
                        <button className="btn button-yellow" onClick={() => setView(5)}>Diputados Parlamentales</button>
                    </div>
                </div>

                {statistics && statistics != null ? statistics : 'Estadística no encontrada'}
            </div>
        </div>
    );
};

