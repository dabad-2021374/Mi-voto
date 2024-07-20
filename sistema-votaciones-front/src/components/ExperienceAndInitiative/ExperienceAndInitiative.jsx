import React, { useState, useEffect } from "react"
import Navbar from '../Nabvar/Navbar'
import './ExperienceAndInitiative.css'
import agregar from '../../assets/images/agregar.png'
import eliminar from '../../assets/images/eliminar.png'
import editar from '../../assets/images/editar.png'
import { FaTimes } from "react-icons/fa"
import { useGetInitiatives } from "../../shared/hooks/Initiative/useGetInitiative"
import { useGetExperiences } from "../../shared/hooks/Experience/useGetExperiences"
import { useDeleteInitiative } from '../../shared/hooks/Initiative/useDeleteInitiative'
import { AddIniciative } from "./AddIniciative"
import { UpdateInitiative } from "./UpdateInitiative"
import { AddExperience } from "./AddExperience"
import { UpdateExperience } from "./UpdateExperience"
import { useDeleteExperience } from "../../shared/hooks/Experience/useDeleteExperience"

export const ExperienceAndInitiative = () => {
    const { getInitiativesUser, isLoading, initiatives } = useGetInitiatives()
    const { getExperienciesUser, experiences } = useGetExperiences()
    const { deleteInitiative } = useDeleteInitiative()
    const { deleteExperience } = useDeleteExperience()
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [selectedItem, setSelectedItem] = useState(null)
    const [isExperienceModal, setIsExperienceModal] = useState(false)

    useEffect(() => {
        getInitiativesUser()
        getExperienciesUser()
    }, [])


    const openAddExperienceModal = () => {
        setSelectedItem(null)
        setIsEditing(false)
        setIsExperienceModal(true)
        setModalIsOpen(true)
    }

    const openAddInitiativeModal = () => {
        setSelectedItem(null)
        setIsEditing(false)
        setIsExperienceModal(false)
        setModalIsOpen(true)
    }

    const openEditExperienceModal = (experiences) => {
        setSelectedItem(experiences)
        setIsEditing(true)
        setIsExperienceModal(true)
        setModalIsOpen(true)
    }

    const openEditInitiativeModal = (initiatives) => {
        setSelectedItem(initiatives)
        setIsEditing(true)
        setIsExperienceModal(false)
        setModalIsOpen(true)
    }

    const closeModal = () => {
        setModalIsOpen(false)
    }

    const handleDeleteIni = async (id) => {
        await deleteInitiative(id)
        getInitiativesUser()
    }

    const handleDeleteExp = async (id) => {
        await deleteExperience(id)
        getExperiencesUser()
    }

    //formato de fecha para mostrarlo en dd/mm/yyyy
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = String(date.getUTCDate()).padStart(2, '0')
        const month = String(date.getUTCMonth() + 1).padStart(2, '0')
        const year = date.getUTCFullYear()
        return `${day}/${month}/${year}`
    }

    return (
        <div>
            <Navbar pageTitle={'Experiencias e iniciativas'} />
            <div className="ei-main-container">
                <div className="ei-experiences-container">
                    <div className="ei-title-container">
                        <h2>Tus experiencias</h2>
                        <img src={agregar} alt="Agregar" className="ei-add-icon" onClick={openAddExperienceModal} />
                    </div>
                    <div className="ei-experiences">
                        <div className="ei-experience-cards">
                            {experiences.map((experience) => (
                                <div key={experience._id} className="ei-experience-card">
                                    <div className="experience-icon-container">
                                        <img
                                            src={eliminar}
                                            alt="Eliminar"
                                            className="experience-icon"
                                            onClick={() => handleDeleteExp(experience._id)}
                                        />
                                        <img
                                            src={editar}
                                            alt="Editar"
                                            className="experience-icon"
                                            onClick={() => openEditExperienceModal(experience)}
                                        />
                                    </div>
                                    <h3>{experience.title}</h3>
                                    <p><strong>Institución:</strong> {experience.institution}</p>
                                    <p><strong>Desde:</strong> {formatDate(experience.startDate)}</p>
                                    <p><strong>Hasta:</strong> {formatDate(experience.endDate)}</p>
                                    <p>{experience.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="ei-initiatives-container">
                    <div className="ei-title-container">
                        <h2>Tus iniciativas</h2>
                        <img src={agregar} alt="Agregar" className="ei-add-icon" onClick={openAddInitiativeModal} />
                    </div>
                    <div className="ei-initiatives">
                        <div className="ei-initiatives-cards">
                            {initiatives.length > 0 ? (
                                initiatives.map((initiative) => (
                                    <div key={initiative._id} className="ei-initiative-card">
                                        <div className="initiative-icon-container">
                                            <img
                                                src={eliminar}
                                                alt="Eliminar"
                                                className="initiative-icon"
                                                onClick={() => handleDeleteIni(initiative._id)}
                                            />
                                            <img
                                                src={editar}
                                                alt="Editar"
                                                className="initiative-icon"
                                                onClick={() => openEditInitiativeModal(initiative)}
                                            />
                                        </div>
                                        <h3>Iniciativa: {initiative.noInitiative}</h3>
                                        <p><strong>Fecha:</strong> {new Date(initiative.date).toLocaleDateString()}</p>
                                        <p>{initiative.resume}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No hay iniciativas disponibles.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {modalIsOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        {isExperienceModal ? (
                            isEditing ? (
                                <UpdateExperience switchAuthHandler={closeModal} experience={selectedItem} refreshExperiences={getExperienciesUser} />
                            ) : (
                                <AddExperience switchAuthHandler={closeModal} refreshExperiences={getExperienciesUser} />
                            )
                        ) : isEditing ? (
                            <UpdateInitiative switchAuthHandler={closeModal} initiative={selectedItem} refreshInitiatives={getInitiativesUser} />
                        ) : (
                            <AddIniciative switchAuthHandler={closeModal} refreshInitiatives={getInitiativesUser} />
                        )}
                        <button onClick={closeModal} className="modal-close-button">
                            <FaTimes />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
