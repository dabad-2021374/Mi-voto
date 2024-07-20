import toast from 'react-hot-toast'
import { deleteExperienceRequest } from '../../../services/api'

export const useDeleteExperience = () => {
    const deleteExperience = async (id) => {
        const response = await deleteExperienceRequest(id)
        if (response.error) {
            return toast.error('Error eliminanando experiencia.')
        }
        return toast.success('Experiencia eliminada correctamente.')
    }
    return {
        deleteExperience
    }
}