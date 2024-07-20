import { useState } from "react"
import toast from "react-hot-toast"
import { getExperiencesByIdRequest } from "../../../services/api"

export const useGetExperiencesById = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [experiences, setExperiences] = useState([])

  const getExperiencesByID = async (id) => {
    setIsLoading(true)
    try {
      const response = await getExperiencesByIdRequest(id)
      setIsLoading(false)
      console.log(response)
      if (response.error) {
        toast.error(
          response?.err?.response?.data?.msg ||
          response?.err?.data?.msg ||
          "Error getting experiences. Try again."
        )
      } else {
        setExperiences(response.experiences)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
      toast.error("Error getting experiences. Try again.")
    }
  }

  return {
    getExperiencesByID,
    isLoading,
    experiences,
  }
}
