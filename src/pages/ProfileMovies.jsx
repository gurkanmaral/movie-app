import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { makeRequest } from '../axios';
import { fetchData } from '../utils/fetchData';
import FilmCard from '../components/FilmCard';
import userLogo from "../assets/user.png"
import Pagination from '@mui/material/Pagination';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { AuthContext } from '../context/authContext';
const ProfileMovies = () => {
    const { id } = useParams();
    const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
    const baseUrl = 'https://api.themoviedb.org/3'
    const [watchedMovies,setWatchedMovies] = useState([]);
    const userId = id;
    const [movieRatings, setMovieRatings] = useState({});
    const [movieComments,setMovieComments] = useState({});
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const {currentUser} = useContext(AuthContext)

    const {isLoading,error,data}= useQuery(["profileFilms",userId],()=>
    makeRequest.get(`/watched/movies/${userId}`).then((res) => res.data)
    )
    const {isLoading:userIsLoading,data:userMovieInfo} = useQuery(["profileUser1"], ()=>
    makeRequest.get("/users/find/"+ userId).then((res)=>{
      return res.data;
    })
  )


 
    useEffect(() => {
      const fetchWatchedMoviesData = async () => {
        if (data) {
          const mediaIds = data.map((item) => item.mediaId);
          try {
            const promises = mediaIds.map((id) =>
              fetch(
                `${baseUrl}/movie/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits&include_image_language=en,null`
              )
            );
            const responses = await Promise.all(promises);
            const moviesData = await Promise.all(responses.map((response) => response.json()));
            const moviesWithCreatedAt = moviesData.map((movie, index) => ({
              ...movie,
              createdAt: data[index].createdAt,
            }));
            setWatchedMovies(moviesWithCreatedAt);
  
           
            const ratingsPromises = mediaIds.map((mediaId) =>
              makeRequest.get(`/rating?mediaId=${mediaId}&userId=${userId}`)
            );
            const ratingsResponses = await Promise.all(ratingsPromises);
            const ratingsData = ratingsResponses.reduce((acc, response, index) => {
              const ratingValue = response.data || null;
              acc[mediaIds[index]] = ratingValue;
              return acc;
            }, {});
            setMovieRatings(ratingsData);

            const commentsPromises = mediaIds.map((mediaId) =>
            makeRequest.get(`/comments/users?userId=${userId}&mediaId=${mediaId}`)
          );
          const commentsResponses = await Promise.all(commentsPromises);
          const commentsData = commentsResponses.reduce((acc, response, index) => {
            const comments = response.data || [];
            acc[mediaIds[index]] = comments;
            return acc;
          }, {});
          setMovieComments(commentsData);
          } catch (error) {
            console.error(error);
          }
          setIsLoadingMovies(false)
        }
      };
      
      fetchWatchedMoviesData();
    }, [data, userId]);


    const totalPages = Math.ceil(watchedMovies?.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = watchedMovies.slice(startIndex, endIndex);
    
    const handlePageChange = (event, newPage) => {
      setCurrentPage(newPage);
    };
    
    const handleDeleteComment = async (commentId, mediaId) => {
      try {
        const response = await makeRequest.delete(`/comments?commentId=${commentId}&mediaId=${mediaId}`);
        console.log(response.data); // Handle success (optional)
        
        window.location.reload();
      } catch (error) {
        console.error(error); 
      }
    };
  
    

console.log(data)
console.log(watchedMovies)
console.log(movieRatings)
console.log(movieComments)



  return (
    <div className='profile-movies-container'>
        <div className='profile-movies-h3'>
            <h1>{userMovieInfo?.name} FILMS</h1>
        </div>

        <div className='profile-movies'>
            {isLoadingMovies ? 'loading' : currentData.map((movie)=>(
                  <div key={movie.id} className='profile-movies-card'>
                    <Link to={`/movie-details/${movie.id}`}>
                      <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt=""
                      className='profile-movies-img'
                      />
                    </Link>            
                      <div className='profile-movies-info'>
                         <div className='profile-name-rating'>
                            <h1>{movie.title}</h1>
                            <div className='profile-movie-rating'>
                             <span style={{fontSize:'30px'}}> {userMovieInfo.name} Rating: 
                             <span style={{color:'red'}}>{movieRatings[movie.id]}</span></span>
                             </div>
                             <div>
                             <p>Watched At: {new Date(movie.createdAt).toLocaleDateString('en-US')}</p>
                             </div>
                         </div>
                         <div className='profile-comments'>
                         {movieComments[movie.id] &&
                          movieComments[movie.id].map((comment) => (
                         <div key={comment.id} className='profile-comments-1'>
                            <img src={comment.profilePic ? "/upload/" + comment.profilePic : userLogo} alt=""
                            className='profile-movies-comment-img'
                            />
                            <p>{comment.desc}</p>     

                            {currentUser?.id === comment.userId && <div style={{justifyContent:'flex-end',position:'absolute' ,right:'5px',top:'10px'}}>
                            <button onClick={() => handleDeleteComment(comment.id, movie.id)}
                            className='comment-button'
                            >
                              <ClearOutlinedIcon />
                            </button>                
                            </div>}
                           
                         </div>
                     ))}         
                         </div>                         
                   </div>
                 </div>
                

            ))}
        <div>
        {!isLoadingMovies &&totalPages > 1 && (
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color='primary'
          className='pagination'
          size='medium'
          sx={{
            '& .Mui-selected': {
              color: 'red', // Change the color of selected page number to white
            },
            '& .MuiPaginationItem-page': {
              color: 'white', // Change the color of other page numbers to white
            },
            '& .MuiPaginationItem-root': {
              color: 'white', // Change the color of the dots and arrows to white
            },
          }}
        />
      )}
        </div>
        </div>
   
             
    </div>
  )
}

export default ProfileMovies

   