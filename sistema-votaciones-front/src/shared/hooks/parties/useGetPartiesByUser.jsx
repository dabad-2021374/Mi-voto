import toast from "react-hot-toast"
import { useState } from "react"
import { getPartiesByLoggedUser } from "../../../services/api"

export const useGetPartiesByUser = () => {
    const [parties, setParties] = useState(null)
    const [isFetching, setIsFetching] = useState(false)

    const getPartiesByUser = async() => {
        setIsFetching(true)
        const response = await getPartiesByLoggedUser()
        if (response.error) {
            toast.error(
                response.error?.response?.data?.message || 
                'Error al obtener los partidos del usuario'
            )
        } else {
            setParties(response.parties)
        }
        setIsFetching(false)
    }

    return {
        parties,
        isFetching,
        getPartiesByUser
    }
}
