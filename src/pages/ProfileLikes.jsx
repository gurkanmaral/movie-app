import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { makeRequest } from '../axios';
import { fetchData } from '../utils/fetchData';
import SeriesCard from "../components/SeriesCard"
import FilmCard from '../components/FilmCard';


const ProfileLikes = () => {
  const { id } = useParams();
  const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
  const baseUrl = 'https://api.themoviedb.org/3'
  const [likedSeries,setLikedSeries] = useState([]);
  const [likedMovies,setLikedMovies] = useState([]);
  const userId = id; 

  const {isLoading,error,data} = useQuery(["profileFilmLikes",userId], ()=>
    makeRequest.get(`/likes/movies/${userId}`).then((res)=>{
      return res.data
    })
  )
  const {isLoading:lSLoading,data:LikedSeriesData} = useQuery(["profileLikedSeries"],()=>
    makeRequest.get(`/likes/series/${userId}`).then((res)=>{
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
          setLikedMovies(seriesData);
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchProfileLikes()
  },[data])

  useEffect(()=>{
    const fetchWatchedSeriesData = async () => {
      if (LikedSeriesData) {
        const mediaIds = LikedSeriesData.map((item) => item.mediaId);
        try {
          const promises = mediaIds.map((id) =>
            fetch(`${baseUrl}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits&include_image_language=en,null`)
          );
          const responses = await Promise.all(promises);
          const seriesData = await Promise.all(responses.map((response) => response.json()));
          setLikedSeries(seriesData);
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchWatchedSeriesData();
  },[LikedSeriesData])


  console.log(likedMovies)
  console.log(data)
  console.log(likedSeries)
  return (
    <div className='profile-likes-container'>
      <div className='movies-series-container'>
        <div className='liked-movies'>
              <div className='liked-movies-h1'>
                <h1>LIKED Movies</h1>
              </div>
              <div className='liked-card-container'>
              {likedMovies.map((movie)=>(
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
              <h1>LIKED Series</h1>
            </div>
            <div className='liked-card-container'>
                {likedSeries.map((serie)=>(
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

export default ProfileLikes