import toast from "react-hot-toast"
import { useState } from "react"
import { getAdminsPartie } from "../../../services/api"

export const useGetAdminParties = () => {
    const [users, setUsers] = useState([])

    const getUsers = async() => {
        const response = await getAdminsPartie()
        if(response.error){
          return toast.error(
            response?.err?.response?.data?.message || 
            'Error al obtener los Admin Partie'
          )
        }
        setUsers(response.users)
    }

    return {
        users, 
        isFetchin: users.length === 0,
        getUsers
    }
}
