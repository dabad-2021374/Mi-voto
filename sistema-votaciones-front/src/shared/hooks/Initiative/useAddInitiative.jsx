import { useState } from "react"
import toast from "react-hot-toast"
import { addInitiativeRequest } from "../../../services/api"

export const useAddInitiative = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addInitiative = async (data, callback) => {
        setIsLoading(true)
        const toastId = toast.loading('Registrando iniciativa...')
        const response = await addInitiativeRequest(data)
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
                    'Error al registrar iniciativa.',
                    { duration: 6000 }
                )
            }
        } else {
            toast.success('¡Iniciativa guardada correctamente!', { duration: 5000 })
            if (callback) callback()
        }
    }

    return {
        addInitiative,
        isLoading
    }
}
