import toast from "react-hot-toast"
import { useState } from "react"
import { getProfileRequest } from "../../services/api"

export const useGetProfile = () => {
    const [ users, setUsers ] = useState(null)

    const getUsers = async() => {
        const response = await getProfileRequest()
        if(response.error){
          return toast.error(
            response?.err?.response?.data?.messagge || 
            'Error al obtener el perfil del usuario'
          )
        }
        setUsers(response.message)
      }
    return {
        users, 
        isFetching: !users,
        getUsers
    }
}

