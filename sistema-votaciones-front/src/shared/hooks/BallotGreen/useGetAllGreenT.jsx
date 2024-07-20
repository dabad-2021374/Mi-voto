import { useState } from "react"
import toast from "react-hot-toast"
import { getAllGreenTeam } from "../../../services/api"

export const useGetAllGreenT = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [greenTeams, setGreenTeams] = useState([])

  const getGreenTeams = async () => {
    setIsLoading(true)
    try {
      const response = await getAllGreenTeam()
      setIsLoading(false)
      if (response.error) {
        toast.error(
          response?.err?.response?.data?.msg ||
          response?.err?.data?.msg ||
          "Error getting green team. Try again."
        )
      } else {
        setGreenTeams(response)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Error getting green Team. Try again.")
    }
  }

  return {
    getGreenTeams,
    isLoading,
    greenTeams,
  }
}
