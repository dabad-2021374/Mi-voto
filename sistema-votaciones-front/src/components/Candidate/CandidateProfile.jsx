import React, { useEffect, useRef } from 'react';
import './CandidateProfile.css';
import Navbar from '../../components/Nabvar/Navbar';
import { useGetParties } from '../../shared/hooks/parties/useGetParties';
import imgDefault from '../../assets/images/defaultImage.png';
import { useNavigate } from 'react-router-dom';

const getBrightness = (hexColor) => {
  hexColor = hexColor.replace('#', '');
  const r = parseInt(hexColor.substring(0, 2), 16);
  const g = parseInt(hexColor.substring(2, 4), 16);
  const b = parseInt(hexColor.substring(4, 6), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114);
};

export const CandidateProfile = () => {
  const { parties, isFetching, getParties } = useGetParties();
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getParties();
  }, []);

  const scrollLeft = () => {
    containerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    containerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  const handleCandidateClick = (id) => {
    console.log(`Candidate ID: ${id}`);
    navigate(`/candidate-profile/${id}`);
  };


  return (
    <div>
      <Navbar pageTitle={'Candidatos | 2024'} />
      <div className='container-img-1'>
        {parties && parties.length > 0 && (
          <div ref={containerRef} className="container-parties">
            {parties.map(party => {
              const textColor = getBrightness(party.colorHex) > 186 ? '#000' : '#fff'; // Decidir color del texto basado en el brillo
              return (
                <div key={party._id} className="party-container">
                  <div className="party-candidates-profile">
                    <h2 className="party-title">{party.name}</h2> {/* Siempre en negro */}
                    <div className="candidates-scroll">
                      {party.presidentialTeam.map(candidate => (
                        <div
                          key={candidate._id}
                          className="candidate-card-profile"
                          onClick={() => handleCandidateClick(candidate.user._id)}
                          style={{ backgroundColor: party.colorHex, color: textColor }}
                        >
                          <div className="image-vertical">
                            <img src={candidate.user.photo || imgDefault} alt={`${candidate.user.name} ${candidate.user.surname}`} />
                          </div>
                          <div className="text-candidate">
                            <h4>{candidate.role}</h4>
                            <p>
                              {candidate.user
                                ? (
                                  <>
                                    <p>{candidate.user.name}</p>
                                    <p>{candidate.user.surname}</p>
                                  </>
                                )
                                : 'Información no disponible'}
                            </p>

                          </div>
                        </div>
                      ))}
                      {party.nationalListDeputies.map(candidate => (
                        <div
                          key={candidate._id}
                          className="candidate-card-profile"
                          onClick={() => handleCandidateClick(candidate.user._id)}
                          style={{ backgroundColor: party.colorHex, color: textColor }}
                        >
                          <div className="image image-vertical">
                            <img src={candidate.user.photo || imgDefault} alt={`${candidate.user.name} ${candidate.user.surname}`} />
                          </div>
                          <div className="text-candidate">
                            <h4>{candidate.role}</h4>
                            <p>{candidate.user ? (
                              <>
                                <p>{candidate.user.name}</p>
                                <p>{candidate.user.surname}</p>
                              </>
                            ) : 'Información no disponible'}
                            </p>
                          </div>
                        </div>
                      ))}
                      {party.districtDeputies.map(candidate => (
                        <div
                          key={candidate._id}
                          className="candidate-card-profile"
                          onClick={() => handleCandidateClick(candidate.user._id)}
                          style={{ backgroundColor: party.colorHex, color: textColor }}
                        >
                          <div className="image image-vertical">
                            <img src={candidate.user.photo || imgDefault} alt={`${candidate.user.name} ${candidate.user.surname}`} />
                          </div>
                          <div className="text-candidate">
                            <h4>{candidate.role}</h4>
                            <p>{candidate.user ? (
                              <>
                                <p>{candidate.user.name}</p>
                                <p>{candidate.user.surname}</p>
                              </>
                            ) : 'Información no disponible'}</p>
                          </div>
                        </div>
                      ))}
                      {party.parlamentDeputies.map(candidate => (
                        <div
                          key={candidate._id}
                          className="candidate-card-profile"
                          onClick={() => handleCandidateClick(candidate.user._id)}
                          style={{ backgroundColor: party.colorHex, color: textColor }}
                        >
                          <div className="image image-vertical">
                            <img src={candidate.user.photo || imgDefault} alt={`${candidate.user.name} ${candidate.user.surname}`} />
                          </div>
                          <div className="text-candidate">
                            <h4>{candidate.role}</h4>
                            <p>{candidate.user ? (
                              <>
                                <p>{candidate.user.name}</p>
                                <p>{candidate.user.surname}</p>
                              </>
                            ) : 'Información no disponible'}</p>
                          </div>
                        </div>
                      ))}
                      {party.mayorTeam.map(candidate => (
                        <div
                          key={candidate._id}
                          className="candidate-card-profile"
                          onClick={() => handleCandidateClick(candidate.user._id)}
                          style={{ backgroundColor: party.colorHex, color: textColor }}
                        >
                          <div className="image image-vertical">
                            <img src={candidate.user.photo || imgDefault} alt={`${candidate.user.name} ${candidate.user.surname}`} />
                          </div>
                          <div className="text-candidate">
                            <h4>{candidate.role}</h4>
                            <p>{candidate.user ? (
                              <>
                                <p>{candidate.user.name}</p>
                                <p>{candidate.user.surname}</p>
                              </>
                            ) : 'Información no disponible'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile;
