import React, { useEffect, useState } from 'react'
import FilmCard from '../components/FilmCard'
import { fetchData } from '../utils/fetchData';
import Pagination from '@mui/material/Pagination';
const Movies = ({popularFilms}) => {

 
  const [selectedGenre, setSelectedGenre] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres,setGenres] = useState([])
  const [topRated, setTopRated] = useState(false);
  const totalPage = 20;
  const API_KEY = '8c4e79ed80f9f915a30a2faece2daa0f';
  const baseUrl = 'https://api.themoviedb.org/3';
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const minimumVoteCount = 500;
  
  useEffect(()=>{
    const movieGenres = async()=>{
      try{
        const response = await fetchData(`${baseUrl}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
        const genresData = response.genres
        setGenres(genresData)
      }catch(error) {
              console.error(error)
          }
    }
    movieGenres()
  },[])




useEffect(() => {
  const fetchMovies = async () => {
    try {
      if (topRated) {
        const response = await fetchData(
          `${baseUrl}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${currentPage}`
        );
        const topRatedFilms = response.results;
        setMovies(topRatedFilms);
      } else if (selectedGenre) {
        const response = await fetch(
          `${baseUrl}/discover/movie?api_key=${API_KEY}&language=en-US&with_genres=${selectedGenre}&sort_by=${sortBy}&vote_count.gte=1000&page=${currentPage}`
        );
        const data = await response.json();
        const movies = data.results;
        setMovies(movies);
      } else {
        const response = await fetchData(
          `${baseUrl}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${currentPage}`
        );
        const popularFilms = response.results;
        setMovies(popularFilms);
      }
    } catch (error) {
      console.error(error);
    }
  };
  fetchMovies();
}, [selectedGenre, currentPage, topRated,sortBy]);


  const handleGenreSelect = (event) => {
    const value = event.target.value;
    setSelectedGenre(value !== "All" ? value : '');
    setCurrentPage(1);
    setTopRated(false);
  };

  const handlePageChange = (event, pageNumber) => {
    setCurrentPage(pageNumber);
    
    window.scrollTo({ top:0, behavior: 'smooth' });
  };

  const handleTopRatedClick = () => {
    setTopRated(true);
    setSelectedGenre('');
    setCurrentPage(1);
  };

  const handlePopularClick = () =>{
    setSelectedGenre('')
    setTopRated(false)
  }

  const handleSortByChange = (event) => {
    const value = event.target.value;
    setSortBy(value);
  };
  return (
    <div className='films-container'>
      <div className='films-cat'>
          <div className='films-cat-1'>
                <h1>FILMS</h1>
          </div>
          <div className='fims-cat-2'>
          <div onClick={handlePopularClick} style={{cursor:'pointer'}}>
            <span>Popular</span>
         </div>
         <div onClick={handleTopRatedClick} style={{ cursor: 'pointer' }}>
           <span>Top Rated</span>
         </div>
            <div className='film-genre-select'>
              <label htmlFor="genreSelect" className="genre-label">Select a genre:</label>
              <select className='' id="genreSelect"
              style={{
                background: '#14181c url(../assets/bg.png)',
                color: 'white',
                borderRadius: '8px', // Add the border-radius here
              }} 
              onChange={handleGenreSelect}>
                  <option style={{color:"white"}}>All</option>
                  {genres?.map((genre)=>(
                    <option value={genre.id} key={genre.id} style={{color:"white"}}>
                      {genre.name}
                      </option>
                    ))}
              </select> 
            </div>
          
      
         {selectedGenre && <div className='film-genre-select'>
        <label htmlFor="sortBySelect" className="sort-label">
          Sort by:
        </label>
        <select
          id="sortBySelect"
          value={sortBy}
          onChange={handleSortByChange}
          style={{
            background: '#14181c url(../assets/bg.png)',
            color: 'white',
            borderRadius: '8px', // Add the border-radius here
          }} 
        >
          <option value="popularity.desc">Popularity</option>
          <option value="vote_average.desc">Rating</option>
        </select>
      </div>}
          </div>
      </div>        
      <div className='films'>
      {
          movies?.map((film) => <FilmCard film={film} key={film.id} />)         
     }
      </div>
        <div className='pagination'>
        <Pagination
          color='primary' 
          defaultPage={1}
          page={currentPage}
          count={totalPage} // Set the total number of pages to 20
          onChange={handlePageChange} // Handle page changes
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
         
        </div>
    </div>
  )
}

export default Movies