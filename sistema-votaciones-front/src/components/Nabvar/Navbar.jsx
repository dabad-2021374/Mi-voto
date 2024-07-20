import  { useState, useEffect, useRef } from 'react'
import './Navbar.css'
import imgDefault from '../../assets/images/defaultImage.png'
import homeIMG from '../../assets/images/homeIMG.png'
import { useUserDetails } from '../../shared/hooks/useUserDetails'
import { useLogout } from '../../shared/hooks/useLogout'
import { useNavigate } from "react-router-dom"

const Navbar = ({ pageTitle }) => {
  const { user, isLogged, isLoading } = useUserDetails()
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const logout = useLogout()

  const handleNavigateToLogin = () => {
    navigate('/authpage')
  }

  const handleNavigateHome = () => {
    navigate('/')
  }

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible)
  }

  const handleEditProfile = () => {
    navigate('/myProfile')

  }

  const handleLogout = () => {
    logout();
    setDropdownVisible(false)
    navigate('/')
  }

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownVisible(false)
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='navbar'>
      <img src={homeIMG} alt="Home" className="home-icon" onClick={handleNavigateHome} />
      <div className='title'>
        <h1>{pageTitle}</h1>
      </div>
      <div className='user-details' onClick={toggleDropdown} ref={dropdownRef}>
        <span>
          <h6>{user.name || 'Invitado'}</h6>
          <h6 className='surname'>{user.surname || ''}</h6>
        </span>
        <img src={user.photo|| imgDefault} />
    
        {dropdownVisible && (
          <div className='dropdown-menu'>
            {isLogged ? (
              <>
                <a onClick={handleEditProfile}>Editar Perfil</a>
                <a onClick={handleLogout}>Logout</a>
              </>
            ) : (
              <a onClick={handleNavigateToLogin}>Login</a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
export default Navbar
