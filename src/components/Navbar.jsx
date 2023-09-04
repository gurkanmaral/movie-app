import React, { useContext, useState } from 'react'
import sauron from "../assets/sauron.png"
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/authContext'
import userLogo from "../assets/user.png"
import NavbarBox from './NavbarBox'
import SearchIcon from '@mui/icons-material/Search';
const Navbar = () => {

    const {currentUser,logout} = useContext(AuthContext)
    const [searchValue,setSearchValue] = useState("")
    const [open,setOpen] = useState(false)
    console.log(currentUser)

    const navigate = useNavigate()


 
const handleClick = (e)=>{
    e.preventDefault()

    if(searchValue){
      navigate(`/search/${searchValue}`)
      setSearchValue("")


      
    }
  }
const handleBox = ()=>{
    setOpen((prev)=> !prev)
}

  return (
    <div className='navbar'>
        <div className='navbar-left'>
            <div className='navbar-icon-container'>
                <Link to="/" style={{textDecoration:"none",color:"inherit"}}>
                    <img src={sauron} alt="" className='navbar-icon' />
                </Link>
             
                <Link to="/" style={{textDecoration:"none",color:"inherit"}} className='zoom-back'>
                 <span>ZOOMBACKCAMERA</span>
                </Link>
                
                <div className='navbar-input-container'>
                
                    <form className='input-form'>
                        <input type="text"
                        placeholder='Search movies and tv series...'
                        onChange={(e)=>setSearchValue(e.target.value)}
                        value={searchValue}
                        />
                        <button onClick={handleClick}>
                            <SearchIcon style={{ height: "25px", width: '25px', cursor: 'pointer' }}  />
                        </button> 
                    </form>                  
                </div>             
            </div>
        </div>
        <div className='navbar-right'>
            <Link to="/movies" className='link'>
                <span>Films</span> 
            </Link>
            <Link to="/series" className='link'>
                <span>Series</span> 
            </Link>
            <div>
                {currentUser === null 
                ?
                <Link to="/login" className='link'>
                        <span>
                          Login
                        </span> 
                </Link>     
                :   
                    <div className='navbar-link' onClick={handleBox} style={{cursor:"pointer"}}>
                        <img src={currentUser.profilePic ? "/upload/" + currentUser.profilePic : userLogo} alt="" className='navbar-user-logo' />
                        <span>{currentUser?.name}</span> 
                    </div>
                        
                    
    }
                </div>   
                {open && <NavbarBox />}
        </div>
    </div>
  )
}

export default Navbar