import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/authContext'

const Login = () => {

  const {login} = useContext(AuthContext)
  
  const [inputs,setInputs] = useState({
    username: "",
    password: "",
})
const [err,setErr] = useState(null)

const navigate = useNavigate()


  const handleChange = (e)=>{
    setInputs((prev)=>({...prev,[e.target.name]: e.target.value}))
}

const handleLogin = async(e)=>{
  e.preventDefault();
  try {
      await login(inputs);
      navigate("/")
  } catch (err) {
      setErr(err.response.data);
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
                <input type="password"
                placeholder='Password'
                name='password'
                onChange={handleChange}     
                className='login-input'        
                />
                {err && err}
                <button onClick={handleLogin}
                className='login-button'>
                    Login
                </button>
              </form>
          </div>
      </div>
    </div>
  )
}

export default Login