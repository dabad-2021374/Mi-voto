import { useState } from "react"
import toast from "react-hot-toast"
import { updateExperienceRequest } from "../../../services/api"

export const useUpdateExperience = () => {
    const [isLoading, setIsLoading] = useState(false)

    const updateExperience = async (id, data, callback) => {
        setIsLoading(true)
        const toastId = toast.loading('Actualizando experiencia...')
        const response = await updateExperienceRequest(id, data)
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
                    'Error al actualizar experiencia.',
                    { duration: 6000 }
                )
            }
        } else {
            toast.success('¡Experiencia actualizada correctamente!', { duration: 5000 }) // Duration of 5 seconds
            if (callback) callback()
        }
    }

    return {
        updateExperience,
        isLoading
    }
}
