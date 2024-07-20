import { useState } from "react"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { updateUserRequest } from "../../services/api"

export const useUpdate = () => {
    const [isLoading, setIsLoading] = useState(false)
    const update = async (user) => {
        setIsLoading(true)
        let data = new FormData();
        data.append('email', user.email);
        data.append('phone', user.phone);
        data.append('profession', user.profession);
        data.append('userImagePath', user.photo);
        const response = await updateUserRequest(data)
        console.log(user)
        setIsLoading(false)

        if (response.error) {
            return toast.error(
                response?.e?.response?.data ||
                'Error actualizando sus datos'
            )
        }
        return toast.success('Perfil actualizado correctamente')
    }
    return {
        update,
        isLoading
    }
}