import { useState } from "react"
import toast from "react-hot-toast"
import { getInitiativesByUser } from "../../../services/api"

export const useGetInitiativeCandidate = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [initiatives, setInitiatives] = useState([])

  const getInitiativesCandidate = async (id) => {
    setIsLoading(true)
    try {
      const response = await getInitiativesByUser(id)
      setIsLoading(false)
      console.log(response)
      if (response.error) {
        toast.error(
          response?.err?.response?.data?.msg ||
          response?.err?.data?.msg ||
          "Error getting initiatives. Try again."
        )
      } else {
        setInitiatives(response.initiatives)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Error getting initiatives. Try again.")
    }
  }

  return {
    getInitiativesCandidate,
    isLoading,
    initiatives,
  }
}
