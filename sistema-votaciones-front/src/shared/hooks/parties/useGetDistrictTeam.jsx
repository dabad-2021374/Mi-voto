import toast from "react-hot-toast"
import { useState } from "react"
import { getDistrictTeam} from "../../../services/api"

export const useGetDistrictTeam = () => {
    const [districts, setDistricts] = useState([])

    const getDistrict= async() => {
        const response = await getDistrictTeam()
        console.log("Respuesta del servidor:", response); // Muestra la respuesta completa

        if(response.error){
          return toast.error(
            response?.err?.response?.data?.message || 
            'Error al obtener los Distritos'
          )
        }
        console.log("Distritos recibidos:", response.message); // Mostrar los distritos correctamente
        
        setDistricts(response.message);
    }

    return {
        districts, 
        isFetching: !districts,  
        getDistrict
    }
}
