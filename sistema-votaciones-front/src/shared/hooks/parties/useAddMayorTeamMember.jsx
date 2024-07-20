import { useState } from "react"
import toast from "react-hot-toast"
import { addMayorTeamMember } from "../../../services/api"

export const useAddMayorTeamMember = () => {
    const [isLoading, setIsLoading] = useState(false);

    const addMember = async (data) => {
        setIsLoading(true);
        if (!data.DPI || !data.role || !data.departmentId || !data.town) {
            toast.error('Datos incompletos. Por favor, revisa los campos.');
            setIsLoading(false);
            return;
        }
        console.log('DATA MAYOR TEAM', data);
        const response = await addMayorTeamMember(data);
        setIsLoading(false);

        if (response.error) {
            toast.error(response.err?.response?.data?.message || 'Error al agregar Alcalde');
        } else {
            toast.success('Alcalde agregado exitosamente');
        }
    };

    return {
        addMember,
        isLoading
    };
};
