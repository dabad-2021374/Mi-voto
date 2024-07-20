import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../Nabvar/Navbar';
import { useGetExperiencesById } from '../../shared/hooks/Experience/useGetExperiencesById';
import { useGetInitiativeCandidate } from '../../shared/hooks/Initiative/useGetInitiativesById';
import './CandidateDetails.css';

export const CandidateDetails = () => {
  const { pathname } = useLocation();
  const candidate = pathname.split('/').pop();

  const { getExperiencesByID, experiences, isLoading: isLoadingExperiences } = useGetExperiencesById();
  const { getInitiativesCandidate, initiatives, isLoading: isLoadingInitiatives } = useGetInitiativeCandidate();

  useEffect(() => {
    getExperiencesByID(candidate);
    getInitiativesCandidate(candidate);
  }, []);

  return (
    <>
      <Navbar pageTitle="Detalles del Candidato" />
      <div className="ei-main-container">
        <div className="ei-experiences-container">
          <div className="ei-title-container">
            <h2>Experiencias</h2>
          </div>
          <div className="ei-experience-cards">
            {isLoadingExperiences ? (
              <p>Cargando experiencias...</p>
            ) : (
              experiences.map(exp => (
                <div key={exp._id} className="ei-experience-card">
                  <strong>
                    <p style={{ color: 'white' }}>{new Date(exp.startDate).toLocaleDateString()} - {new Date(exp.endDate).toLocaleDateString()}</p>
                  </strong>
                  <br></br>
                  <center>
                    <h3 style={{ color: 'white' }}>{exp.title}</h3>
                    <br></br>
                    <p style={{ color: 'back' }}>
                      <strong style={{ color: 'back' }}></strong> <span style={{ color: 'white' }}>{exp.institution}</span>
                    </p>
                  </center>
                  <br></br>
                  <p style={{ color: 'back' }}>
                    <strong style={{ color: 'back' }}></strong> <span style={{ color: 'white' }}>{exp.description}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="ei-initiatives-container">
          <div className="ei-title-container">
            <h2>Iniciativas</h2>
          </div>
          <div className="ei-initiatives-cards">
            {isLoadingInitiatives ? (
              <p>Cargando iniciativas...</p>
            ) : (
              initiatives.map(init => (
                <div key={init._id} className="ei-initiative-card">
                  <center>
                  <h3 style={{ color: 'white', marginTop: '-10px' }}>No. {init.noInitiative}</h3>
                  <br></br>
                    <p style={{ color: 'white' }}>-{new Date(init.date).toLocaleDateString()}-</p>
                  </center>
                  <div style={{ color: 'white' }} className="description">
                    <p>{init.resume}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CandidateDetails;
