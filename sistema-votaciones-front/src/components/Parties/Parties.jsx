import React, { useEffect, useRef, useState } from 'react';
import { useGetParties } from '../../shared/hooks/parties/useGetParties';
import Navbar from '../../components/Nabvar/Navbar';
import { useRegisterParties } from '../../shared/hooks/parties/useRegisterParties';
import { useGetAdminParties } from '../../shared/hooks/parties/useGetAdminParties';
import { useNavigate } from 'react-router-dom';
import './Parties.css';
 
const Parties = () => {
  const { parties, isFetching, getParties } = useGetParties();
  const { registerParty, isRegistering } = useRegisterParties();
  const { users, isFetchin, getUsers } = useGetAdminParties();
  const formRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    getParties();
    getUsers();
  }, []);
 
  const handleRegisterParty = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const partyData = {
      name: formData.get('name'),
      creationDate: formData.get('creationDate'),
      colorHex: formData.get('colorHex'),
      user: formData.get('user')
    };
    await registerParty(partyData);
    getParties();
    formRef.current.reset();
    setSelectedUser('');
  };
 
  const handlePartyClick = (partyId) => {
    navigate(`/officer`);
  };
 
  return (
    <div className="page-container">
      <Navbar pageTitle="Partidos Políticos" />
      <div className="parties-container">
        <form onSubmit={handleRegisterParty} ref={formRef} className="register-form">
          <h2>Registrar Partido</h2>
          <div>
            <label htmlFor="name">Nombre:</label>
            <input type="text" id="name" name="name" required />
          </div>
          <div>
            <label htmlFor="creationDate">Fecha de Creación:</label>
            <input type="date" id="creationDate" name="creationDate" required />
          </div>
          <div>
            <label htmlFor="colorHex">Color Hexadecimal:</label>
            <input
              type="text"
              id="colorHex"
              name="colorHex"
              required
              pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
              title="Debe ser un color hexadecimal válido, por ejemplo, #FFFFFF o #FFF."
            />
          </div>
          <div>
            <label htmlFor="user">Usuario Responsable:</label>
            <select
              id="user"
              name="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">Seleccione un usuario</option>
              {users && users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} {user.surname}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={isRegistering}>
            {isRegistering ? 'Registrando...' : 'Registrar Partido'}
          </button>
        </form>
        {parties && parties.length > 0 && (
          <div className="parties-list-p">
            {parties.map(party => (
              <div key={party._id} className="party-card-p" onClick={() => handlePartyClick(party._id)}>
                <img src={party.logo} alt={`${party.name} logo`} className="party-logo-pa" />
                <h2>{party.name}</h2>
                <p>Fecha de creación: {new Date(party.creationDate).toLocaleDateString()}</p>
                <p>Color: <span style={{ color: party.colorHex }}>{party.colorHex}</span></p>
                <div className="party-members">
                  <h3>Equipo Presidencial:</h3>
                  {party.presidentialTeam.length > 0 ? (
                    party.presidentialTeam.map(member => (
                      <p key={member._id}>
                        {member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}
                      </p>
                    ))
                  ) : (
                    <p>No hay miembros en el equipo presidencial.</p>
                  )}
                  <h3>Diputados Nacionales:</h3>
                  {party.nationalListDeputies.length > 0 ? (
                    party.nationalListDeputies.map(member => (
                      <p key={member._id}>
                        {member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}
                      </p>
                    ))
                  ) : (
                    <p>No hay diputados nacionales.</p>
                  )}
                  <h3>Diputados Distritales:</h3>
                  {party.districtDeputies.length > 0 ? (
                    party.districtDeputies.map(member => (
                      <p key={member._id}>
                        {member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}
                      </p>
                    ))
                  ) : (
                    <p>No hay diputados distritales.</p>
                  )}
                  <h3>Diputados del Parlamento:</h3>
                  {party.parlamentDeputies.length > 0 ? (
                    party.parlamentDeputies.map(member => (
                      <p key={member._id}>
                        {member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}
                      </p>
                    ))
                  ) : (
                    <p>No hay diputados del parlamento.</p>
                  )}
                  <h3>Equipo de Alcaldía:</h3>
                  {party.mayorTeam.length > 0 ? (
                    party.mayorTeam.map(member => (
                      <p key={member._id}>
                        {member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}
                      </p>
                    ))
                  ) : (
                    <p>No hay miembros en el equipo de alcaldía.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
 
export default Parties;