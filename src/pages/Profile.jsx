import React, { useContext, useEffect, useState } from 'react'
import {useParams} from "react-router-dom"
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query'
import {makeRequest} from "../axios"
import userLogo from "../assets/user.png"
import { Link } from 'react-router-dom'
import {AuthContext} from "../context/authContext"
import Update from '../components/Update'
import GitHubIcon from '@mui/icons-material/GitHub';
const Profile = () => {


const {id} = useParams()
const userId = id
const [openUpdate,setOpenUpdate] = useState(false)
const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
const baseUrl = 'https://api.themoviedb.org/3'
const {currentUser} = useContext(AuthContext)
const [favMovies, setFavMovies] = useState([])
const [favSeries,setFavSeries] = useState([])

const {isLoading,error,data,refetch:refetchUser} = useQuery(["profileUser"], ()=>
  makeRequest.get("/users/find/"+ userId).then((res)=>{
    return res.data;
  })
)

const { isLoading: isLoadingWatchedCount, data: watchedCount } = useQuery(
  ['watchedFilmCount', userId],
  () => makeRequest.get(`/watched/count?userId=${userId}`).then((res) => res.data)
);

const {isLoading:likeCountLoading,data: likeCountData} = useQuery(["likeCount", userId],
  ()=> makeRequest.get(`likes/count?userId=${userId}`).then((res)=>{
    return res.data
  })
)
const {isLoading:watchlistLoading,data:watchlistData} = useQuery(["watchlistCount", userId],
  ()=> makeRequest.get(`watchlist/count?userId=${userId}`).then((res)=>{
    return res.data
  })
)

const { isLoading:rIsLoading ,data: relationshipData,refetch:refetchRelationData } = useQuery(["relationship"], () =>
makeRequest.get("/relationships?followedUserId="+ userId).then((res) => {
  return res.data;
})
);
const {isLoading:followIsLoading,data: followData,refetch:followingRefetch} = useQuery(["following"], ()=>
  makeRequest.get(`/relationships/followers-following?userId=${userId}`).then((res)=>{
    return res.data;
  })
)
const {isLoading: allIsLoading, data: allData} = useQuery(["allUsers"],() =>
makeRequest.get("/users").then((res) => {
  return res.data
})
);

const {isLoading:userFavMediaLoading,data: userFavMediaData} = useQuery(["userFavMedia"],
 ()=> makeRequest.get(`favorites/mediaId?userId=${userId}`).then((res)=>{
  return res.data
 })
)
console.log(userFavMediaData)
const queryClient = useQueryClient()

const mutation = useMutation(
  (following) => {
    if(following) return makeRequest.delete("/relationships?userId="+ userId)

    return makeRequest.post("/relationships",{userId})
  },
 {
  onSuccess: ()=>{
    queryClient.invalidateQueries(["relationship"])
    queryClient.invalidateQueries(["allUsers"])
    queryClient.invalidateQueries(["following"]);
  }
 }
)

const handleFollow = ()=>{
  mutation.mutate(relationshipData.includes(currentUser.id))
  }
  

  useEffect(()=>{
    refetchUser()
  },[userId])
  
const moviesOnly = userFavMediaData?.filter((item)=>item.media_type === 'movies')
const seriesOnly = userFavMediaData?.filter((item)=>item.media_type === 'series')


useEffect(()=>{
  const fetchFavMovie = async()=>{
    if(moviesOnly){
      const mediaIds = moviesOnly.map((item)=>item.mediaId)
      try{
        const promises = mediaIds.map((id)=> fetch(`${baseUrl}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits&include_image_language=en,null`))
        const responses = await Promise.all(promises);
        const moviesData = await Promise.all(responses.map((response)=>response.json()))
        setFavMovies(moviesData)
      }catch(error){
        console.log(error)
      }
    }
  }
  fetchFavMovie()
},[userFavMediaData,userId])

useEffect(()=>{
  const fetchFavSeries = async()=>{
    if(seriesOnly){
      const mediaIds = seriesOnly.map((item)=> item.mediaId)
      try {
        const promises = mediaIds.map((id)=> fetch(`${baseUrl}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits&include_image_language=en,null`))
        const responses = await Promise.all(promises);
        const moviesData = await Promise.all(responses.map((response)=>response.json()))
        setFavSeries(moviesData)
      } catch (error) {
        console.log(error)
      }
    }
  }
  fetchFavSeries()
},[userFavMediaData,userId])

console.log(favSeries)
console.log(favMovies)
console.log(seriesOnly)
console.log(moviesOnly)
console.log(relationshipData)
console.log(watchedCount)
console.log(data)
console.log(likeCountData)
console.log(watchlistData)
  return (
    <div className='profile'>
      <div className='profile-info'>
        <div className='profile-pic-container'>
        <div className='profile-pic'>
              <img src={data?.profilePic ? "/upload/"+ data.profilePic : userLogo} alt="" />
          </div>         
        <div className='profile-liked-movie'>
             {isLoading ? "loading" : userId == currentUser?.id ? (<button onClick={()=>setOpenUpdate(true)} className='update-button'>update</button>)
            : (<button className='update-button' onClick={handleFollow}>{relationshipData?.includes(currentUser?.id) ? "Following" : "Follow"}</button>)}
      </div>
        </div>      
          <div className='profile-info-container'>
            <div className='profile-name-container'>
               <p className='profile-name'>{data?.name}</p>
            </div>   
            <div className='profile-count-container'>
              <div className='watch-series'>
                <Link to={`/profile/${id}/films`} className='link watch-series'>
                {watchedCount?.watchedMoviesCount}
                <p>Films</p>
                 
                </Link>
                  
              </div>  
               <div className='watch-series-con'>
                <Link to={`/profile/${id}/series`} className='link watch-series'>
                <span>{watchedCount?.watchedSeriesCount}</span>
                 <p>Series</p>                 
                </Link>
                 
               </div>
               <div className='watch-series'>
               <Link to={`/profile/${id}/likes`} className='link watch-series'>
               {likeCountData?.likedMoviesCount + likeCountData?.likedSeriesCount}
                <p>LIKES</p>
                
                </Link>
                
               </div>
               <div className='watch-series'>
               <Link to={`/profile/${id}/watchlist`} className='link watch-series'>
                   {watchlistData?.watchlistMoviesCount + watchlistData?.watchlistSeriesCount}
                  <p>Watchlist</p>
                </Link>
               </div>
                  <div className='watch-series'>
                    <span>
                    {followData?.followers.length}            
                    </span> 
                    <span>
                    Followers          
                    </span>             
               </div>
               <div className='watch-series'>
                  <span> 
                  {followData?.following.length} 
                  </span>  
                  <span>                
                  Following
                  </span>             
               </div>
            </div>          
          </div>
      </div>
      <div className='profile-favorite'>
        <h1>Favorite Films</h1>
        <div className='profile-favorite-1'>
          {userFavMediaLoading ? "loading": favMovies.map((movie)=>(
            <Link to={`/movie-details/${movie.id}`} key={movie.id}>
              <div  className='profile-favorite-2'>
                <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" 
                 className='favorite-img'
                />
            </div>
            </Link>     
          ))}
        </div>
      </div>
      <div className='profile-favorite'>
            <h1>FAVORITE SERIES</h1>
            <div className='profile-favorite-1'>
                {userFavMediaLoading ? "loading" : favSeries.map((movie)=>(
                  <Link to={`/series-details/${movie.id}`} key={movie.id}>
                     <div  className='profile-favorite-2'>
                      <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt="" 
                      className='favorite-img'
                      />
                  </div>
                  </Link>
                  
                ))}
            </div>
      </div>
      <div className=''>
      {openUpdate && <Update  setOpenUpdate={setOpenUpdate} user={data} refetchUser={refetchUser} />}
      </div>
    </div>
  )
}

export default Profile