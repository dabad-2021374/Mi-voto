import React, { useState } from "react"
import { Input } from "../Input.jsx"
import './AddIniciativeAndExperience.css'
import { useUpdateInitiative } from "../../shared/hooks/Initiative/useUpdateInitiative.jsx"

export const UpdateInitiative = ({ switchAuthHandler, initiative, refreshInitiatives }) => {
  const { updateInitiative, isLoading } = useUpdateInitiative()

  const [formData, setFormData] = useState({
    noInitiative: {
      value: initiative.noInitiative || '',
      isValid: !!initiative.noInitiative,
      showError: false
    },
    date: {
      value: initiative.date || '',
      isValid: !!initiative.date,
      showError: false
    },
    resume: {
      value: initiative.resume || '',
      isValid: !!initiative.resume,
      showError: false
    }
  })

  const isSubmitButtonDisable = !formData.resume.isValid

  const handleValueChange = (value, field) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        value,
      }
    }))
  }

  const handleValidationOnBlur = (value, field) => {
    let isValid = value.trim() !== ''
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        isValid,
        showError: !isValid
      }
    }))
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const data = {
      resume: formData.resume.value,
    }
    await updateInitiative(initiative._id, data, refreshInitiatives)
    switchAuthHandler()
  }

  return (
    <div className="">
      <div className="auth-box-register">
        <div className='general-container'>
          <div className="logo-container">
            <h2 className="title-register">Actualizar Iniciativa</h2>
          </div>
        </div>
        <form className="auth-form-register" onSubmit={handleUpdate}>
          <div className="input-container">
            <Input
              field='noInitiative'
              label={<label>Número de Iniciativa</label>}
              value={formData.noInitiative.value}
              onChangeHandler={handleValueChange}
              type='text'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.noInitiative.showError}
              validationMessage="El número de iniciativa es requerido"
              maxLength={20}
              disabled={true}
            />
          </div>
          <div className="input-container">
            <Input
              field='date'
              label={<label>Fecha</label>}
              value={formData.date.value}
              onChangeHandler={handleValueChange}
              type='date'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.date.showError}
              validationMessage="La fecha es requerida"
              disabled={true}
            />
          </div>
          <div className="input-container">
            <Input
              field='resume'
              label={<label>Resumen</label>}
              value={formData.resume.value}
              onChangeHandler={handleValueChange}
              type='text'
              onBlurHandler={handleValidationOnBlur}
              showErrorMessage={formData.resume.showError}
              validationMessage="El resumen es requerido"
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
  )
}
