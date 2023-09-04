import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchData } from '../utils/fetchData';
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from '../axios';
import userLogo from "../assets/user.png"
import FilmCard from '../components/FilmCard';
import SeriesCard from '../components/SeriesCard';

const Search = () => {

  const {searchTerm} = useParams()
  const [movies, setMovies] = useState([]);
  const [tvSeries, setTvSeries] = useState([]);
  const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
  const baseUrl = 'https://api.themoviedb.org/3'


  const { isLoading:searchLoading, error:searchError, data:searchData,refetch: refetchUsers } = useQuery(["searchUsers"], () =>
  makeRequest.get("/users/search/" + searchTerm).then((res) => {
        return res.data
  })
);

  
  useEffect(()=>{
    const fetchSearchedMovies = async()=>{
      try {
          const response = await fetchData(`${baseUrl}/search/movie?api_key=${API_KEY}&query=${searchTerm}`)
          const fetchedMoviesData = response
          setMovies(fetchedMoviesData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSearchedMovies()
  },[searchTerm])


  useEffect(()=>{
    const fetchSearchedSeries = async()=>{
      try {
        const response = await fetchData(`${baseUrl}/search/tv?api_key=${API_KEY}&query=${searchTerm}`)
        const fetchedMoviesData = response
        setTvSeries(fetchedMoviesData)
      } catch (error) {
        console.log(error)
      }
    }
    fetchSearchedSeries()
    
  },[searchTerm])

  useEffect(()=>{
    refetchUsers();
  },[searchTerm])
  
  console.log(searchData)
  console.log(movies)
  console.log(tvSeries)
  return (
    <div className='search-container'>
        <div className='liked-movies-h1'>
            <h1>
              Search results for: {searchTerm}
            </h1>
        </div>
      <div>
        <div className='liked-movies-h1'>
           <h1>Users</h1>
        </div>
        <div className='searched-users'>
            {searchData?.length > 0 ? searchData.map((user)=>(
              <Link key={user.id} className='searched-users-1' to={`/profile/${user.id}`}
              style={{textDecoration:'none',color:'inherit'}}
              >
                  <img src={user.profilePic ? "/upload/" + user.profilePic : userLogo} alt=""
                  className='user-pic'
                  />
                  {user.name}
              </Link>
            )) : "No result"}
        </div>
      </div>
      <div className='searched-films'>
          <div className='liked-movies-h1'>
          <h1>Movies</h1>
          </div>
          <div className='films'>
              {movies?.results?.map((film)=>(
                <div key={film.id}>
                   <FilmCard film={film} />
                </div>
              ))}
          </div>
      </div>
      <div className=''>
      <div className='liked-movies-h1'>
           <h1>Series</h1>
        </div>
      </div>
      <div className='films'>
          {tvSeries?.results?.length > 0 ? 
          tvSeries.results.map((serie)=>(
            <div key={serie.id}>
               <SeriesCard film={serie} />
            </div>
          )) : "No results"
        } 
      </div>
      
    </div>
  )
}

export default Search