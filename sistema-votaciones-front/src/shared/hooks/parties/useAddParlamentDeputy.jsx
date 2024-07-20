import { useState } from "react"
import toast from "react-hot-toast"
import { addParlamentDeputy } from "../../../services/api"

export const useAddParlamentDeputy = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addMember = async (partyId, data) => {
        setIsLoading(true)
        const response = await addParlamentDeputy(partyId, data)
        setIsLoading(false)

        if (response.error) {
            toast.error(
                response.err?.response?.data?.message || 'Error al agregar diputado'
            )
        } else {
            toast.success('Diputado agregado exitosamente')
        }
    }

    return {
        addMember,
        isLoading
    }
}
