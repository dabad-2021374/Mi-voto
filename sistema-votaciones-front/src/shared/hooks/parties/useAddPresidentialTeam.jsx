import { useState } from "react"
import toast from "react-hot-toast"
import { addPresidentialTeam } from "../../../services/api"

export const useAddPresidentialTeam = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addMember = async (partyId, data) => {
        setIsLoading(true)
        const response = await addPresidentialTeam(partyId, data)
        setIsLoading(false)

        if (response.error) {
            toast.error(
                response.err?.response?.data?.message || 'Error al agregar miembro al equipo presidencial'
            );
        } else {
            toast.success('Miembro agregado correctamente al equipo presidencial')
        }
    };

    return {
        addMember,
        isLoading
    }
}
