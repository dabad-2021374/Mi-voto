import toast from "react-hot-toast"
import { useState } from "react"
import { getProfessionsRequest } from "../../../services/api"

export const useGetProfession = () => {
    const [ professions, setProfessions ] = useState(null)

    const getProfessions = async() => {
        const response = await getProfessionsRequest()
        if(response.error){
          return toast.error(
            response?.err?.response?.data?.messagge || 
            'Error al obtener las profesiones'
          )
        }
        setProfessions(response)
      }
    return {
        professions, 
        isFetching: !professions,
        getProfessions
    }
}

