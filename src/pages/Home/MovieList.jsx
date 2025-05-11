import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { movieList, VITE_API_URL } from '../../api/movieList'

import Search from '../../assets/Search.png'
import ArrowBlue from '../../assets/right-blue.png'
import ArrowWhite from '../../assets/right-white.png'

function MovieList() {
const [movies, setMovies] = useState([])
const navigate = useNavigate()

useEffect(() => {
    async function fetchMovie() {
        try {     
            const nowPlaying = await movieList();
            console.log('movies: ', nowPlaying)
            if (!nowPlaying) throw new Error ("Data is missing")
            setMovies(nowPlaying.data);
        }
        catch (error) {
            console.error(error.message)
        }
      
    }

    fetchMovie();
  }, []);

  return (
    <section className='py-[4vh] px-[10vw]'>
        <div className='flex flex-col md:flex-row my-[5vh]'>
            <div className='w-full md:w-7/20'>
                <p className='font-semibold text-[#4E4B66]'>Cari Event</p>
                <label for="query" hidden></label>
                <div className='border-input flex flex-row'>
                    <img className='object-contain' src={Search} alt="Search" />
                    <input className='border-none outline-none py-[2vh] px-[1vw] w-full' type="text" name="query" placeholder="New Born Expert" />
                </div>
            </div>
            <div className='mt-[1vh] ml-[1vw]'>
                <p>Filter</p>
                <div className='flex flex-row justify-evenly mt-[1vh]'>
                    <div className='genre-option hover:bg-[#1D4ED8] hover:text-[#fff]'>Thriller</div>
                    <div className='genre-option hover:bg-[#1D4ED8] hover:text-[#fff]'>Horror</div>
                    <div className='genre-option hover:bg-[#1D4ED8] hover:text-[#fff]'>Romantic</div>
                    <div className='genre-option hover:bg-[#1D4ED8] hover:text-[#fff]'>Adventure</div>
                    <div className='genre-option hover:bg-[#1D4ED8] hover:text-[#fff]'>Sci-Fi</div>
                </div>
            </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
                <div key={movie.id} className="container-viewall relative">
                    <img className='w-full h-full object-cover rounded-lg' src={`${VITE_API_URL}/public/${movie.poster}`} alt={movie.title}/>
                    <p className="movie-title">{movie.title}</p>
                    <div className="flex flex-row text-xs">
                        {movie.genre.split(', ').map((genre_name, genre_id) => (
                            <p key={genre_id} className='movie-genre'>{genre_name}</p>
                        ))}
                    </div>
                    <div className="detail-hover h-[265px]">
                        <div onClick={() => navigate(`/now-playing/movie/${movie.id}`)} className='text-[#fff] py-[1vh] my-[0.5vh] text-center w-full border border-solid border-[#fff] rounded-md cursor-pointer'>Details</div>
                        <div className='text-[#fff] bg-[#1D4ED8] py-[1vh] my-[0.5vh] text-center w-full border border-solid border-[#1D4ED8] rounded-md cursor-pointer'>Buy Ticket</div>
                    </div>
                </div>
            ))}
        </div>
        <div className="hidden md:flex flex-row items-center justify-center mt-[5vh]">
            <div className='pages hover:bg-[#1D4ED8] hover:text-[#fff]'>1</div>
            <div className='pages hover:bg-[#1D4ED8] hover:text-[#fff]'>2</div>
            <div className='pages hover:bg-[#1D4ED8] hover:text-[#fff]'>3</div>
            <div className='pages hover:bg-[#1D4ED8] hover:text-[#fff]'>4</div>
            <div className='pages'>
                <img className='absolute top-1/8 left-1/5 block hover:hidden' src={ArrowBlue} alt="Next" />
                <img className='absolute top-1/8 left-1/5 hidden hover:block' src={ArrowWhite} alt="Next" />
            </div>
        </div>
    </section>
  )
}

export default MovieList
