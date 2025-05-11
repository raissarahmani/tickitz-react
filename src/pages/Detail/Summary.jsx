import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useDispatch } from 'react-redux'
import {getDetail, VITE_API_URL} from '../../api/movieList'
import {storeMovieDetails} from '../../redux/slices/bookingSlice'

function Summary() {
    const {id} = useParams()
    const [movie, setMovie] = useState(null)
    const dispatch = useDispatch()
    const [movieDetails, setMovieDetails] = useState({
      poster: null,
      title: null,
      genres: null,
  });

    useEffect(() => {
        async function fetchData() {
          try {
            const movieData = await getDetail(id);
            if (!movieData) throw new Error ("Data is missing")
            setMovie(movieData.data);

            const fetchedMovie = {
              poster: `${VITE_API_URL}/public/${movieData.data.poster}`,
              title: movieData.data.title,
              genres: movieData.data.genre
            }

            setMovieDetails(fetchedMovie)
            dispatch(storeMovieDetails(fetchedMovie))
          }
          catch (error) {
            console.error(error.message)
          }
        }

        if (id) fetchData();
      }, [id, dispatch]);
    
      if (!movie) return <p>Loading...</p>

      const director = movie.director || "Unknown";
      const casts = movie.casts || "Unknown";
      const duration = movie.duration || "Unknown";

  return (
    <div className='summary'>
        <section className='flex md:block justify-center items-center rounded-md col-span-2 md:col-span-1 row-span-1'>
            <img className='object-contain w-2/3 md:w-full h-full rounded-md' src={movieDetails.poster} alt={movieDetails.title} />
        </section>
        <section className='px-[5vw] md:px-0 md:pl-[3vw] mt-[50vh] md:mt-[30vh]'>
            <p className='font-bold text-xl md:text-3xl text-center md:text-left text-[#14142B]'>{movieDetails.title}</p>
            <div className='flex flex-row justify-center md:justify-start my-[2vh]'>
              {movie.genre.split(', ').map((genre_name, genre_id) => (
                <p key={genre_id} className='movie-genre'>{genre_name}</p>
                ))}
            </div>
            <div className='w-full md:w-[70vw] grid grid-cols-2 md:grid-cols-[20vw_40vw] grid-rows-[15vh_20vh] md:grid-rows-2'>
                <div>
                    <p className='text-sm text-[#8692A6]'>Release date</p>
                    <p className='text-[121212]'>{new Date(movie.release).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <div>
                    <p className='text-sm text-[#8692A6]'>Directed by</p>
                    <p className='text-[121212]'>{director}</p>
                </div>
                <div>
                    <p className='text-sm text-[#8692A6]'>Duration</p>
                    <p className='text-[121212]'>{duration} minutes</p>
                </div>
                <div>
                    <p className='text-sm text-[#8692A6]'>Casts</p>
                    <p className='text-[121212]'>{casts}</p>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Summary
