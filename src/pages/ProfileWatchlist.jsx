import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { makeRequest } from '../axios';
import { fetchData } from '../utils/fetchData';
import SeriesCard from "../components/SeriesCard"
import FilmCard from '../components/FilmCard';



const ProfileWatchlist = () => {
  const { id } = useParams();
  const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
  const baseUrl = 'https://api.themoviedb.org/3'
  const [watchlistSeries,setWatchlistSeries] = useState([]);
  const [watchlistMovies,setWatchlistMovies] = useState([]);
  const userId = id; 

  const {isLoading,error,data} = useQuery(["profileWatchlist",userId],()=>
    makeRequest.get(`/watchlist/movies/${userId}`).then((res)=>{
      return res.data;
    })
  )
  const {isLoading:watchlistpLoading,data:profileWatchlistSeries} = useQuery(["profileWSeries"],()=>
    makeRequest.get(`/watchlist/series/${userId}`).then((res)=>{
      return res.data;
    })
  )
    
  useEffect(()=>{
    const fetchProfileLikes = async()=>{
      if (data) {
        const mediaIds = data.map((item) => item.mediaId);
        try {
          const promises = mediaIds.map((id) =>
          fetch(`${baseUrl}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits&include_image_language=en,null`)
          );
          const responses = await Promise.all(promises);
          const seriesData = await Promise.all(responses.map((response) => response.json()));
          setWatchlistMovies(seriesData);
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchProfileLikes()
  },[data])

  useEffect(()=>{
    const fetchWatchedSeriesData = async () => {
      if (profileWatchlistSeries) {
        const mediaIds = profileWatchlistSeries.map((item) => item.mediaId);
        try {
          const promises = mediaIds.map((id) =>
            fetch(`${baseUrl}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits&include_image_language=en,null`)
          );
          const responses = await Promise.all(promises);
          const seriesData = await Promise.all(responses.map((response) => response.json()));
          setWatchlistSeries(seriesData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchWatchedSeriesData();
  },[profileWatchlistSeries])

  console.log(data)
  console.log(profileWatchlistSeries)
  return (
    <div className='profile-likes-container'>
       <div className='movies-series-container'>
        <div className='liked-movies'>
          <div className='liked-movies-h1'>
                    <h1>Watchlist Movies</h1>
          </div>
          <div className='liked-card-container'>
              {watchlistMovies.map((movie)=>(
                 <div key={movie.id} >
                 <Link to={`/movie-details/${movie.id}`} style={{textDecoration:'none',color:'inherit'}}
                 className='liked-card'
                 >
                 <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" 
                   className='profile-movies-img'
                   />                 
                </Link>                  
              </div>
            ))}
          </div>
        </div>
        <div className='liked-movies'>
        <div className='liked-movies-h1'>
              <h1>Watchlist Series</h1>
            </div>
            <div className='liked-card-container'>
            {watchlistSeries.map((serie)=>(
              <div key={serie.id}>
              <Link to={`/series-details/${serie.id}`} style={{textDecoration:'none',color:'inherit'}}
              className='liked-card'
              >
                 <img src={`https://image.tmdb.org/t/p/original/${serie.poster_path}`} alt="" 
                 className='profile-movies-img'
                />
                
                </Link> 
           </div>
            ))}
            </div>
        </div>
       </div>
    </div>
  )
}

export default ProfileWatchlist