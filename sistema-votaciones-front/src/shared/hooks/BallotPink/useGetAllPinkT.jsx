import { useState } from "react"
import toast from "react-hot-toast"
import { getAllPinkTeam } from "../../../services/api"

export const useGetAllPinkT = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [pinkTeams, setPinkTeams] = useState([])

  const getPinkTeams = async () => {
    setIsLoading(true)
    try {
      const response = await getAllPinkTeam()
      setIsLoading(false)
      if (response.error) {
        toast.error(
          response?.err?.response?.data?.msg ||
          response?.err?.data?.msg ||
          "Error getting Pink team. Try again."
        )
      } else {
        setPinkTeams(response)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Error getting Pink Team. Try again.")
    }
  }

  return {
    getPinkTeams,
    isLoading,
    pinkTeams,
  }
}