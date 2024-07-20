import { useState } from "react"
import toast from 'react-hot-toast'
import { getPinkBallotsRequest } from "../../../services/api";

export const useGetPinkBallot = () => {
    const [pinkBallot, setPinkBallot] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getPinkBallotsApi = async () => {
        setIsLoading(true);
        const response = await getPinkBallotsRequest();
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
        setPinkBallot(response.data.combinedStatistics);
    }
    return {
        isLoading,
        pinkBallot,
        getPinkBallotsApi
    }
}
