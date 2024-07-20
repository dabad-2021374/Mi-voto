import { useState, useEffect } from "react"
import { getProfileRequest } from "../../services/api"

const getUserDetailsFromLocalStorage = () => {
  const loggedUser = localStorage.getItem('user')
  try {
    return loggedUser ? JSON.parse(loggedUser) : null
  } catch (error) {
    console.error("Error parsing JSON from localStorage", error)
    return null
  }
}

export const useUserDetails = () => {
  const [user, setUser] = useState(getUserDetailsFromLocalStorage())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await getProfileRequest()
        if (!response.error) {
          setUser(response)
          localStorage.setItem('user', JSON.stringify(response))
        } else {
          console.error(response.err)
        }
      } catch (error) {
        console.error("Error fetching user details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (!user) {
      fetchUserDetails()
    } else {
      setIsLoading(false)
    }
  }, [user])

  const logoutSys = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    setUser(null)
  }

  return {
    isLogged: Boolean(user),
    user: user || { name: 'Invitado', surname: '', role: 'GUEST' },
    isLoading,
    logoutSys,
  }
}
