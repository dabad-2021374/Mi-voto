import React, { useEffect, useState } from 'react'
import Select, { components } from "react-select";
import toast from 'react-hot-toast'
import { HiKey, HiOutlineMail } from "react-icons/hi";
import { useGetPartiesByUser } from '../../shared/hooks/parties/useGetPartiesByUser'
import { useAddPresidentialTeam } from '../../shared/hooks/parties/useAddPresidentialTeam'
import { useAddNationalListDeputy } from '../../shared/hooks/parties/useAddNationalListDeputy'
import { useAddDistrictDeputy } from '../../shared/hooks/parties/useAddDistrictDeputy'
import { useAddParlamentDeputy } from '../../shared/hooks/parties/useAddParlamentDeputy'
import { useAddMayorTeamMember } from '../../shared/hooks/parties/useAddMayorTeamMember'
import { useGetDistrictTeam } from '../../shared/hooks/parties/useGetDistrictTeam'
import { useGetDepartments } from "../../shared/hooks/department/useGetDepartments.jsx";
import { useGetTowns } from "../../shared/hooks/town/useGetTowns.jsx";
import Navbar from '../../components/Nabvar/Navbar'
import './AdminParty.css'
import {
    confirmDPIValidationMessage,
    confirmPasswordValidationMessage,
    emailValidationMessage,
    emptyValidationMessage,
    passwordValidationMessage,
    phoneValidationMessage,
    selectValidationMessage,
    usernameValidationMessage,
    validateDPI,
    validateEmail,
    validateEmpty,
    validatePassConfirm,
    validatePassword,
    validatePhone,
    validateSelect,
    validateUsername
} from "./../../shared/validators/validator.js";

const CustomValueContainer = (props) => {
    const { children, selectProps } = props
    const Icon = selectProps.icon
    return (
        <components.ValueContainer {...props}>
            {Icon && <Icon className="select-icon-property" />}
            {children}
        </components.ValueContainer>
    )
}

export const AdminParty = () => {
    const [selectedParty, setSelectedParty] = useState(null)
    const { parties, isFetching, getPartiesByUser } = useGetPartiesByUser()
    const { addMember: addPresidentialMember, isLoading: isPresidentialLoading } = useAddPresidentialTeam()
    const { addMember: addDeputyMember, isLoading: isDeputyLoading } = useAddNationalListDeputy()
    const { addMember: addDeputyDMember, isLoading: isDeputyDLoading } = useAddDistrictDeputy()
    const { addMember: addMayorMember, isLoading: isMayorLoading } = useAddMayorTeamMember()
    const { addMember: addDeputyPMember, isLoading: isDeputyPLoading } = useAddParlamentDeputy()
    const { districts, isFetching: isDistrictFetching, getDistrict } = useGetDistrictTeam()
    const { departments, isFetching: isFetchingDepartments, getDepartments } = useGetDepartments();
    const { towns, isFetching: isFetchingTowns, getTowns } = useGetTowns();

    const [presidentialDPI, setPresidentialDPI] = useState('')
    const [presidentialRole, setPresidentialRole] = useState('')
    const [deputyDPI, setDeputyDPI] = useState('')
    const [deputyRole, setDeputyRole] = useState('')
    const [deputyDiDPI, setDeputyDiDPI] = useState('')
    const [deputyDiRole, setDeputyDiRole] = useState('')
    const [deputyPaDPI, setDeputyPaDPI] = useState('')
    const [deputyPaRole, setDeputyPaRole] = useState('')
    const [mayorDPI, setMayorDPI] = useState('')
    const [mayorRole, setMayorRole] = useState('')
    const [selectedDistrict, setSelectedDistrict] = useState('')

    const [formData, setFormData] = useState({
        DPI: {
            value: '',
            isValid: false,
            showError: false
        },
        departamento: {
            value: '',
            isValid: false,
            showError: false
        },
        municipio: {
            value: '',
            isValid: false,
            showError: false
        },
        rol: {
            value: '',
            isValid: false,
            showError: false
        }
    });

    useEffect(() => {
        getPartiesByUser()
        getDistrict()
        getDepartments()
    }, [])

    useEffect(() => {
        if (formData.departamento.value) {
            getTowns(formData.departamento.value)
        }
    }, [formData.departamento.value])

    const handleValueChange = (value, field) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: {
                ...prevData[field],
                value,
            }
        }));
    };

    const handlePresidentialSubmit = async (e) => {
        e.preventDefault();
        if (!presidentialDPI || !presidentialRole) {
            toast.error('Por favor complete ambos campos para el equipo presidencial.')
            return
        }
        await addPresidentialMember({ DPI: presidentialDPI, role: presidentialRole })
        setPresidentialDPI('')
        setPresidentialRole('')
        getPartiesByUser()
    };

    const handleDeputySubmit = async (e) => {
        e.preventDefault();
        if (!deputyDPI || !deputyRole) {
            toast.error('Por favor complete ambos campos para el diputado.')
            return;
        }
        if(deputyRole === 'DIPUTADO'){
            await addDeputyMember({ DPI: deputyDPI, role: 'DIPUTADO', districtId: selectedDistrict })
            
        } else if(deputyRole === 'DIPUTADO PARLAMENTO'){
            await addDeputyPMember({ DPI: deputyDPI, role: 'DIPUTADO', districtId: selectedDistrict })
        } else if(deputyRole === 'DIPUTADO DISTRITO'){
            await addDeputyDMember({ DPI: deputyDPI, role: 'DIPUTADO', districtId: selectedDistrict })
        }
        
        setDeputyDPI('')
        setDeputyRole('')
        setSelectedDistrict('')
        getPartiesByUser()
    }

    const handleDeputyDiSubmit = async (e) => {
        e.preventDefault();
        if (!deputyDiDPI || !deputyDiRole) {
            toast.error('Por favor complete ambos campos para el diputado.');
            return
        }
        await addDeputyDMember({ DPI: deputyDiDPI, role: deputyDiRole, districtId: selectedDistrict })
        setDeputyDiDPI('')
        setDeputyDiRole('')
        setSelectedDistrict('')
        getPartiesByUser()
    };

    const handleDeputyParlamentSubmit = async (e) => {
        e.preventDefault()
        if (!deputyPaDPI || !deputyPaRole) {
            toast.error('Por favor complete ambos campos para el diputado.');
            return;
        }
        await addDeputyPMember({ DPI: deputyPaDPI, role: deputyPaRole, districtId: selectedDistrict });
        setDeputyPaDPI('');
        setDeputyPaRole('');
        setSelectedDistrict('');
        getPartiesByUser();
    };

    const handleMayorTeamSubmit = async (e) => {
        e.preventDefault();
        if (!mayorDPI || !mayorRole || !formData.departamento.value || !formData.municipio.value) {
            toast.error('Por favor complete todos los campos requeridos para el alcalde.');
            return;
        }
        const data = {
            DPI: mayorDPI,
            role: mayorRole,
            departmentId: formData.departamento.value,
            town: formData.municipio.value
        };
        await addMayorMember(data);
        setMayorDPI('');
        setMayorRole('');
        setSelectedDistrict('');
        getPartiesByUser();
    };

    const handleValidationOnBlur = (value, field) => {
        let isValid = false;
        switch (field) {
            case 'DPI':
                isValid = validateDPI(value);
                break;
            case 'departamento':
                isValid = validateSelect(value);
                break;
            case 'municipio':
                isValid = validateSelect(value);
                break;
            case 'rol':
                isValid = validateSelect(value);
                break;
            default:
                break;
        }
        setFormData((prevData) => ({
            ...prevData,
            [field]: {
                ...prevData[field],
                isValid,
                showError: !isValid
            }
        }));
    };

    if (isFetching || isDistrictFetching) return <p>Cargando...</p>;
    if (!parties || parties.length === 0) return <p>No hay partidos disponibles.</p>;

    return (
        <div>
            <Navbar pageTitle="Administra tu Partido" />
            <div className="main-container">
                <div className="parties-list">
                    {parties.map(party => (
                        <div key={party._id} className="party-card">
                            <div className="party-header">
                                <img src={party.logo} alt={`${party.name} logo`} className="party-logo-p" />
                                <div className="party-info">
                                    <h2>{party.name}</h2>
                                    <p>Fecha de creación: {new Date(party.creationDate).toLocaleDateString()}</p>
                                    <p>Color: <span style={{ color: party.colorHex }}>{party.colorHex}</span></p>
                                </div>
                            </div>
                            <div className="center-container">
                                <div className='officials-form'>
                                    <h2>Agregar Equipo Presidencial</h2><br />
                                    <form onSubmit={handlePresidentialSubmit}>
                                        <label>DPI:</label>
                                        <input type="text" value={presidentialDPI} onChange={e => setPresidentialDPI(e.target.value)} placeholder="Ingrese DPI" />
                                        <label>Rol:</label>
                                        <select value={presidentialRole} onChange={e => setPresidentialRole(e.target.value)}>
                                            <option value="">Seleccione Rol</option>
                                            <option value="PRESIDENTE">Presidente</option>
                                            <option value="VICEPRESIDENTE">Vicepresidente</option>
                                        </select>
                                        <button className='addParty' type="submit" disabled={isPresidentialLoading}>Agregar Presidenciables</button>
                                    </form>
                                    <br /><br />
                                    <div className="card-p" style={{ backgroundColor: party.colorHex }}>
                                        <h3>Equipo Presidencial</h3>
                                        {party.presidentialTeam.map(member => (
                                            <p key={member._id}>{member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className='officials-form'>
                                    <h2>Agregar Diputado</h2><br />
                                    <form onSubmit={handleDeputySubmit}>
                                        <label>DPI:</label>
                                        <input type="text" value={deputyDPI} onChange={e => setDeputyDPI(e.target.value)} placeholder="Ingrese DPI" />
                                        <label>Rol:</label>
                                        <select value={deputyRole} onChange={e => setDeputyRole(e.target.value)}>
                                            <option value="">Seleccione Rol</option>
                                            <option value="DIPUTADO">Diputado</option>
                                            <option value="DIPUTADO PARLAMENTO">Diputado Parlamento</option>
                                            <option value="DIPUTADO DISTRITO">Diputado Distrito</option>
                                        </select>
                                        <label>Distrito:</label>
                                        <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)}>
                                            <option value="">Seleccione Distrito</option>
                                            {districts.map(district => (
                                                <option key={district._id} value={district._id}>{district.nameDistrict}</option>
                                            ))}
                                        </select>
                                        <button type="submit" disabled={isDeputyLoading}>Agregar Diputado</button>
                                    </form>
                                    <br /><br />

                                    <div className="card-p" style={{ backgroundColor: party.colorHex }}>
                                        <h3>Diputados Nacionales</h3>
                                        {party.nationalListDeputies.map(member => (
                                            <p key={member._id}>{member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}</p>
                                        ))}
                                    </div>
                                    <br />
                                    <div className="card-p" style={{ backgroundColor: party.colorHex }}>
                                        <h3>Diputados Distritales</h3>
                                        {party.districtDeputies.map(member => (
                                            <p key={member._id}>{member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}</p>
                                        ))}
                                    </div>
                                    <br />
                                    <div className="card-p" style={{ backgroundColor: party.colorHex }}>
                                        <h3>Diputados de Parlamento</h3>
                                        {party.parlamentDeputies.map(member => (
                                            <p key={member._id}>{member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}</p>
                                        ))}
                                    </div>
                                </div>

                                <div className='officials-form'>
                                    <h2>Agregar Alcalde</h2><br />
                                    <form onSubmit={handleMayorTeamSubmit}>
                                        <label>DPI:</label>
                                        <input type="text" value={mayorDPI} onChange={e => setMayorDPI(e.target.value)} placeholder="Ingrese DPI" />
                                        <label>Rol:</label>
                                        <select value={mayorRole} onChange={e => setMayorRole(e.target.value)}>
                                            <option value="">Seleccione Rol</option>
                                            <option value="ALCALDE">Alcalde</option>
                                        </select>
                                        <div className="select-container">
                                            <label>Departamento</label>
                                            <div className="select-wrapper-selects">
                                                <Select
                                                    options={departments ? departments.map(depa => ({ value: depa._id, label: depa.department })) : []}
                                                    value={departments ? departments.find(option => option.value === formData.departamento.value) : null}
                                                    onChange={selectedOption => handleValueChange(selectedOption.value, 'departamento')}
                                                    onBlur={() => handleValidationOnBlur(formData.departamento.value, 'departamento')}
                                                    placeholder="Selecciona un departamento"
                                                    classNamePrefix="react-select"
                                                    isLoading={isFetchingDepartments}
                                                    components={{ ValueContainer: CustomValueContainer }}
                                                    icon={HiKey}
                                                />
                                            </div>
                                            {formData.departamento.showError && (
                                                <span className="validation-message">
                                                    {selectValidationMessage}
                                                </span>
                                            )}
                                        </div>
                                        <div className="select-container">
                                            <br/><label>Municipio</label>
                                            <div className="select-wrapper-selects">
                                                <Select
                                                    options={towns ? towns.map(muni => ({ value: muni.name, label: muni.name })) : []}
                                                    value={towns ? towns.find(option => option.value === formData.municipio.value) : null}
                                                    onChange={selectedOption => handleValueChange(selectedOption.value, 'municipio')}
                                                    onBlur={() => handleValidationOnBlur(formData.municipio.value, 'municipio')}
                                                    placeholder="Selecciona un municipio"
                                                    classNamePrefix="react-select"
                                                    isLoading={isFetchingTowns}
                                                    components={{ ValueContainer: CustomValueContainer }}
                                                    icon={HiKey}
                                                />
                                            </div>
                                            {formData.municipio.showError && (
                                                <span className="validation-message">
                                                    {selectValidationMessage}
                                                </span>
                                            )}
                                        </div>
                                        <button type="submit" disabled={isMayorLoading} className="add-mayor-button">Agregar Alcalde</button>
                                    </form>
                                    <br /><br />
                                    <div className="card-p" style={{ backgroundColor: party.colorHex }}>
                                        <h3>Alcaldes afiliados</h3>
                                        {party.mayorTeam.map(member => (
                                            <p key={member._id}>{member.role}: {member.user ? `${member.user.name} ${member.user.surname}` : 'Información no disponible'}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminParty;
