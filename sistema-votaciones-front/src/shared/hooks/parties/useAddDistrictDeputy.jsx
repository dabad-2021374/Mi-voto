import { useState } from "react"
import toast from "react-hot-toast"
import { addDistrictDeputy } from "../../../services/api"

export const useAddDistrictDeputy = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addMember = async (partyId, data) => {
        setIsLoading(true)
        const response = await addDistrictDeputy(partyId, data)
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
