
import './App.css'
import Home from './pages/Home'
import { createBrowserRouter,RouterProvider,Route,Outlet, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import MovieDetails from "./pages/MovieDetails"
import Profile from './pages/Profile';
import SeriesDetails from "./pages/SeriesDetails"
import Search from './pages/Search';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Movies from "./pages/Movies"
import Series from "./pages/Series"
import { useEffect, useState } from 'react';
import {fetchData} from "./utils/fetchData"
import Register from "./pages/Register"
import { QueryClient,QueryClientProvider,useQuery } from '@tanstack/react-query';
import ProfileMovies from './pages/ProfileMovies';
import ProfileSeries from "./pages/ProfileSeries";
import ProfileLikes from "./pages/ProfileLikes";
import ProfileWatchlist from "./pages/ProfileWatchlist";
function App() {

  const queryClient = new QueryClient()
  

  


  const Layout = ()=>{
    return(
      <QueryClientProvider   client={queryClient}>
      <div>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
    </QueryClientProvider>
    ) 
  }

  const router = createBrowserRouter([
    {
      path:"/",
      element:<Layout />,
      children:[
        {
          path:"/",
          element:<Home  />,
        },
        {
          path:"/movie-details/:id",
          element:<MovieDetails />
        },
        {
          path:"/series-details/:id",
          element:<SeriesDetails />
        },
        {
          path:"/search/:searchTerm",
          element:<Search />
        },
        {
          path:"/profile/:id",
          element:<Profile />  
        },
        {
          path:"/profile/:id/films",
          element:<ProfileMovies />

        },
        {
          path:"/profile/:id/series",
          element:<ProfileSeries />

        },
        {
          path:"/profile/:id/likes",
          element:<ProfileLikes />

        },
        {
          path:"/profile/:id/watchlist",
          element:<ProfileWatchlist />

        },
        {
          path:"/movies",
          element:<Movies
          />
        },
        {
          path:"/series",
          element:<Series  />
        }
      ]
    },
    {
      path:"/login",
      element:<Login />
    },
    {
      path:"/register",
      element:<Register />
    },
    
  ])


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
