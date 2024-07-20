import { useState } from "react"
import toast from "react-hot-toast"
import { addWhiteBallotRequest } from "../../../services/api"
export const useAddWhiteB = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addBallotWhite = async (idTeam) => {
        setIsLoading(true)
        const toastId = toast.loading('Registrando su voto...')
        const response = await addWhiteBallotRequest(idTeam)
        setIsLoading(false)
        toast.dismiss(toastId)

        if (response.error) {
            if (response?.err?.response?.data?.errors) {
                let arr = response?.err?.response?.data?.errors
                arr.forEach(error => {
                    toast.error(error.msg, { duration: 6000 })
                })
            } else {
                toast.error(
                    response?.err?.response?.data?.msg ||
                    response?.err?.data?.msg ||
                    'Usted ya ha votado en papeleta blanca.',
                    { duration: 6000 }
                )
            }
        } else {
            toast.success('¡Su voto en papeleta blanca ha sido registrado correctamente!', { duration: 5000 }) // Duration of 5 seconds
        }
    }

    return {
        addBallotWhite,
        isLoading
    }
}
