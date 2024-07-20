import { useState } from "react"
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom"
import { loginRequest } from "../../services/api"

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const login = async (code, username, password) => {
    setIsLoading(true)
    //obtener la ubicacion del usuario
    let location = null;
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        },
        (error) => {
          toast.error('UBICACIÓN REQUERIDA')
        }
      )
    }
    const userN = {
      code,
      username,
      password,
      location
    }
    const response = await loginRequest(userN)
    setIsLoading(false)

    if (response.error) {
      return toast.error(
        response?.err?.response?.data ||
        'Credenciales inválidas, intente nuevamente.'
      )
    }
    const { loggedUser, message, token } = response.data
    console.log(response.data)
    localStorage.setItem('user', JSON.stringify(loggedUser))
    localStorage.setItem('token', token)

    if (token) {
      navigate('/homepage')
      return toast.success('Bienvenido')
    }
  }

  return {
    login,
    isLoading,
  }
}
