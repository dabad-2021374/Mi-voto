import { useState } from "react"
import toast from "react-hot-toast"
import { getInitiatives } from "../../../services/api"

export const useGetInitiatives = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [initiatives, setInitiatives] = useState([])

  const getInitiativesUser = async () => {
    setIsLoading(true)
    try {
      const response = await getInitiatives()
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
    getInitiativesUser,
    isLoading,
    initiatives,
  }
}
