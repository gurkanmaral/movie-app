import React from 'react'
import { Link } from 'react-router-dom'

const FilmCard = ({film,rating,comments}) => {

  const posterPath = film.poster_path

  let posterUrl = null
  if (posterPath) {
      posterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`
  }
  
  return (
    <Link to={`/movie-details/${film.id}`} className='link'>
      <div className='film-card'>
        <img src={posterUrl} alt="" />
          <div className='film-p'>
              <p>{film.title || film.name}</p>
              {rating && rating}
              {comments && (
                <div>
                  {comments.map((comment)=>(
                    <div key={comment.id}>
                        <p>{comment.desc}</p>

                    </div>
                  ))}
                </div>
              )}
          </div>
          <div className='film-vote-count'>
                    <span>{film.vote_average.toFixed(1)}</span>
          </div>
      </div>
    </Link>
    
  )
}

export default FilmCard