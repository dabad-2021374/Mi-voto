import React, { useState } from "react";
import { Input } from "../Input.jsx";
import './AddIniciativeAndExperience.css';
import { useAddInitiative } from "../../shared/hooks/Initiative/useAddInitiative.jsx";

export const AddIniciative = ({ switchAuthHandler, refreshInitiatives }) => {
    const { addInitiative, isLoading } = useAddInitiative();

    const [formData, setFormData] = useState({
        noInitiative: {
            value: '',
            isValid: false,
            showError: false
        },
        date: {
            value: '',
            isValid: false,
            showError: false
        },
        resume: {
            value: '',
            isValid: false,
            showError: false
        }
    });

    const isSubmitButtonDisable =
        !formData.noInitiative.isValid ||
        !formData.date.isValid ||
        !formData.resume.isValid;

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

    const handleRegister = async (e) => {
        e.preventDefault();
        const data = {
            noInitiative: formData.noInitiative.value,
            date: formData.date.value,
            resume: formData.resume.value,
        };
        await addInitiative(data, refreshInitiatives);
        switchAuthHandler();
    };

    return (
        <div className="">
            <div className="auth-box-register">
                <div className='general-container'>
                    <div className="logo-container">
                        <h2 className="title-register">Agrega una nueva iniciativa</h2>
                    </div>
                </div>
                <form className="auth-form-register" onSubmit={handleRegister}>
                    <div className="input-container">
                        <Input
                            field='noInitiative'
                            label={<label>Número de Iniciativa</label>}
                            value={formData.noInitiative.value}
                            onChangeHandler={handleValueChange}
                            type='number'
                            onBlurHandler={handleValidationOnBlur}
                            showErrorMessage={formData.noInitiative.showError}
                            validationMessage="El número de iniciativa es requerido"
                            maxLength={20}
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
                        Registrar
                    </button>
                </form>
            </div>
        </div>
    );
};
