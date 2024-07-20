import { useState } from "react"
import toast from 'react-hot-toast'
import { getBlueBallotsRequest } from "../../../services/api";

export const useGetBlueBallot = () => {
    const [blueBallot, setBlueBallot] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getBlueBallotsApi = async () => {
        setIsLoading(true);
        const response = await getBlueBallotsRequest();
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
        setBlueBallot(response.data.combinedStatistics);
    }
    return {
        isLoading,
        blueBallot,
        getBlueBallotsApi
    }
}
