import { useQuery } from '@tanstack/react-query';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { makeRequest } from '../axios';
import { fetchData } from '../utils/fetchData';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import userLogo from "../assets/user.png"
import { Pagination } from '@mui/material';
import { AuthContext } from '../context/authContext';
const ProfileSeries = () => {
  const { id } = useParams();
  const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f'
  const baseUrl = 'https://api.themoviedb.org/3'
  const [watchedSeries,setWatchedSeries] = useState([]);
  const [seriesRatings,setSeriesRatings] = useState([]);
  const [seriesComments, setSeriesComments] = useState({});
  const userId = id;
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMovies, setIsLoadingMovies] = useState(true);
  const {currentUser} = useContext(AuthContext)

  const {isLoading,error,data} = useQuery(["profileSeries", userId], ()=>
    makeRequest.get(`/watched/series/${userId}`).then((res)=>{
      return res.data
    })
  )
  const {isLoading:userIsLoading,data:userMovieInfo} = useQuery(["profileUser2"], ()=>
  makeRequest.get("/users/find/"+ userId).then((res)=>{
    return res.data;
  })
)
  

  useEffect(() => {
    const fetchWatchedSeriesData = async () => {
      if (data) {
        const mediaIds = data.map((item) => item.mediaId);
        try {
          const promises = mediaIds.map((id) =>
            fetch(`${baseUrl}/tv/${id}?api_key=${API_KEY}&language=en-US&append_to_response=credits&include_image_language=en,null`)
          );
          const responses = await Promise.all(promises);
          const seriesData = await Promise.all(responses.map((response) => response.json()));
          const seriesWithCreatedAt = seriesData.map((movie, index) => ({
            ...movie,
            createdAt: data[index].createdAt,
          }));
          setWatchedSeries(seriesWithCreatedAt);

          // Fetch ratings for watched movies
          const ratingsPromises = mediaIds.map((mediaId) =>
          makeRequest.get(`/rating?mediaId=${mediaId}&userId=${userId}`)
        );
        const ratingsResponses = await Promise.all(ratingsPromises);
        const ratingsData = ratingsResponses.reduce((acc, response, index) => {
          const ratingValue = response.data || null;
          acc[mediaIds[index]] = ratingValue;
          return acc;
        }, {});
        setSeriesRatings(ratingsData);

        const commentsPromises = mediaIds.map((mediaId) =>
        makeRequest.get(`/comments/users?userId=${userId}&mediaId=${mediaId}`)
      );
      const commentsResponses = await Promise.all(commentsPromises);
      const commentsData = commentsResponses.reduce((acc, response, index) => {
        const comments = response.data || [];
        acc[mediaIds[index]] = comments;
        return acc;
      }, {});
      setSeriesComments(commentsData);
       
       
       
        } catch (error) {
          console.error(error);
        }
        setIsLoadingMovies(false)
      }
    };

    fetchWatchedSeriesData();
  }, [data,userId]);

  const totalPages = Math.ceil(watchedSeries?.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentData = watchedSeries.slice(startIndex, endIndex);
    
    const handlePageChange = (event, newPage) => {
      setCurrentPage(newPage);
    };

    const handleDeleteComment = async (commentId, mediaId) => {
      try {
        const response = await makeRequest.delete(`/comments?commentId=${commentId}&mediaId=${mediaId}`);
        console.log(response.data); // Handle success (optional)
        // Refresh the comments after deletion
        // For better performance, you can directly remove the deleted comment from the 'movieComments' state.
        window.location.reload();
      } catch (error) {
        console.error(error); // Handle error (optional)
      }
    };

console.log(seriesComments)
console.log(data)
console.log(watchedSeries)
  return (
    <div className='profile-movies-container'>
       <div className='profile-movies-h3'>
            <h1>SERIES</h1>
        </div>
        <div className='profile-movies'>
            {isLoadingMovies ? 'loading' : currentData?.map((movie)=>(
                  <div key={movie.id} className='profile-movies-card'>
                    <Link to={`/series-details/${movie.id}`}>
                      <img src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`} alt=""
                      className='profile-movies-img'
                      />
                    </Link>            
                      <div className='profile-movies-info'>
                         <div className='profile-name-rating'>
                            <h1>{movie.name}</h1>
                            <div className='profile-movie-rating'>
                             <span style={{fontSize:'30px'}}> 
                             {userMovieInfo.name} Rating: <span style={{color:'red'}}>{seriesRatings[movie.id]}</span>
                             </span>
                             </div>
                             <div>
                              <p>Watched At: {new Date(movie.createdAt).toLocaleDateString('en-US')}</p>
                             </div>
                         </div>
                         <div className='profile-comments'>
                         {seriesComments[movie.id] &&
                          seriesComments[movie.id].map((comment) => (
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

export default ProfileSeries



