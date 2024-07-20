import toast from "react-hot-toast"
import { useState } from "react"
import { getDeparmentsRequest } from "../../../services/api"



export const useGetDepartments = () => {
    const [ departments, setDepartmens ] = useState(null)

    const getDepartments = async() => {
        const response = await getDeparmentsRequest()
        if(response.error){
          return toast.error(
            response?.err?.response?.data?.messagge || 
            'Error al obtener los departamentos'
          )
        }
        setDepartmens(response)
      }
    return {
        departments, 
        isFetching: !departments,
        getDepartments
    }
}

