import toast from "react-hot-toast"
import { useState } from "react"
import { getTownsByDepartmentRequest } from "../../../services/api"

export const useGetTowns = () => {
    const [towns, setTowns] = useState(null)

    const getTowns = async (id) => {
        const response = await getTownsByDepartmentRequest(id)
        if (response.error) {
            return toast.error(
                response?.err?.response?.data?.messagge ||
                'Error al obtener los municipios'
            )
        }
        setTowns(response)
    }
    return {
        towns,
        isFetching: !towns,
        getTowns
    }
}

