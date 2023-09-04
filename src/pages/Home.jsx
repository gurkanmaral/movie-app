import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import Popular from '../components/Popular'
import { fetchData } from '../utils/fetchData'
import { AuthContext } from '../context/authContext'
import herobanner from "../assets/herobanner.jpeg"
import { Link } from 'react-router-dom'
import banner2 from '../assets/banner-2.jpg'
import banner3 from '../assets/banner-6.jpg'
import banner4 from '../assets/banner-5.jpg'
import banner7 from '../assets/banner-7.jpg'
import noImage from "../assets/no-image.png"
const Home = () => {
 
  const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
  const baseUrl = 'https://api.themoviedb.org/3'
  const [popularFilms,setPopularFilms] = useState([])
  const [popularSeries,setPopularSeries] = useState([])
  const {currentUser} = useContext(AuthContext)
  const [upcoming,setUpcoming] = useState([])
  const [onAir,setOnAir] = useState([])

useEffect(()=>{
  const fetchPopularSeries = async()=>{
    try {
      const response = await fetchData(`${baseUrl}/trending/tv/week?api_key=${API_KEY}&page=1`);
      const popularSeries = response.results
      setPopularSeries(popularSeries)
    } catch (error) {
      console.error(error)
    }
  }
  fetchPopularSeries()
},[])

useEffect(()=>{
  const fetchPopularSeries = async()=>{
    try {
      const response = await fetchData(`${baseUrl}/trending/movie/week?api_key=${API_KEY}&language=en-US`)
      const popularSeries = response.results
      setPopularFilms(popularSeries)
    } catch (error) {
      console.error(error)
    }
  }
  fetchPopularSeries()
},[])

useEffect(()=>{
  const fetchPopularSeries = async()=>{
    try {
      const response = await fetchData(`${baseUrl}/movie/upcoming?api_key=${API_KEY}&language=en-US`)
      const popularSeries = response.results
      setUpcoming(popularSeries)
    } catch (error) {
      console.error(error)
    }
  }
  fetchPopularSeries()
},[])
useEffect(()=>{
  const fetchPopularSeries = async()=>{
    try {
      const response = await fetchData(`${baseUrl}/tv/on_the_air?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&with_origin_country=US`)
      const popularSeries = response.results
      setOnAir(popularSeries)
    } catch (error) {
      console.error(error)
    }
  }
  fetchPopularSeries()
},[])
  console.log(upcoming)

  const filteredMovies = upcoming?.slice(0,10)
  const filteredSeries = onAir?.slice(0,10)
  return (
    <div className='home'>
     
      <div>
      <div className='hero-banner'>
        <img src={herobanner} alt="" className='hero-banner-img' />
        <div className='hero-banner-info'>
            <p>Discover movies and series.</p>
        </div>
        <div className='hero-banner-info-2'>
            <p>Keep track of films and series you've watched. <br /> And follow your friends.</p>
        </div>
        <div className='hero-banner-info-3'>
          {!currentUser && (
                <Link to="/login">
                <button>
                  <p>Get started</p>
                </button>
              </Link>    
          )}       
        </div>
      </div>
      {currentUser && 
      <div className='welcome'>
        <span> WELCOME {currentUser.name}</span>
      </div>}
        <div className='banner-2'>
            <div className='banner-2-item'>
              <div style={{flex:'1'}}>
                  <img src={banner2} alt=""  className='banner-item-img'/>
              </div >  
              <div className='banner-span'>
                    <span>Track the movies and series you've watched.</span>
              </div>
            </div>
            <div className='banner-2-item-left'>
              <div style={{flex:'1'}}>
                <img src={banner3} alt="" className='banner-item-img' />
              </div>
              <div className='banner-span'>
                    <span>Like the movies and series you've enjoyed.</span>
              </div>
            </div>
            <div className='banner-2-item'>
               <div style={{flex:'1'}}>
                  <img src={banner4} alt="" className='banner-item-img' />
                </div>
                <div className='banner-span'>
                      <span>
                        Comment on films and series and check other people's reviews.
                        </span>
                </div>
            </div>
            <div className='banner-2-item-left'>
              <div style={{flex:'1'}}>
                <img src={banner7} alt="" className='banner-item-img' />
              </div>
              <div className='banner-span'>
                    <span>
                      Show your favorite movies and series on your profile.
                    </span>
              </div>
            </div>
      </div>        
      </div>
      <div className='popular-container'>
        <div className='popular-movie-h3'>
        <Link style={{textDecoration:'none',color:'inherit'}} to="/series">
            <h3>POPULAR MOVIES</h3>
        </Link>     
        </div>    
        <div className='popular-container-1'>
            {popularFilms?.slice(0,6).map((movie)=>(
              <Popular movie={movie} key={movie.id} isMovie={true} />
            ))}
            </div>
        </div> 
        <div className='popular-container'>
        <div className='popular-movie-h3'>
          <Link style={{textDecoration:'none',color:'inherit'}} to="/series">
            <h3>POPULAR SERIES</h3>
          </Link>
            
        </div>    
        <div className='popular-container-1'>
            {popularSeries?.slice(0,6).map((movie)=>(
              <Popular movie={movie} key={movie.id}  isMovie={false} />
            ))}
            </div>
        </div> 
        <div className='upcoming-container'>
            <div className='upcoming-left'>
                <div className='liked-movies-h1'>
                  <h1>In Theaters</h1>
                </div>
                <div className='upcoming-film'>
                    {filteredMovies?.map((movie)=>(
                      <div key={movie.id} className='upcoming-film-1'> 
                          <Link to={`/movie-details/${movie.id}`}>
                            <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" 
                            className='upcoming-img'
                            />
                          </Link>
                         
                          <span>{movie.title}</span>
                      </div>
                    ))}
                </div>
            </div>
            <div className='upcoming-right'>
                <div className='liked-movies-h1'>
                  <h1>Series On the Air</h1>
                </div>
                <div className='upcoming-film'>
                    {filteredSeries?.map((movie)=>(
                      <div key={movie.id} className='upcoming-film-1'> 
                          <Link to={`/series-details/${movie.id}`}>
                            {movie.poster_path ? <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" 
                            className='upcoming-img'
                            /> : <img src={noImage}   className='upcoming-img'/>  }
                          </Link>
                         
                          <span>{movie.name}</span>
                      </div>
                    ))}
                </div>
             </div>
        </div>     
    </div>
  )
}

export default Home