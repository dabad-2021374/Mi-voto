import { useState } from "react"
import toast from "react-hot-toast"
import { getAllYellowTeam } from "../../../services/api"

export const useGetAllYellowT = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [yellowTeams, setYellowTeams] = useState([])

  const getYellowTeams = async () => {
    setIsLoading(true)
    try {
      const response = await getAllYellowTeam()
      setIsLoading(false)
      if (response.error) {
        toast.error(
          response?.err?.response?.data?.msg ||
          response?.err?.data?.msg ||
          "Error getting yellow team. Try again."
        )
      } else {
        setYellowTeams(response)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Error getting yellow Team. Try again.")
    }
  }

  return {
    getYellowTeams,
    isLoading,
    yellowTeams,
  }
}
