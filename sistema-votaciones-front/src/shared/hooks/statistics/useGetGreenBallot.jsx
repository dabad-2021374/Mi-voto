import { useState } from "react"
import toast from 'react-hot-toast'
import { getGreenBallotsRequest } from "../../../services/api";

export const useGetGreenBallot = () => {
    const [ greenBallot, setGreenBallot ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getGreenBallotsApi = async () => {
        setIsLoading(true);
        const response = await getGreenBallotsRequest();
        setIsLoading(false);

        if (response.error) {
            return toast.error(
                response?.err?.data?.message ||
                response?.err?.response?.data?.message ||
                response?.err?.message ||
                'Error al obtener diputados por lista nacional.'
            )
        }
        console.log(response.data.combinedStatistics);
        setGreenBallot(response.data.combinedStatistics)
    }
    return {
        isLoading,
        greenBallot,
        getGreenBallotsApi
    }
}
