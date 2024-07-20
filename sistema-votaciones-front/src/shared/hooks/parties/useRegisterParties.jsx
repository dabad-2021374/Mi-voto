import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { registerPartyRequest } from '../../../services/api';

export const useRegisterParties = () => {
  const [isRegistering, setIsRegistering] = useState(false)

  const registerParty = async (partyData) => {
    setIsRegistering(true);
    try {
        const response = await registerPartyRequest(partyData)
        if (response.error) {
          throw new Error(response.error)
        }
        toast.success('Partido registrado exitosamente')
    } catch (error) {
        toast.error('Error al registrar el partido')
    } finally {
        setIsRegistering(false)
    }
  }

  return {
    registerParty,
    isRegistering,
  }
}
