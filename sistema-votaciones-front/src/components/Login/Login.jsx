import React, { useState } from 'react';
import { Input } from '../Input';
import { FaLock } from 'react-icons/fa';
import { FaRegUser } from 'react-icons/fa';
import { LuLayoutGrid } from 'react-icons/lu';
import { codeValidationMessage, passwordValidationMessage, userValidationMessage, validateCodeUser, validateEmpty, validatePassword, validateUser } from '../../shared/validators/validator';
import ImageCarousel from './ImageCarousel';
import logoGobierno from '../../assets/images/logoGobierno.png'
import './Login.css';
import { useLogin } from '../../shared/hooks/useLogin'

export const Login = ({ switchAuthHandler }) => {
  const {login, isLoading} = useLogin()
  const [formData, setFormData] = useState({
    code: {
      value: "",
      isValid: false,
      showError: false
    },
    user: {
      value: "",
      isValid: false,
      showError: false
    },
    password: {
      value: "",
      isValid: false,
      showError: false
    }
  });

  const isSubmitButtonDisable = !formData.code.isValid || !formData.user.isValid || !formData.password.isValid;

  const handleValidationOnBlur = (value, field) => {
    let isValid = false;
    switch (field) {
      case 'code':
        isValid = validateCodeUser(value);
        break;
      case 'user':
        isValid = validateUser(value);
        break;
      case 'password':
        isValid = validateEmpty(value);
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

  const onValueChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value
      }
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault()
    login(
      formData.code.value,
      formData.user.value, 
      formData.password.value
    )
  }
  
  return (
    <div className="login-container">
      <ImageCarousel />
      <div className="auth-box">
        <div className='general-container-login'>
          <div className="logo-container">
            <img src={logoGobierno} alt="Logo" className="logo"/>
            <div className='title-container-login'>
              <h2  className="title-login">INGRESO</h2>
              <h2  className="title-login">VOTANTES</h2>
            </div>
          </div>
        </div>
        <form name='form1' className="auth-form" onSubmit={handleLogin}>
          <div className="input-container">
            <Input
              field="code"
              label={<label>Código</label>}
              value={formData.code.value}
              onChangeHandler={onValueChange}
              type="text"
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.code.showError}
              validationMessage={codeValidationMessage}
              icon={LuLayoutGrid}
            />
          </div>
          <div className="input-container">
            <Input
              field="user"
              label={<label>Usuario</label>}
              value={formData.user.value}
              onChangeHandler={onValueChange}
              type="text"
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.user.showError}
              validationMessage={userValidationMessage}
              icon={FaRegUser}
            />
          </div>
          <div className="input-container">
            <Input
              field="password"
              label={<label>Contraseña</label>}
              value={formData.password.value}
              onChangeHandler={onValueChange}
              type="password"
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.password.showError}
              validationMessage={passwordValidationMessage}
              icon={FaLock}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill text-white login-button"
            disabled={isSubmitButtonDisable}
          >
            Iniciar Sesión
          </button>
        </form>
        <span onClick={switchAuthHandler} className="auth-form-switch-label">
          ¿No tienes una cuenta? Regístrate aquí
        </span>
      </div>
    </div>
  );
};
