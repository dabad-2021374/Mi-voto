import { useState } from "react"
import toast from "react-hot-toast"
import { getAllWhiteTeam } from "../../../services/api"

export const useGetAllWhiteT = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [whiteTeams, setWhiteTeams] = useState([])

  const getWhiteTeams = async () => {
    setIsLoading(true)
    try {
      const response = await getAllWhiteTeam()
      setIsLoading(false)
      if (response.error) {
        toast.error(
          response?.err?.response?.data?.msg ||
          response?.err?.data?.msg ||
          "Error obteniendo equipo presidencial, intente nuevamente"
        )
      } 
      setWhiteTeams(response.whiteTeams)
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Error al traer partidos")
    }
  }

  return {
    getWhiteTeams,
    isLoading,
    whiteTeams,
  }
}
