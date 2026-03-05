import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";

const MovieCard = ({ movie }) => {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFav(favorites.some((fav) => fav.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = () => {
    let favorites =
      JSON.parse(localStorage.getItem("favorites")) || [];

    if (isFav) {
      favorites = favorites.filter((fav) => fav.id !== movie.id);
    } else {
      favorites.push(movie);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    setIsFav(!isFav);
  };

  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Image";

  return (
    <div className="movie-card">
      <div className="heart-btn" onClick={toggleFavorite}>
        {isFav ? <FaHeart className="heart active" /> : <FaRegHeart className="heart" />}
      </div>

      <img src={imageUrl} alt={movie.title} loading="lazy"/>

      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date?.slice(0, 4)}</p>
        <span>Rating: {movie.vote_average}<FaStar /></span>
      </div>
    </div>
  );
};

export default MovieCard;