import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/upcoming',
          {
            params: {
              api_key: '81f382d33088c6d52099a62eab51d967',
              language: 'en-US',
              page: currentPage,
            },
          }
        );

        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, [currentPage]);

  useEffect(() => {
    applyFilters();
  }, [searchText, selectedLanguage, movies]);

  const applyFilters = () => {
    const filtered = movies.filter((movie) => {
      const titleMatch = movie.title.toLowerCase().includes(searchText.toLowerCase());
      const languageMatch =
        selectedLanguage === 'all' || movie.original_language === selectedLanguage;

      return titleMatch && languageMatch;
    });

    setFilteredMovies(filtered);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setCurrentPage(1);
    applyFilters();
    addToSearchHistory();
  };

  const addToSearchHistory = () => {
    const newSearch = {
      title: searchText,
      language: selectedLanguage === 'all' ? 'All Languages' : selectedLanguage,
    };

    setSearchHistory((prevHistory) => [newSearch, ...prevHistory.slice(0, 2)]);
  };

  const handleDeleteSearch = (index) => {
    setSearchHistory((prevHistory) => prevHistory.filter((_, i) => i !== index));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage < totalPages) {
        return prevPage + 1;
      }
      return prevPage;
    });
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => {
      if (prevPage > 1) {
        return prevPage - 1;
      }
      return prevPage;
    });
  };

  return (
    <div>
      <h4 style={{color:'#003d66'}}>Apply Filters</h4>
      <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by movie title..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{height:'30px'}}
        />
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{height:'35px'}}
        >
          <option value="all">All Languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fi">Finnish</option>
          <option value="zh">Chinese</option>
          <option value="fr">Frenchs</option>
          <option value="ko">Korean</option>
          <option value="ja">Japanese</option>
        </select>
        <button   
          style={{height:'35px', backgroundColor:'#003d66', color:'#ffffff'}}
        
        type="submit">Search</button>
      </form>
      <h3 style={{color:'#006666'}}>Search History</h3>
      {searchHistory.length === 0 ? (
        <p style={{ color:'#00e673'}}>No filters applied as yet.</p>
      ) : (
        <table style={{backgroundColor:'#00cccc', color:'#ffffff', height:'40px',}}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Language</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {searchHistory.map((search, index) => (
              <tr style={{padding:'10px'}} key={index}>
                <td style={{paddingRight:'10px'}}>{search.title}</td>
                <td style={{paddingRight:'10px'}}>{search.language}</td>
                <td>
                  <button onClick={() => handleDeleteSearch(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

<h2 style={{color:'#003d66'}}>Movie List</h2>
      <ul style={{ listStyle: 'none', padding: 0 , backgroundColor:'#66ccff'}}>
        {(filteredMovies.length > 0 ? filteredMovies : movies).map((movie) => (
          <li
            key={movie.id}
            style={{ borderBottom: '3px solid white', marginBottom: '1rem' , paddingLeft:'10px'}}
          >
            <h3 style={{color:'#ffffff'}}>{movie.title}</h3>
            <p style={{color:'#ccefff'}}>Language: {movie.original_language}</p>
          </li>
        ))}
      </ul>
      <div>
        {currentPage > 1 && (
          <button onClick={handlePrevPage}>Previous Page</button>
        )}
        {currentPage < totalPages && (
          <button onClick={handleNextPage}>Next Page</button>
        )}
      </div>
    </div>
  );
};

export default MovieList;
