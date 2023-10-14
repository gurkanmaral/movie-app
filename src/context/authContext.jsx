import axios from "axios";
import { createContext, useEffect, useState } from "react";


export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    
    const [currentUser, setCurrentUser] = useState(null);
   
    useEffect(() => {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }

    }, []);


    const login = async(inputs)=>{
        try{
          const res = await axios.post("https://movie-app-sk33.onrender.com/api/auth/login",inputs,{
            withCredentials:true,
          })
          setCurrentUser(res.data)
        }catch(error){
          console.error("error while logging in", error)
        }
    }
    const logout = async () =>{
      try {
        const res = await axios.post("https://movie-app-sk33.onrender.com/api/auth/logout")
        setCurrentUser(null);
        localStorage.setItem("currentUser", null);
      } catch (error) {
        console.error('Logout failed:', error);
      }
  }


    useEffect(() => {
        if (currentUser) {
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
        }
      }, [currentUser]);
    
    
    return (
      <AuthContext.Provider value={{ currentUser, login,logout }}>
        {children}
      </AuthContext.Provider>
    );
  };