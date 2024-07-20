import { useState } from "react"
import toast from 'react-hot-toast'
import { getWhiteBallotsRequest } from "../../../services/api";

export const useGetWhiteBallot = () => {
    const [whiteBallot, setWhiteBallot] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const getWhiteBallotsApi = async () => {
        setIsLoading(true);
        const response = await getWhiteBallotsRequest();
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
        setWhiteBallot(response.data.combinedStatistics);
    }
    return {
        isLoading,
        whiteBallot,
        getWhiteBallotsApi
    }
}
