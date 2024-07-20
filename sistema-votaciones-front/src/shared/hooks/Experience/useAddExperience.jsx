import { useState } from "react"
import toast from "react-hot-toast"
import { addExperienceRequest } from "../../../services/api"

export const useAddExperience = () => {
    const [isLoading, setIsLoading] = useState(false)

    const addExperience = async (data, callback) => {
        setIsLoading(true)
        const toastId = toast.loading('Registrando experiencia...')
        const response = await addExperienceRequest(data)
        setIsLoading(false)
        toast.dismiss(toastId)

        if (response.error) {
            if (response?.err?.response?.data?.errors) {
                let arr = response?.err?.response?.data?.errors
                arr.forEach(error => {
                    toast.error(error.msg, { duration: 10000 })
                })
            } else {
                toast.error(
                    response?.err?.response?.data?.msg ||
                    response?.err?.data?.msg ||
                    'La fecha de finalización no puede ser futura.',
                    { duration: 6000 }
                )
            }
        } else {
            toast.success('Experiencia guardada correctamente!', { duration: 5000 })
            if (callback) callback()
        }
    }

    return {
        addExperience,
        isLoading
    }
}
