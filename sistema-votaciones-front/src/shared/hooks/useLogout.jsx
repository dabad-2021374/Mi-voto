import { useNavigate } from "react-router-dom"
import { useUserDetails } from '../../shared/hooks/useUserDetails'

export const useLogout = () => {
  const navigate = useNavigate()
  const { logoutSys } = useUserDetails()

  const logout = () => {
    console.log('Estoy cerrando la sesión')
    logoutSys()
    navigate('/homepage')
  }

  return logout
}