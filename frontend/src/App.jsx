import { useEffect, useState, useRef, useCallback } from "react";
import { fetchPopularMovies, searchMovies } from "./services/api";
import MovieCard from "./components/MovieCard";
import SearchBar from "./components/SearchBar";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Favorites from "./pages/Favorites";

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [isMoodSearch, setIsMoodSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  const observer = useRef();


  useEffect(() => {
    setPage(1);
    setIsMoodSearch(false);
    loadMovies(1, true);
  }, [query]);

  const loadMovies = async (pageNum, reset = false) => {
    const data = query
      ? await searchMovies(query, pageNum)
      : await fetchPopularMovies(pageNum);

    if (data.results.length === 0 && pageNum === 1) {
      setNoResults(true);
      setMovies([]);
    } else {
      setNoResults(false);
      setMovies((prev) =>
        reset ? data.results : [...prev, ...data.results]
      );
    }
  };

  //  Mood Matcher Function
  // const handleMoodSearch = async () => {
  //   if (!mood) return;

  //   try {
  //     setIsMoodSearch(true);
  //     setNoResults(false);

  //     const response = await fetch("http://localhost:5000/mood-match", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ mood }),
  //     });

  //     const data = await response.json();

  //     if (data.movie) {
  //       setMovies([data.movie]);   // show only AI result
  //       setNoResults(false);
  //     } else {
  //       setMovies([]);
  //       setNoResults(true);
  //     }

  //   } catch (error) {
  //     console.log(error);
  //     setMovies([]);
  //     setNoResults(true);
  //   }
  // };


  const handleMoodSearch = async () => {
  if (!mood) return;

  try {
    setLoading(true);        // start loading
    setIsMoodSearch(true);
    setNoResults(false);

    const response = await fetch("https://movieapp-joay.onrender.com/mood-match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood }),
    });

    const data = await response.json();

    if (data.movie) {
      setMovies([data.movie]);
    } else {
      setMovies([]);
      setNoResults(true);
    }

  } catch (error) {
    setMovies([]);
    setNoResults(true);
  } finally {
    setLoading(false);      // stop loading
  }
};

  //  Infinite Scroll (Disabled for Mood Search)
  const lastMovieRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isMoodSearch) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isMoodSearch]
  );

  useEffect(() => {
    if (page > 1 && !isMoodSearch) {
      loadMovies(page);
    }
  }, [page]);

  return (
    <Router>
      <nav>
         <Link
          to="/"
          onClick={() => {
            loadPopularFirstPage();   //RESET TO FIRST DISPLAYED PAGE
            window.scrollTo(0, 0);
          }}
        >
          Home
        </Link>
        <Link to="/favorites">My Favorites</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <SearchBar onSearch={(q) => setQuery(q)} />

              <div style={{ textAlign: "center", margin: "20px 0" }}>
                <input
                  type="text"
                  placeholder="Describe your mood..."
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  style={{ padding: "8px", width: "250px" }}
                />
                <button
                  onClick={handleMoodSearch}
                  disabled={loading}
                  style={{ padding: "8px 12px", marginLeft: "8px" }}
                >
                  {loading?"Searching...":"Mood Match"}
                  {/* Mood Match */}
                </button>
              </div>

  
              {noResults && (
                <div className="not-found">Movie not found</div>
              )}

              {loading && (<div className="loading-text">Please wait a few seconds...</div>)}

             
              <div className="movie-grid">
                {movies.map((movie, index) => {
                  if (index === movies.length - 1 && !isMoodSearch) {
                    return (
                      <div ref={lastMovieRef} key={movie.id}>
                        <MovieCard movie={movie} />
                      </div>
                    );
                  }
                  return <MovieCard key={movie.id} movie={movie} />;
                })}
              </div>
            </>
          }
        />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;