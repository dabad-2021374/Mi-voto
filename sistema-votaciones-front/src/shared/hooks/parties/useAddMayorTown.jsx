import { useState } from "react"
import toast from "react-hot-toast"
import { addMayorTeamMember } from "../../../services/api"

export const useAddNationalListDeputy = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addMember = async (data) => {
        setIsLoading(true)
        const response = await addMayorTeamMember(data);
        setIsLoading(false)

        if (response.error) {
            toast.error(
                response.err?.response?.data?.message || 'Error al agregar alcalde'
            )
        } else {
            toast.success('Alcalde agregado exitosamente')
        }
    }

    return {
        addMember,
        isLoading
    }
}