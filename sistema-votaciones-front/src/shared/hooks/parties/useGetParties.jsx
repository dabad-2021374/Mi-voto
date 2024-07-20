import toast from "react-hot-toast"
import { useState } from "react"
import { getPartiesRequest } from "../../../services/api"

export const useGetParties = () => {
    const [ parties, setParties ] = useState(null)

    const getParties = async() => {
        const response = await getPartiesRequest()
        if(response.error){
          return toast.error(
            response?.err?.response?.data?.messagge || 
            'Error al obtener los partidos'
          )
        }
        setParties(response.parties)
      }
    return {
        parties, 
        isFetching: !parties,
        getParties
    }
}

