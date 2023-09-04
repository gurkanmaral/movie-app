import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const NavbarBox = () => {

    const {currentUser,logout} = useContext(AuthContext)
    const navigate = useNavigate()

    const handleClick = ()=>{
        logout()

        navigate("/login")
    }

  return (
    <div className='navbar-box'>
       <Link to={`/profile/${currentUser?.id}`} className='navbar-box-link' style={{cursor:'pointer'}}  >
        My Profile
       </Link>
        <span onClick={handleClick}  style={{cursor:'pointer'}}>
            Logout

        </span>
    </div>
  )
}

export default NavbarBox