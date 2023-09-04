import React from 'react'
import {Link} from "react-router-dom"

const Popular = ({movie,series,isMovie}) => {

  const posterPath = movie.poster_path

  let posterUrl = null
  if (posterPath) {
      posterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`
  }
  return (
    <div className='popular'>
            <Link to={isMovie ? `/movie-details/${movie.id}` : `/series-details/${movie.id}`} 
            style={{textDecoration:"none",color:"inherit"}}>
              <div className='popular-img'>
                <img src={posterUrl} alt="" />    
              </div>            
              <div className='popular-name'>
                <p>{movie.title || movie.name}</p>
              </div>
            </Link>
           
            
    </div>
  )
}

export default Popular