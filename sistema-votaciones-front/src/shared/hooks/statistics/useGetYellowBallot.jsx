import { useState } from "react"
import toast from 'react-hot-toast'
import { getYellowBallotsRequest } from "../../../services/api";

export const useGetYellowBallot = () => {
    const [yellowBallot, setYellowBallot] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getYellowBallotsApi = async () => {
        setIsLoading(true);
        const response = await getYellowBallotsRequest();
        setIsLoading(false);

        if (response.error) {
            return toast.error(
                response?.err?.data?.message ||
                response?.err?.response?.data?.message ||
                response?.err?.message ||
                'Error al obtener presidenciables.'
            )
        }

        console.log(response.data.combinedStatistics);
        setYellowBallot(response.data.combinedStatistics);
    }
    return {
        isLoading,
        yellowBallot,
        getYellowBallotsApi
    }
}
