import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { nowPlaying, VITE_API_URL } from '../../api/movieList'
import Arrow from '../../assets/right-blue.png'

function NowPlaying() {
const [movie, setMovie] = useState([])
const navigate = useNavigate()

useEffect(() => {
    async function fetchTopRated () {
        try {   
            const playingMovie = await nowPlaying()
            if (!playingMovie) throw new Error ("Data is missing")
            setMovie(playingMovie.data)
        }
        catch (error) {
            console.error(error.message)
        }
    }
    fetchTopRated()
}, [])

  return (
    <section className='py-[10vh] px-[10vw] bg-[#fff]'>
        <p className="font-subtitle text-[#1D4ED8] text-center">MOVIES</p>
        <p className="text-3xl md:text-4xl text-[#121212] text-center my-[3vh]">Exciting Movies That Should Be <br /> Watched Today</p>
        <div className='overflow-x-auto overflow-y-hidden w-full'>
            <div className="grid grid-flow-col gap-[1vw] w-max">
                {movie.map((movie) => (
                    <div key={movie.id} className="container-movie">
                        <div className="recomended">Recomended</div>
                        <img className='movie' src={`${VITE_API_URL}/public/${movie.poster}`} alt={movie.title} />
                        <div className='w-full overflow-hidden'>
                            <p className="movie-title text-lg md:text-2xl">{movie.title}</p>
                        </div>
                        <div className="flex flex-row text-xs">
                        {movie.genre.split(', ').map((genre_name, genre_id) => (
                            <p key={genre_id} className='movie-genre'>{genre_name}</p>
                        ))}
                        </div>
                        <div className="detail-hover">
                            <div onClick={() => navigate(`/now-playing/movie/${movie.id}`)} className='text-[#fff] py-[1vh] my-[0.5vh] text-center w-full border border-solid border-[#fff] rounded-md cursor-pointer'>Details</div>
                            <div className='text-[#fff] bg-[#1D4ED8] py-[1vh] my-[0.5vh] text-center w-full border border-solid border-[#1D4ED8] rounded-md cursor-pointer'>Buy Ticket</div>
                        </div>
                    </div>
                ))}            
            </div>       
        </div>
        
        <div className="hidden md:flex flex-row justify-center my-[5vh] cursor-pointer">
            <p className='font-subtitle text-[#1D4ED8] px-[1vw]'>View all</p>
            <img src={Arrow} alt="View All" />
        </div>
    </section>
  )
}

export default NowPlaying
