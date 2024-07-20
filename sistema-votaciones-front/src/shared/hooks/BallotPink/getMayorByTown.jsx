import { useState } from "react"
import toast from "react-hot-toast"
import { getMayorByTown } from "../../../services/api"

export const useGetMayorByTown = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [pinkTeamsByTown, setpinkTeamsByTown] = useState([])

    const getPinkTeamsByTown = async () => {
        setIsLoading(true)
        try {
          const response = await getMayorByTown()
          console.log(response, 'hook:')
          setIsLoading(false)
          if (response.error) {
            toast.error(
              response?.err?.response?.data?.msg ||
              response?.err?.data?.msg ||
              "Error getting Pink team. Try again."
            )
          } else {
            setpinkTeamsByTown(response.data.populatedParties)
          }
        } catch (error) {
          console.error(error)
          setIsLoading(false)
          toast.error("Error getting Pink Team. Try again.")
        }
      }
    
    return {
        getPinkTeamsByTown,
        isLoading,
        pinkTeamsByTown,
    }
}

