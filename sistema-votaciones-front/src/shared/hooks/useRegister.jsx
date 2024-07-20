import { useState } from "react"
import toast from 'react-hot-toast'
import { registerRequest } from "../../services/api.js"
import { useNavigate } from "react-router-dom"

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const register = async (user) => {
    setIsLoading(true)

    try {
      const response = await registerRequest(user)
      setIsLoading(false)
      console.log(response)

      if (response.error) {
        if (response.err.response.data.err && response.err.response.data.err.code == 11000) {
          return toast.error(
            `Ya existe`, response.err.response.data.err.keyValue
          );
        }
        return toast.error(
          response?.err?.response?.data ||
          'Error al registrarse, corrija los datos'
        );
      }

      const { user: registeredUser, token } = response.data;

      localStorage.setItem('user', JSON.stringify(registeredUser))
      localStorage.setItem('token', token)

      toast.success('Bienvenido')
      navigate('/homepage')
    } catch (error) {
      setIsLoading(false)
      toast.error('Error al registrar o autenticar usuario')
    }
  }

  return {
    register,
    isLoading
  }
}
