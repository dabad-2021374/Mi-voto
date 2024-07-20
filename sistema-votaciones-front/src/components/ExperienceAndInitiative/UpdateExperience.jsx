import React, { useState } from "react";
import { Input } from "../Input.jsx";
import './AddIniciativeAndExperience.css';
import { useUpdateExperience } from "../../shared/hooks/Experience/useUpdateExperience.jsx";

export const UpdateExperience = ({ switchAuthHandler, experience, refreshExperiences }) => {
  const { updateExperience, isLoading } = useUpdateExperience();

    const formatDate = (dateString) => {
    const date = new Date(dateString)
    const isoDate = date.toISOString().split('T')[0]
    return isoDate
  }

  const [formData, setFormData] = useState({
    title: {
      value: experience.title || '',
      isValid: !!experience.title,
      showError: false
    },
    startDate: {
      value: formatDate(experience.startDate),
      isValid: !!experience.startDate,
      showError: false
    },
    endDate: {
      value: formatDate(experience.endDate),
      isValid: !!experience.endDate,
      showError: false
    },
    institution: {
      value: experience.institution || '',
      isValid: !!experience.institution,
      showError: false
    },
    description: {
      value: experience.description || '',
      isValid: !!experience.description,
      showError: false
    }
  });

  const isSubmitButtonDisable = !formData.description.isValid;

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
    let isValid = value.trim() !== '';
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        isValid,
        showError: !isValid
      }
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = {
      title: formData.title.value,
      startDate: formData.startDate.value,
      endDate: formData.endDate.value,
      institution: formData.institution.value,
      description: formData.description.value,
    };
    await updateExperience(experience._id, data, refreshExperiences);
    switchAuthHandler();
  };

  return (
    <div className="">
      <div className="auth-box-register">
        <div className='general-container'>
          <div className="logo-container">
            <h2 className="title-register">Actualizar Experiencia</h2>
          </div>
        </div>
        <form className="auth-form-register" onSubmit={handleUpdate}>
          <div className="input-container">
            <Input
              field='title'
              label={<label>Título</label>}
              value={formData.title.value}
              onChangeHandler={handleValueChange}
              type='text'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.title.showError}
              validationMessage="El título es requerido"
              maxLength={100}
            />
          </div>
          <div className="input-container">
            <Input
              field='startDate'
              label={<label>Fecha de Inicio</label>}
              value={formData.startDate.value}
              onChangeHandler={handleValueChange}
              type='date'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.startDate.showError}
              validationMessage="La fecha de inicio es requerida"
            />
          </div>
          <div className="input-container">
            <Input
              field='endDate'
              label={<label>Fecha de Finalización</label>}
              value={formData.endDate.value}
              onChangeHandler={handleValueChange}
              type='date'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.endDate.showError}
              validationMessage="La fecha de finalización es requerida"
            />
          </div>
          <div className="input-container">
            <Input
              field='institution'
              label={<label>Institución</label>}
              value={formData.institution.value}
              onChangeHandler={handleValueChange}
              type='text'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.institution.showError}
              validationMessage="La institución es requerida"
              maxLength={100}
            />
          </div>
          <div className="input-container">
            <Input
              field='description'
              label={<label>Descripción</label>}
              value={formData.description.value}
              onChangeHandler={handleValueChange}
              type='text'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.description.showError}
              validationMessage="La descripción es requerida"
              maxLength={500}
            />
          </div>
          <button
            className="btn btn-primary rounded-pill text-white login-button"
            disabled={isSubmitButtonDisable}
          >
            Actualizar
          </button>
        </form>
      </div>
    </div>
  );
};
