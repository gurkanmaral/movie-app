import axios from "axios";

export const makeRequest = axios.create({
    baseURL:"https://movie-app-sk33.onrender.com/",
    withCredentials:true,
})