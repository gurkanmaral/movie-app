import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {

  
  const [inputs,setInputs] = useState({
    username:"",
    email:"",
    password:"",
    name:"",
  })
const [err,setErr] = useState(null)

const navigate = useNavigate()


  const handleChange = (e)=>{
    setInputs((prev)=>({...prev,[e.target.name]: e.target.value}))
}

const handleClick = async(e)=>{
    e.preventDefault();

    try {
        await axios.post("http://localhost:8800/api/auth/register",inputs)
        navigate("/login")
    } catch (error) { 
      setErr(error.response.data)
    }
  }
  return (
    <div className='login-container'>
      <div className='login'>
          <div className='login-1'>
            <h1>LOGIN</h1>
            <Link to="/register" className='link'>
             <p>Don't you have an account? <span className='register-span'>Register</span></p>
            </Link>           
          </div>
          <div className='login-2'>
              <form>
                <input type="text"
                placeholder='Username'
                name='username'
                onChange={handleChange}
                className='login-input'
                />
                 <input type="email" 
                placeholder="Email" 
                name="email" 
                onChange={handleChange} 
                className='login-input'
                />
                <input type="password"
                placeholder='Password'
                name='password'
                onChange={handleChange}     
                className='login-input'        
                />
                <input type="text" 
                placeholder="Name" 
                name="name" 
                onChange={handleChange}
                className='login-input' />
                
                {err && err}
                <button onClick={handleClick}
                className='login-button'>
                    Register
                </button>
              </form>
          </div>
      </div>
    </div>
  )
}

export default Login