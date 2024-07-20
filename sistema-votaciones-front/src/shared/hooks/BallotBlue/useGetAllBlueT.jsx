import { useState } from "react"
import toast from "react-hot-toast"
import { getAllBlueTeam } from "../../../services/api"

export const useGetAllBlueT = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [blueTeams, setBlueTeams] = useState([])

  const getBlueTeams = async () => {
    setIsLoading(true)
    try {
      const response = await getAllBlueTeam()
      setIsLoading(false)
      if (response.error) {
        toast.error(
          response?.err?.response?.data?.msg ||
          response?.err?.data?.msg ||
          "Error getting blue team. Try again."
        )
      } else {
        setBlueTeams(response)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Error getting blue Team. Try again.")
    }
  }

  return {
    getBlueTeams,
    isLoading,
    blueTeams,
  }
}
