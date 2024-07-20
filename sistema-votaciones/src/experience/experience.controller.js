'use strict'
import Experience from './experience.model.js'

export const addExperience = async (req, res) => {
    try {
        const userId = req.user._id
        const { title, startDate, endDate, institution, description, photoTitle } = req.body
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (new Date(startDate) >= today) {
            return res.status(400).send({ message: 'Fecha de inicio debe ser anterior a la fecha actual.' });
        }

        if (new Date(endDate) > new Date() || new Date(endDate) <= new Date(startDate)) {
            return res.status(400).send({ message: 'Fecha de finalización debe ser posterior a la fecha de inicio y no puede ser mayor a la fecha actual.' });
        }

        // Buscar si ya existe un registro de experiencia para el usuario
        let userExperience = await Experience.findOne({ user: userId });
        const newExperience = {
            title,
            startDate,
            endDate,
            institution,
            description,
            photoTitle
        }

        if (userExperience) {
            userExperience.experience.push(newExperience)
            await userExperience.save()
        } else {
            userExperience = new Experience({
                user: userId,
                experience: [newExperience]
            })
            await userExperience.save()
        }
        return res.send({ message: 'Experiencia agregada', userExperience })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al agregar experiencia', error })
    }
}

export const updateExperience = async (req, res) => {
    try {
        const userId = req.user._id
        const { id } = req.params
        const { title, startDate, endDate, institution, description, photoTitle } = req.body

        let userExperience = await Experience.findOne({ user: userId })
        if (!userExperience) return res.status(404).send({ message: 'No se encontró la experiencia del usuario' })

        const experienceIndex = userExperience.experience.findIndex(exp => exp._id.toString() === id)
        if (experienceIndex === -1) {
            return res.status(404).send({ message: 'No se encontró la experiencia especificada' })
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (startDate && new Date(startDate) >= today) {
            return res.status(400).send({ message: 'Fecha de inicio debe ser anterior a la fecha actual.' })
        }

        if (endDate && (new Date(endDate) > new Date() || new Date(endDate) <= new Date(startDate || userExperience.experience[experienceIndex].startDate))) {
            return res.status(400).send({ message: 'Fecha de finalización debe ser posterior a la fecha de inicio y no puede ser mayor a la fecha actual.' })
        }

        // Actualizar los campos
        if (title) userExperience.experience[experienceIndex].title = title
        if (startDate) userExperience.experience[experienceIndex].startDate = startDate
        if (endDate) userExperience.experience[experienceIndex].endDate = endDate
        if (institution) userExperience.experience[experienceIndex].institution = institution
        if (description) userExperience.experience[experienceIndex].description = description
        if (photoTitle) userExperience.experience[experienceIndex].photoTitle = photoTitle

        await userExperience.save()
        return res.send({ message: 'Experiencia actualizada', updatedExperience: userExperience.experience[experienceIndex] })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al actualizar la experiencia', error })
    }
}

export const deleteExperience = async (req, res) => {
    try {
        const userId = req.user._id
        const { experienceId } = req.params

        let userExperience = await Experience.findOne({ user: userId })
        if (!userExperience) return res.status(404).send({ message: 'No se encontró la experiencia del usuario' })
        // Encontrar la experiencia específica por su ID dentro del array de experiencias
        const experienceIndex = userExperience.experience.findIndex(exp => exp._id.toString() === experienceId)
        if (experienceIndex === -1) return res.status(404).send({ message: 'No se encontró la experiencia especificada' })
        
        // Eliminar la experiencia específica del array
        userExperience.experience.splice(experienceIndex, 1)
        await userExperience.save()
        return res.send({ message: 'Experiencia eliminada' })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al eliminar la experiencia', error })
    }
}

export const getExperiences = async (req, res) => {
    try {
        const userId = req.user._id
        const experiences = await Experience.find({ user: userId })
        if (!experiences) return res.status(404).send({ message: 'No se encontraron experiencias para este usuario' })
        return res.send({ message: 'Experiencias encontradas', experiences })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener las experiencias', error })
    }
}

export const getAllExperiences = async (req, res) => {
    try {
        const allExperiences = await Experience.find().populate('user', 'name')

        if (!allExperiences.length) return res.status(404).send({ message: 'No se encontraron las experiencias' })
        return res.send({ message: 'Experiencias encontradas', allExperiences })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener las experiencias', error })
    }
}

//------>Nuevas funciones
export const addExperienceTwo = async(req, res) =>{
    try {
        let idUser = req.user._id
        let data = req.body
        data.user = idUser
        let experience = new Experience(data)
        await experience.save()
        return res.send({message: 'Experiencia agregada'})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Error el agregar experiencia'})
    }
}

export const deleteExperienceTwo = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedExperience = await Experience.findByIdAndDelete(id);
        if (!deletedExperience) return res.status(404).send({ message: 'Experiencia no encontrada' })
        return res.send({ message: 'Experiencia eliminada', deletedExperience });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al eliminar la experiencia' });
    }
}

export const getExperiencesById = async (req, res) => {
    try {
        let { id } = req.params
        const experiences = await Experience.find({ user: id })
        //if (!experiences.length)  return res.status(404).send({ message: 'No se encontraron experiencias para este usuario' });
        return res.send({ message: 'experiencias encontradas', experiences })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error al obtener las experiencias' })
    }
}

export const updateExperienceTwo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, startDate, endDate, institution, description, resume } = req.body;

        // Verificar que la experiencia exista
        let experience = await Experience.findOne({ _id: id });
        if (!experience) return res.status(404).send({ message: 'Experiencia no encontrada' });

        // Validar las fechas
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (startDate && new Date(startDate) >= today) {
            return res.status(400).send({ message: 'Fecha de inicio debe ser anterior a la fecha actual.' });
        }

        if (endDate && (new Date(endDate) > new Date() || new Date(endDate) <= new Date(startDate || experience.startDate))) {
            return res.status(400).send({ message: 'Fecha de finalización debe ser posterior a la fecha de inicio y no puede ser mayor a la fecha actual.' });
        }

        // Actualizar la experiencia
        let updatedExperience = await Experience.findOneAndUpdate(
            { _id: id },
            {
                title,
                startDate,
                endDate,
                institution,
                description,
                resume
            },
            { new: true }
        );

        if (!updatedExperience) return res.status(500).send({ message: 'Error al actualizar la experiencia' });

        return res.send({ message: 'Experiencia actualizada', updatedExperience });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error al actualizar la experiencia' });
    }
};
