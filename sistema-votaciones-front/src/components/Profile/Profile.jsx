import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import { useNavigate } from 'react-router-dom';
import { Input } from "../Input.jsx";
import { FaRegUser, FaUserTie } from "react-icons/fa";
import { MdDateRange, MdOutlinePhoneAndroid } from "react-icons/md";
import { HiKey, HiOutlineMail } from "react-icons/hi";
import { useUpdate } from "../../shared/hooks/useUserUpdate.jsx";
import { useGetProfession } from "../../shared/hooks/profession/useGetProfession.jsx";
import { useGetDepartments } from "../../shared/hooks/department/useGetDepartments.jsx";
import { useGetTowns } from "../../shared/hooks/town/useGetTowns.jsx";
import imgDefault from '../../assets/images/defaultImage.png';
import './Profile.css';
import {
  confirmDPIValidationMessage,
  emailValidationMessage,
  emptyValidationMessage,
  phoneValidationMessage,
  selectValidationMessage,
  usernameValidationMessage,
  validateDPI,
  validateEmail,
  validateEmpty,
  validatePhone,
  validateSelect,
  validateUsername
} from "../../shared/validators/validator.js";
import { useGetProfile } from "../../shared/hooks/useUserProfile.jsx";
import Navbar from "../Nabvar/Navbar.jsx";

const CustomValueContainer = (props) => {
  const { children, selectProps } = props;
  const Icon = selectProps.icon;
  return (
    <components.ValueContainer {...props}>
      {Icon && <Icon className="select-icon-property" />}
      {children}
    </components.ValueContainer>
  );
};

export const Profile = () => {
  const { update, isLoading } = useUpdate();
  const { users: fetchedUser, isFetching: isFetchingUsers, getUsers } = useGetProfile();
  const { professions, isFetching: isFetchingProfessions, getProfessions } = useGetProfession();
  const { departments, isFetching: isFetchingDepartments, getDepartments } = useGetDepartments();
  const { towns, isFetching: isFetchingTowns, getTowns } = useGetTowns();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  useEffect(() => {
    getProfessions();
    getDepartments();
    getUsers();
  }, []);

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
  });
  console.log(user)
  useEffect(() => {
    if (user) {
      const userDepartment = departments.find(dept => dept._id === user.department);
      const userProfession = professions.find(prof => prof._id === user.profession._id);

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
        },
        profession: {
          value: userProfession ? { value: userProfession._id, label: userProfession.nameProfession } : null,
          isValid: validateSelect(userProfession ? userProfession._id : ''),
          showError: false
        },
        phone: {
          value: user.phone || '',
          isValid: validatePhone(user.phone || ''),
          showError: false
        },
        email: {
          value: user.email || '',
          isValid: validateEmail(user.email || ''),
          showError: false
        },
        departamento: {
          value: userDepartment ? { value: userDepartment._id, label: userDepartment.department } : null,
          isValid: validateSelect(userDepartment ? userDepartment._id : ''),
          showError: false
        },
        currentLocation: {
          value: user.address || '',
          isValid: validateEmpty(user.address || ''),
          showError: false
        }
      }));
      if (userDepartment) {
        getTowns(userDepartment._id);
      }
    }
  }, [user, professions, departments]);

  useEffect(() => {
    if (towns && towns.length && user) {
      const userTown = towns.find(town => town.name === user.town);

      setFormData(prevData => ({
        ...prevData,
        municipio: {
          value: userTown ? { value: userTown.name, label: userTown.name } : null,
          isValid: validateSelect(userTown ? userTown.name : ''),
          showError: false
        }
      }));
    }
  }, [towns, user]);

  const isSubmitButtonDisable =
    !formData.email.isValid ||
    !formData.profession.isValid ||
    !formData.phone.isValid ||
    !formData.departamento.isValid ||
    !formData.municipio.isValid ||
    !formData.currentLocation.isValid;

  const handleValueChange = (value, field) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value
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
      default:
        break;
    }
    setFormData(prevData => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        isValid,
        showError: !isValid
      }
    }));
  };

  const handleUpdate = async e => {
    e.preventDefault();
    const updatedData = {
      email: formData.email.value,
      phone: formData.phone.value,
      profession: formData.profession.value.value,
      photo: selectedFile
    };
    const response = await update(updatedData);
    if (response && response.user) {
      setUser(response.user)
    }
    if (selectedFile) {
      setSelectedFile(null);
    }
  };

  const handleUpdateClick = async e => {
    e.preventDefault();
    if (isUpdating) {
      localStorage.setItem('user', JSON.stringify(user));
      await handleUpdate(e);
      setIsUpdating(false);
     window.location.reload()
    } else {
      setIsUpdating(true);
    }
  };

  const handlePhotoChange = event => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
    console.log("Archivo seleccionado:", file);
  };

  return (
    <div className="register-container">
      <Navbar pageTitle={'Perfil Usuario'} />
      <div className="auth-box-update">
        <div className="profile-photo-container">
          <img src={user && user.photo ? user.photo : imgDefault} alt="Foto de perfil" className="profile-photo" />
          <input
            type="file"
            name="userImagePath"
            className="custom-file-input"
            ref={fileInputRef}
            onChange={handlePhotoChange}
            disabled={!isUpdating} 
          />
        </div>
        <form className="auth-form-register">
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
                  value={formData.profession.value}
                  onChange={selectedOption => handleValueChange(selectedOption, 'profession')}
                  onBlur={() => handleValidationOnBlur(formData.profession.value, 'profession')}
                  placeholder="Selecciona una profesión"
                  classNamePrefix="react-select"
                  isLoading={isFetchingProfessions}
                  isDisabled={!isUpdating}
                  components={{ ValueContainer: CustomValueContainer }}
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
                disabled={!isUpdating}
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
              disabled={!isUpdating}
            />
          </div>
          <div className="first-inputs-container">
            <div className="select-container">
              <label>Departamento</label>
              <div className="select-wrapper-selects">
                <Select
                  options={departments ? departments.map(depa => ({ value: depa._id, label: depa.department })) : []}
                  value={formData.departamento.value}
                  onChange={selectedOption => handleValueChange(selectedOption, 'departamento')}
                  onBlur={() => handleValidationOnBlur(formData.departamento.value, 'departamento')}
                  placeholder="Selecciona un departamento"
                  classNamePrefix="react-select"
                  isLoading={isFetchingDepartments}
                  isDisabled={true}
                  components={{ ValueContainer: CustomValueContainer }}
                  icon={HiKey}
                />
              </div>
              {formData.departamento.showError && (
                <span className="validation-message">
                  {validateSelect}
                </span>
              )}
            </div>
            <div className="select-container">
              <label>Municipio</label>
              <div className="select-wrapper-selects">
                <Select
                  options={towns ? towns.map(muni => ({ value: muni.name, label: muni.name })) : []}
                  value={formData.municipio.value}
                  onChange={selectedOption => handleValueChange(selectedOption, 'municipio')}
                  onBlur={() => handleValidationOnBlur(formData.municipio.value, 'municipio')}
                  placeholder="Selecciona un municipio"
                  classNamePrefix="react-select"
                  isDisabled={true}
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
              disabled={true}
            />
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
              disabled={!isUpdating ? false : isSubmitButtonDisable}
              onClick={handleUpdateClick}
              >
                {isUpdating ? 'Guardar' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
