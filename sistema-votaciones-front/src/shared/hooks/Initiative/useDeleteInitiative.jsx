import toast from 'react-hot-toast'
import { deleteInitiativeRequest } from '../../../services/api'

export const useDeleteInitiative = () => {
    const deleteInitiative = async (id) => {
        const response = await deleteInitiativeRequest(id)
        if (response.error) {
            return toast.error('Error eliminanando iniciativa.')
        }
        return toast.success('Iniciativa eliminada correctamente.')
    }
    return {
        deleteInitiative
    }
}

