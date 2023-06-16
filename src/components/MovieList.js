import React, { useState, useEffect } from 'react';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);

  useEffect(() => {
    fetchMovies();
  }, [currentPage, selectedLanguage]);

  const fetchMovies = async () => {
    const baseUrl = 'https://api.themoviedb.org/3/movie/upcoming';
    const apiKey = '81f382d33088c6d52099a62eab51d967';
    const language = selectedLanguage !== 'all' ? selectedLanguage : '';

    const url = `${baseUrl}?api_key=${apiKey}&language=en-US&page=${currentPage}&query=${searchText}${language}`;

    const response = await fetch(url);
    const data = await response.json();

    setMovies(data.results);
    setTotalPages(data.total_pages);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    setIsSearchClicked(true);
    fetchMovies();
    addToSearchHistory();
  };

  const addToSearchHistory = () => {
    const search = {
      id: Date.now(),
      title: searchText,
      language: selectedLanguage !== 'all' ? selectedLanguage : 'all',
    };

    setSearchHistory((prevHistory) => [search, ...prevHistory.slice(0, 2)]);
  };

  const handleDeleteSearch = (id) => {
    setSearchHistory((prevHistory) => prevHistory.filter((search) => search.id !== id));
  };

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleMovieClick = (movie) => {
    setSelectedMovie(movie);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredMovies = isSearchClicked
    ? movies.filter((movie) =>
        movie.title.toLowerCase().includes(searchText.toLowerCase()) &&
        (selectedLanguage === 'all' || movie.original_language === selectedLanguage)
      )
    : movies;

  return (
    <div>
      <div>
        <input
          type="text"
          value={searchText}
          onChange={handleSearchTextChange}
          placeholder={'Enter movie title'}
        />
        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="all">All</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        <h3 style={{color:'#00331a'}}>Search History</h3>
        {searchHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th style={{color:'#00331a'}}>Title</th>
                <th style={{color:'#00331a'}}>Language</th>
                <th style={{color:'#00331a'}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchHistory.map((search) => (
                <tr key={search.id}>
                  <td style={{color:'#006633'}}>{search.title}</td>
                  <td style={{color:'#006633'}}>{search.language}</td>
                  <td>
                    <button  style={{backgroundColor:'#006633', color:'#ffffff'}} onClick={() => handleDeleteSearch(search.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No filter applied yet</p>
        )}
      </div>
      <div >
        <h3 style={{color:'#00331a'}}>Movie List</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {filteredMovies.map((movie) => (
            <div
              key={movie.id}
              style={{
                margin: '10px',
                padding: '20px',
                width: '400px',
                height: '400px',
                backgroundColor: '#66ffb3',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <h2 style={{ textAlign: 'center', marginTop: 0 , color:'#ffffff'}}>{movie.title}</h2>
              {!showDetails  && (
                <button
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    textAlign: 'center',
                    backgroundColor: 'white',
                    padding: '5px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    backgroundColor:'#00994d', color:'#ffffff'
                  }}
                  onClick={() => handleMovieClick(movie)}
                >
                  Click here for details
                </button>
              )}
              {showDetails && selectedMovie === movie && (
                <>
                  <div>
                    <p>Vote Average: {movie.vote_average}</p>
                    <p>Language: {movie.original_language}</p>
                    <p>Release Date: {movie.release_date}</p>
                    <p>Overview: {movie.overview}</p>
                  </div>
                  <button style={{
                    
                    backgroundColor:'#00994d', color:'#ffffff'
                  }} onClick={handleCloseDetails}>Close</button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        {currentPage > 1 && (
          <button onClick={handlePreviousPage}>Previous Page</button>
        )}
        {currentPage < totalPages && (
          <button onClick={handleNextPage}>Next Page</button>
        )}
      </div>
    </div>
  );
};

export default MovieList;
