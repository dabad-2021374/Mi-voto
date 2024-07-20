import React, { useState } from "react"
import { Input } from "../Input.jsx"
import './AddIniciativeAndExperience.css'
import { useAddExperience } from "../../shared/hooks/Experience/useAddExperience.jsx"

export const AddExperience = ({ switchAuthHandler, refreshExperiences }) => {
    const { addExperience, isLoading } = useAddExperience()

    const [formData, setFormData] = useState({
        title: {
            value: '',
            isValid: false,
            showError: false
        },
        startDate: {
            value: '',
            isValid: false,
            showError: false
        },
        endDate: {
            value: '',
            isValid: false,
            showError: false
        },
        institution: {
            value: '',
            isValid: false,
            showError: false
        },
        description: {
            value: '',
            isValid: false,
            showError: false
        }
    })

    const isSubmitButtonDisable =
        !formData.title.isValid ||
        !formData.startDate.isValid ||
        !formData.endDate.isValid ||
        !formData.institution.isValid ||
        !formData.description.isValid

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

    const handleRegister = async (e) => {
        e.preventDefault()
        const data = {
            title: formData.title.value,
            startDate: formData.startDate.value,
            endDate: formData.endDate.value,
            institution: formData.institution.value,
            description: formData.description.value,
        }
        await addExperience(data, refreshExperiences)
        switchAuthHandler()
    }

    return (
        <div className="">
            <div className="auth-box-register">
                <div className='general-container'>
                    <div className="logo-container">
                        <h2 className="title-register">Agrega una nueva experiencia</h2>
                    </div>
                </div>
                <form className="auth-form-register" onSubmit={handleRegister}>
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
                            label={<label>Fecha de Fin</label>}
                            value={formData.endDate.value}
                            onChangeHandler={handleValueChange}
                            type='date'
                            onBlurHandler={handleValidationOnBlur}
                            showErrorMessage={formData.endDate.showError}
                            validationMessage="La fecha de fin es requerida"
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
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    )
}
