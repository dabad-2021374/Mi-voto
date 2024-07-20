import { useState } from "react"
import toast from "react-hot-toast"
import { addCitizenVoteRequest } from "../../../services/api"

export const useAddCitizenVote = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addCitizenVote = async () => {
        setIsLoading(true)
        const toastId = toast.loading('Registrando tu votación...')
        const response = await addCitizenVoteRequest()
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
                    '¡Error, tu proceso de votacion ha terminado!',
                    { duration: 6000 }
                )
            }
        } else {
            toast.success('¡Tu votación ha sido registrado correctamente!', { duration: 5000 })
        }
    }

    return {
        addCitizenVote,
        isLoading
    }
}

