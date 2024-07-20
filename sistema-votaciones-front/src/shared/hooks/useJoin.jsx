import { useState } from "react"
import toast from 'react-hot-toast'
import { joinRequest } from "../../services/api.js"
import { useNavigate } from "react-router-dom"

export const useJoin = () => {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const join = async (user) => {
        setIsLoading(true)

        const response = await joinRequest(user)
        console.log(user)
        setIsLoading(false)

        if (response.error) {
            return toast.error(
                response?.e?.response?.data ||
                'Error al empadronarse, corrija los datos'
            )
        }

        navigate('/homepage')
        return toast.success('Solicitud enviada')
    }

    return {
        join,
        isLoading
    }
}