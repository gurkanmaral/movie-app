import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {makeRequest} from "../axios"
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import { AuthContext } from '../context/authContext';
import {fetchData} from "../utils/fetchData"
import SeriesComments from '../components/SeriesComments';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import userLogo from "../assets/user.png"
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
const SeriesDetails = () => {


  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [seriesDetails, setSeriesDetails] = useState([])
  const [cast,setCast] = useState([])
  const [rating,setRating] = useState('');
  const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
  const baseUrl = 'https://api.themoviedb.org/3'
  const mediaId = id
  const mediaType = "series"
  const posterPath = seriesDetails.poster_path
  const userId = currentUser?.id
  
  let posterUrl = null
  if (posterPath) {
      posterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`
  }
  const backdropPath= seriesDetails.backdrop_path

  let backdrop = null
  if(backdropPath){
    backdrop = `https://image.tmdb.org/t/p/original/${backdropPath}`
  }

  useEffect(()=>{
    const fetchSeriesDetails = async()=>{
      try{
        const response = await fetchData(`${baseUrl}/tv/${id}?api_key=${API_KEY}&language=en-US`)
        const seriesDetailsData = response
        setSeriesDetails(seriesDetailsData)
      }catch (error) {
        console.error(error)
    }
      
    }
    fetchSeriesDetails()
  },[id])
  console.log(seriesDetails)

  useEffect(()=>{
    const fetchCastData = async()=>{
      try{
        const response = await fetchData(`${baseUrl}/tv/${id}/credits?api_key=${API_KEY}&language=en-US`)
        const castData = response
        setCast(castData)
      }catch(error){
        console.error(error)
      }
    }
    fetchCastData()
  },[id])
console.log(cast)

const castData = cast?.cast?.slice(0, 20);

  const {isLoading,error,data} = useQuery(["seriesLikes", mediaId], ()=>
    makeRequest.get("/likes?mediaId="+mediaId).then((res)=>{
      return res.data
    })
  )
  const {isLoading:watchedSLoading,data:seriesWatchedData} = useQuery(["seriesWatched"],()=>
    makeRequest.get("/watched?mediaId="+ mediaId).then((res)=>{
      return res.data;
  }))
  const {isLoading:seriesListLoading,data:seriesWatchlistData} = useQuery(["seriesWatchlist"],()=>
    makeRequest.get("/watchlist?mediaId="+ mediaId).then((res)=>{
      return res.data
    })
  )

  const {isLoading:ratingLoading,data:seriesRating} = useQuery(["seriesRating",mediaId],()=>
      makeRequest.get(`/rating?mediaId=${mediaId}&userId=${userId}`).then((res)=>{
        return res.data
      })
  )
  const { isLoading: followingCommentsL, data: followCommentData } = useQuery(
    ["followingCSData", mediaId],
    () => makeRequest.get(`/comments/follow?mediaId=${mediaId}`).then((res) => res.data)
  );

  const {isLoading:ratingFollowLoading,data:friendRatingData} = useQuery(["ratingFriend",mediaId], ()=>
    makeRequest.get(`/rating/follow?mediaId=${mediaId}`).then((res)=>{
      return res.data
    })
  )
  const {isLoading:favoritesLoading,data:favoritesData} = useQuery(["seriesFavorites",mediaId],()=>
  makeRequest.get(`/favorites?mediaId=${mediaId}`).then((res)=>{
    return res.data;
  })
)
const {isLoading:favCountLoading,data: favCountData} = useQuery(["favCountSeries"], ()=>
makeRequest.get(`favorites/count?mediaId=${mediaId}`).then((res)=>{
  return res.data;
})
)



const queryClient = useQueryClient();
    
const mutation = useMutation(
  (liked)=>{
    if (liked) return makeRequest.delete("/likes?mediaId="+mediaId);
    return makeRequest.post("/likes",{mediaId, media_type : mediaType})
  },
  {
    onSuccess:()=>{
      queryClient.invalidateQueries(["seriesLikes"])
    }
  }
)
const handleLike = () => {
  mutation.mutate(data.includes(currentUser?.id));
};
const watchedMutation = useMutation(
  (watched)=>{
    if(watched) return makeRequest.delete("/watched?mediaId=" + mediaId);
    return makeRequest.post("/watched", {mediaId, media_type: mediaType})
  },
  {
    onSuccess:()=>{
      queryClient.invalidateQueries(["seriesWatched"])
    }
  }
)
const handleWatch = ()=>{

  watchedMutation.mutate(seriesWatchedData.includes(currentUser?.id))
}

const watchlistMutation = useMutation(
  (watchlist) =>{
    if(watchlist) return makeRequest.delete("/watchlist?mediaId="+ mediaId);
    return makeRequest.post("/watchlist", {mediaId, media_type: mediaType})
  },
  {
    onSuccess: ()=>{
      queryClient.invalidateQueries(["seriesWatchlist"])
    }
  }
)

const handleWatchlist = ()=>{
  watchlistMutation.mutate(seriesWatchlistData.includes(currentUser?.id))
}

  
const ratingMutation = useMutation(
  (newRating)=>{
   
    return makeRequest.post("/rating", newRating)
  },
  {
    onSuccess: () =>{
      queryClient.invalidateQueries(["seriesRating"])
    }
  }
)

const handleRatingSubmit = (e) => {
  e.preventDefault();
  const ratingRegex = /^(10|[1-9](\.\d)?)$/;
  if (!rating.match(ratingRegex)) {
    // Display an error message or take appropriate action for invalid input
    alert("Invalid rating. Please enter a valid rating between 1 and 10.");
    return;
  }

  // Convert the rating from a string to a number
  const newRating = parseInt(rating);

  // Call the mutation function to add the rating
  ratingMutation.mutate({
    userId,
    media_type: mediaType,
    mediaId,
    rating: newRating,
  });

  // Clear the input field after submission
  setRating('');
};

const removeRatingMutation = useMutation(
  () => makeRequest.delete(`/rating?mediaId=${mediaId}&userId=${userId}`),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['seriesRating']);
    },
  }
);

const handleRemoveRating = (e)=>{
  e.preventDefault()

  removeRatingMutation.mutate();

}

const favoritesMutation = useMutation(
  (favorite)=>{
    if(favorite) return makeRequest.delete("/favorites?mediaId="+ mediaId);
    return makeRequest.post("/favorites",{mediaId, media_type: mediaType})
  },
  {
    onSuccess: ()=>{
      queryClient.invalidateQueries(["seriesFavorites"])
    }
  }
)
const handleFavorite = ()=>{
  const maxFavoritesMovies = 5;
  const favoriteMovies = favCountData.filter(
    (favorite) => favorite.media_type === "series"

    
  );
  if (favoriteMovies.length >= maxFavoritesMovies) {
    // If the user has already added 5 movies, show an alert or a <p> element
    alert("You have already added 5 series to favorites. You can't add more.");
  } else{
    favoritesMutation.mutate(favoritesData.includes(currentUser?.id))
  }

  
}

  console.log(friendRatingData)
  console.log(data)
  console.log(seriesWatchedData)
  console.log(seriesWatchedData)
  console.log(seriesRating)

  return (
    <div className='movie-details-container'>
       <div className='movie-bg'>
          <img src={backdrop} alt="" className='image mask'/>
        </div>
        <div className='movie-details-container-1'>
        <div className='movie-cover'>
            <img src={posterUrl} alt="" className='movie-cover-img' />
            <div className='series-network'>
            {seriesDetails?.networks && seriesDetails?.networks?.slice(0,3).map((network) => (
         <div key={network.id} className='series-network-1'>
          <img
            src={`https://image.tmdb.org/t/p/original${network.logo_path}`}
            alt={network.name}
            className='network-image'
          />        
        </div>
      ))}
            </div>
          </div>
          <div className='movie-details-container-2'>
            <div className='movie-details'>
              <span className='movie-details-title'>{seriesDetails.name}</span>
              <span className='movie-details-date'>({new Date(seriesDetails.first_air_date).getFullYear()})</span>
            </div>
          <div className='movie-details-2'>
            <div className='tagline-overview'>
              <p className='movie-tagline'>{seriesDetails?.tagline}</p>
              <p className='movie-overview'>{seriesDetails?.overview}</p>
            </div>
            <div className='movie-vote'>
                 <p>{seriesDetails?.vote_average?.toFixed(1)}</p>                 
                <div className='movie-genre'>
                  {seriesDetails?.genres?.map((genre) => (
                    <div key={genre.id} className='movie-genre-1'>
                      <span>{genre.name}</span>
                    </div>
                ))} 
                </div>
              </div>
              <div className='movie-runtime'>
                 <p>{seriesDetails?.episode_run_time} min</p>
                 <span>Seasons: {seriesDetails.number_of_seasons}</span>
                 <span>Episodes: {seriesDetails.number_of_episodes}</span>
              </div>
           </div>
          </div>
          <div className='movie-watchlist-container'>
            <div className='movie-watched'>
              {watchedSLoading ? (
                  <span>Loading...</span>
                ) : seriesWatchedData && seriesWatchedData.includes(currentUser?.id) ? (
                  <div onClick={handleWatch} className='movie-watched-1'>
                    <RemoveRedEyeIcon  style={{ width: '40px', height: '40px' }}/>
                    <span>Watched</span>
                  </div>
                ) : (
                  <div onClick={handleWatch} className='movie-watched-1'>
                    <RemoveRedEyeOutlinedIcon style={{ width: '40px', height: '40px' }}
                    />
                    <span>Watch</span>
                  </div>
                  )}    
              </div>
              <div className=''>
                {isLoading ?( "loading")
                : data.includes(currentUser?.id) ? (
                  <div className='movie-liked'>
                        <FavoriteOutlinedIcon
                      style={{ color: "red",width:'40px',height:'40px' }}
                       onClick={handleLike}
                />
                <span>Liked</span>
                  </div>              
                ) : (
                  <div className='movie-liked'>
                  <FavoriteBorderOutlinedIcon onClick={handleLike}
                  style={{ width: '40px', height: '40px' }} />
                  <span>Like</span>
               </div>            
                )}
              </div>
              <div className='movie-watchlist'>
                    {seriesListLoading ? ("loading")
                  : seriesWatchlistData.includes(currentUser?.id) ?
                (
                  <div onClick={handleWatchlist} className="watchlist-2">
                    <MoreTimeOutlinedIcon  style={{ width: '40px', height: '40px',color:"blue" }}/>
                    <span>Remove from watchlist</span>
                  </div>
                ): (
                  <div onClick={handleWatchlist} className='watchlist-2'>
                  <MoreTimeOutlinedIcon style={{ width: '40px', height: '40px' }}
                  />
                  <span>Add to watchlist</span>
                  </div>
                )}
              </div>
                <div>
                    {favoritesLoading ? (
                    <span>Loading...</span>
                  ) : favoritesData && favoritesData.includes(currentUser?.id) ? (
                    <div onClick={handleFavorite} className="movie-favorite">
                      <StarOutlinedIcon style={{ width: '40px', height: '40px' }}/>
                      Added to favorites
                    </div>
                  ) : (
                    <div onClick={handleFavorite} className="movie-favorite">
                    <StarBorderPurple500OutlinedIcon style={{ width: '40px', height: '40px' }}/>
                     Add to favorite
                   </div>
                   )}  
                </div>
                <div className='movie-rating'>
                {seriesRating ? (
              <div className='rating-1'>
                <span className='rating-point'>{seriesRating}</span>
                  <div onClick={handleRemoveRating} className='rating-delete'>
                    <ClearOutlinedIcon />
                  <span>Delete rating</span>
                    </div>
              </div>
              
              )
              :<form onSubmit={handleRatingSubmit}className="rating-form">
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="rating-select"
              >
                <option value="">Rate</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
              <button type="submit" className="rating-button">
                Submit Rating
              </button>
            </form>}
          </div>
        </div>
        </div>
          <div className='movie-cast'>
             <h1>Cast</h1>
             <div className='movie-cast-1' >
               {castData?.map((people)=>(
                <div key={people.id} className='cast-data'>
                  <img src={`https://image.tmdb.org/t/p/w200${people.profile_path}`} alt="" />
                  <span>{people.name}</span>
                  <span>{people.character}</span>

              </div>
               ))}
            </div>
          </div>
          <div className='friends-comments'>
            <div className='friends-comments-1'>
                <h1>Comments from Friends</h1>    
                {followCommentData?.map((comment)=>(
                  <div key={comment.id} className='follow-comment'>
                      <img src={comment.profilePic ? "/upload/" + comment.profilePic : userLogo} alt="" />
                       <div className='follow-name-desc'>
                         <p>{comment?.name}</p>
                         <p>{comment?.desc}</p>
                       </div>
                       
                    </div>
          ))}        
            </div>
            <div className='friends-comments-2'>
            <h1>Ratings from Friends</h1>     
              {friendRatingData?.map((rating)=>(
                        <div key={rating.id} className='follow-rating'>
                          <div className='follow-rating-2'> 
                            <img src={rating.profilePic ? "/upload/" + rating.profilePic : userLogo} alt="" />
                                <span>{rating.name}</span>
                          </div>
                              <div className='follow-rating-1'>
                                <span>{rating.rating}</span>
                              </div>
                            
                            
                        </div>
                      ))}
            </div>
          </div>
      <div className='series-comments'>
            <SeriesComments mediaId={mediaId} />
      </div>
    </div>
  )
}

export default SeriesDetails