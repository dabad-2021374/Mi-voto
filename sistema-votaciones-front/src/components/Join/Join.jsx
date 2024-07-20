import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import { useNavigate } from 'react-router-dom';
import { Input } from "../Input";
import { FaRegUser, FaLock, FaLockOpen, FaUserTie } from "react-icons/fa";
import { MdEmail, MdDateRange, MdOutlinePhoneAndroid } from "react-icons/md";
import { HiKey, HiOutlineMail } from "react-icons/hi";
import logoTse from '../../assets/images/logoTse1.png';
import logoGobierno from '../../assets/images/logoGobierno.png';
import { useJoin } from "../../shared/hooks/useJoin.jsx";
import { useGetProfession } from "../../shared/hooks/profession/useGetProfession.jsx";
import { useGetDepartments } from "../../shared/hooks/department/useGetDepartments.jsx";
import { useGetTowns } from "../../shared/hooks/town/useGetTowns.jsx";
import './Join.css';
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
} from "../../shared/validators/validator";
import { useGetProfile } from "../../shared/hooks/useUserProfile.jsx";


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

export const Join = () => {
  const { join, isJoining } = useJoin();
  const { users: user, isFetching: isFetchingUsers, getUsers } = useGetProfile();
  const { professions, isFetching: isFetchingProfessions, getProfessions } = useGetProfession();
  const { departments, isFetching: isFetchingDepartments, getDepartments } = useGetDepartments();
  const { towns, isFetching: isFetchingTowns, getTowns } = useGetTowns();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    DPI: {
      value: '',
      isValid: false,
      showError: false
    },
    username: {
      value: '',
      isValid: false,
      showError: false
    },
    email: {
      value: '',
      isValid: false,
      showError: false
    },
    name: {
      value: '',
      isValid: false,
      showError: false
    },
    surname: {
      value: '',
      isValid: false,
      showError: false
    },
    YYYY: {
      value: '',
      isValid: false,
      showError: false
    },
    MM: {
      value: '',
      isValid: false,
      showError: false
    },
    DD: {
      value: '',
      isValid: false,
      showError: false
    },
    gender: {
      value: '',
      isValid: false,
      showError: false
    },
    profession: {
      value: '',
      isValid: false,
      showError: false
    },
    phone: {
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
    currentLocation: {
      value: '',
      isValid: false,
      showError: false
    },
    vision: {
      value: '',
      isValid: false,
      showError: false
    },
    illiteracy: {
      value: '',
      isValid: false,
      showError: false
    },
  });

  useEffect(() => {
    getProfessions();
    getDepartments();
    getUsers();
  }, []);

  useEffect(() => {
    if (formData.departamento.value) {
      getTowns(formData.departamento.value);
    }
  }, [formData.departamento.value]);

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        DPI: {
          value: user.DPI || '',
          isValid: validateDPI(user.DPI || ''),
          showError: false
        },
        username: {
          value: user.username || '',
          isValid: validateUsername(user.username || ''),
          showError: false
        },
        name: {
          value: user.name || '',
          isValid: validateEmpty(user.name || ''),
          showError: false
        },
        surname: {
          value: user.surname || '',
          isValid: validateEmpty(user.surname || ''),
          showError: false
        },
        YYYY: {
          value: user.birthdate ? user.birthdate.split('-')[0] : '',
          isValid: validateEmpty(user.birthdate ? user.birthdate.split('-')[0] : ''),
          showError: false
        },
        MM: {
          value: user.birthdate ? user.birthdate.split('-')[1] : '',
          isValid: validateEmpty(user.birthdate ? user.birthdate.split('-')[1] : ''),
          showError: false
        },
        DD: {
          value: user.birthdate ? user.birthdate.split('T')[0].split('-')[2] : '',
          isValid: validateEmpty(user.birthdate ? user.birthdate.split('T')[0].split('-')[2] : ''),
          showError: false
        },
        gender: {
          value: user.gender || '',
          isValid: validateSelect(user.gender || ''),
          showError: false
        }
      }));
    }
  }, [user]);

  const isSubmitButtonDisable =
    !formData.email.isValid ||
    !formData.profession.isValid ||
    !formData.phone.isValid ||
    !formData.departamento.isValid ||
    !formData.municipio.isValid ||
    !formData.currentLocation.isValid ||
    !formData.vision.isValid ||
    !formData.illiteracy.isValid;

  const handleValueChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      }
    }));
  };

  const handleValidationOnBlur = (value, field) => {
    let isValid = false;
    switch (field) {
      case 'email':
        isValid = validateEmail(value);
        break;
      case 'profession':
        isValid = validateSelect(value);
        break;
      case 'phone':
        isValid = validatePhone(value);
        break;
      case 'departamento':
        isValid = validateSelect(value);
        break;
      case 'municipio':
        isValid = validateSelect(value);
        break;
      case 'currentLocation':
        isValid = validateEmpty(value);
        break;
      case 'vision':
        isValid = validateSelect(value);
        break;
      case 'illiteracy':
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

  const handleJoin = async (e) => {
    e.preventDefault();
    const birthdate = `${formData.YYYY.value}/${formData.MM.value}/${formData.DD.value}`;
    const joinData = await join({
      phone: formData.phone.value,
      profession: formData.profession.value,
      email: formData.email.value,
      department: formData.departamento.value,
      town: formData.municipio.value,
      address: formData.currentLocation.value,
      literacy: formData.illiteracy.value,
      sight: formData.vision.value,
    });
  };

  return (
    <div className="register-container">
      <div className="auth-box-register">
        <div className='general-container'>
          <div className="logo-container">
            <img src={logoGobierno} alt="Logo" className="logo" />
            <div className='title-container'>
              <h2 className="title-register">EMPADRONARME</h2>
            </div>
            <img src={logoTse} alt="Logo" className="logoTse" />
          </div>
        </div>
        <form className="auth-form-register" onSubmit={handleJoin}>
          <div className="first-inputs-container">
            <div className="input-container">
              <Input
                field='username'
                label={<label>Usuario</label>}
                value={formData.username.value}
                onChangeHandler={handleValueChange}
                type='text'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.username.showError}
                validationMessage={usernameValidationMessage}
                icon={FaRegUser}
                maxLength={20}
                disabled={true}
              />
            </div>
            <div className="input-container">
              <Input
                field='DPI'
                label={<label>DPI</label>}
                value={formData.DPI.value}
                onChangeHandler={handleValueChange}
                type='number'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.DPI.showError}
                validationMessage={confirmDPIValidationMessage}
                icon={FaRegUser}
                disabled={true}
              />
            </div>
            <div className="input-container">
              <Input
                field='name'
                label={<label>Nombres</label>}
                value={formData.name.value}
                onChangeHandler={handleValueChange}
                type='text'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.name.showError}
                validationMessage={emptyValidationMessage}
                icon={FaRegUser}
                disabled={true}
              />
            </div>
            <div className="input-container">
              <Input
                field='surname'
                label={<label>Apellidos</label>}
                value={formData.surname.value}
                onChangeHandler={handleValueChange}
                type='text'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.surname.showError}
                validationMessage={emptyValidationMessage}
                icon={FaRegUser}
                disabled={true}
              />
            </div>
            <span className="input-container">
              <label>Fecha de Nacimiento</label>
              <span className="select-wrapper-date">
                <MdDateRange className="select-icon" />
                <input
                  type="text"
                  value={formData.DD.value}
                  onChange={(e) => handleValueChange(e.target.value, 'DD')}
                  onBlur={(e) => handleValidationOnBlur(e.target.value, 'DD')}
                  placeholder="DD"
                  maxLength={2}
                  className="input-center"
                  disabled={true}
                />
                <span>/</span>
                <input
                  type="text"
                  value={formData.MM.value}
                  onChange={(e) => handleValueChange(e.target.value, 'MM')}
                  onBlur={(e) => handleValidationOnBlur(e.target.value, 'MM')}
                  placeholder="MM"
                  className="input-center"
                  maxLength={2}
                  disabled={true}
                />
                <span>/</span>
                <input
                  type="text"
                  value={formData.YYYY.value}
                  onChange={(e) => handleValueChange(e.target.value, 'YYYY')}
                  onBlur={(e) => handleValidationOnBlur(e.target.value, 'YYYY')}
                  placeholder="YYYY"
                  className="input-center"
                  maxLength={4}
                  disabled={true}
                />
              </span>
              {(formData.YYYY.showError || formData.MM.showError || formData.DD.showError) && (
                <span className="validation-message">
                  {selectValidationMessage}
                </span>
              )}
            </span>
            <div className="input-container">
              <label>Género</label>
              <div className="select-wrapper">
                <FaRegUser className="select-icon" />
                <select
                  value={formData.gender.value}
                  onChange={(e) => handleValueChange(e.target.value, 'gender')}
                  onBlur={(e) => handleValidationOnBlur(e.target.value, 'gender')}
                  disabled={true}
                >
                  <option value="">Selecciona un género</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>

              </div>
              {formData.gender.showError && (
                <span className="validation-message">
                  {selectValidationMessage}
                </span>
              )}
            </div>
            <div className="select-container">
              <label>Profesión</label>
              <div className="select-wrapper-selects">
              <Select
                  options={professions ? professions.map(prof => ({ value: prof._id, label: prof.nameProfession })) : []}
                  value={professions ? professions.find(option => option.value === formData.profession.value) : null}
                  onChange={selectedOption => handleValueChange(selectedOption.value, 'profession')}
                  onBlur={() => handleValidationOnBlur(formData.profession.value, 'profession')}
                  placeholder="Selecciona una profesión"
                  classNamePrefix="react-select"
                  isLoading={isFetchingProfessions}
                  components={{ValueContainer: CustomValueContainer}}
                  icon={FaUserTie}
              />
              </div>
              {formData.profession.showError && (
                <span className="validation-message">
                  {selectValidationMessage}
                </span>
              )}
            </div>
            <div className="input-container">
              <Input
                field='phone'
                label={<label>Teléfono</label>}
                value={formData.phone.value}
                onChangeHandler={handleValueChange}
                type='text'
                onBlurHandler={handleValidationOnBlur}
                showErrorMessage={formData.phone.showError}
                validationMessage={phoneValidationMessage}
                icon={MdOutlinePhoneAndroid}
                maxLength={13}
              />
            </div>
          </div>
          <div className="input-container">
            <Input
              field='email'
              label={<label>Email</label>}
              value={formData.email.value}
              onChangeHandler={handleValueChange}
              type='email'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.email.showError}
              validationMessage={emailValidationMessage}
              icon={HiOutlineMail}
            />
          </div>
          <div className="first-inputs-container">
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
                  components={{ValueContainer: CustomValueContainer}}
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
              <label>Municipio</label>
              <div className="select-wrapper-selects">
                <Select
                  options={towns ? towns.map(muni => ({ value: muni.name, label: muni.name })) : []}
                  value={towns ? towns.find(option => option.value === formData.municipio.value) : null}
                  onChange={selectedOption => handleValueChange(selectedOption.value, 'municipio')}
                  onBlur={() => handleValidationOnBlur(formData.municipio.value, 'municipio')}
                  placeholder="Selecciona un municipio"
                  classNamePrefix="react-select"
                  isLoading={isFetchingTowns}
                  components={{ValueContainer: CustomValueContainer}}
                  icon={HiKey}
                />
              </div>
              {formData.municipio.showError && (
                <span className="validation-message">
                  {selectValidationMessage}
                </span>
              )}
            </div>
          </div>
          <div className="input-container">
            <Input
              field='currentLocation'
              label={<label>Dirección Actual</label>}
              value={formData.currentLocation.value}
              onChangeHandler={handleValueChange}
              type='text'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.currentLocation.showError}
              validationMessage={emptyValidationMessage}
              icon={HiKey}
              maxLength={50}
            />
          </div>
          <div className="first-inputs-container">
            <div className="input-container">
              <label>Vista</label>
              <div className="select-wrapper">
                <FaRegUser className="select-icon" />
                <select
                  value={formData.vision.value}
                  onChange={(e) => handleValueChange(e.target.value, 'vision')}
                  onBlur={(e) => handleValidationOnBlur(e.target.value, 'vision')}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="No vidente">No Vidente</option>
                  <option value="Vidente">Vidente</option>
                </select>
              </div>
              {formData.vision.showError && (
                <span className="validation-message">
                  {selectValidationMessage}
                </span>
              )}
            </div>
            <div className="input-container">
              <label>Analfabetismo</label>
              <div className="select-wrapper">
                <FaRegUser className="select-icon" />
                <select
                  value={formData.illiteracy.value}
                  onChange={(e) => handleValueChange(e.target.value, 'illiteracy')}
                  onBlur={(e) => handleValidationOnBlur(e.target.value, 'illiteracy')}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="No lee, No escribe">No lee, No escribe</option>
                  <option value="Lee">Lee</option>
                  <option value="Escribe">Escribe</option>
                  <option value="Lee, Escribe">Lee, Escribe</option>
                </select>
              </div>
              {formData.illiteracy.showError && (
                <span className="validation-message">
                  {selectValidationMessage}
                </span>
              )}
            </div>
          </div>
          <div className="first-inputs-container">
            <button
              className="btn btn-primary rounded-pill text-white login-button"
              style={{ backgroundColor: 'red' }}
              onClick={() => navigate('/homepage')}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary rounded-pill text-white login-button"
              disabled={isSubmitButtonDisable}
            >
              Registrar
            </button>  
          </div>
        </form>
      </div>
    </div>
  );
};
