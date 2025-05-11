import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { getDetail, VITE_API_URL } from '../api/movieList'

import Summary from './Detail/Summary'
import Book from './Detail/Book'

function Detail() {

  const {id} = useParams()
  const [movie, setMovie] = useState(null)
  const [showBook, setShowBook] = useState(false)

  useEffect(() => {
    async function getPoster () {
      const posterMovie = await getDetail(id)
      setMovie(posterMovie.data)
    }
    getPoster()
  }, [id])

  if (!movie) return <p>Loading...</p>

  return (
    <>
    <div style={{ zIndex: 5, position: 'relative' }}>
        <section className='relative h-[60vh] bg-cover bg-no-repeat bg-[50%_17%] before:content-[""] before:absolute before:inset-0 before:-z-1 before:bg-[#00000099]' style={{backgroundImage: `url(${VITE_API_URL}/public/${movie.poster})`, zIndex:0, position: 'relative', pointerEvents: 'none'}}></section>
        <Summary movie={movie} />
        <section className='pt-[120vh] md:pt-[40vh] px-[5vw] md:px-[10vw]'>
            <p className='font-semibold text-xl text-[#000] pt-[5vh]'>Synopsis</p>
            <p className='text-[#A0A3BD]'>{movie.synopsis}</p>
        </section>
    </div>
    <div className='flex justify-center mx-[10vw] my-[5vh] z-10'><button onClick={() => {
      console.log("Book component show") 
      setShowBook(true)
    }} className='custom-button bg-[#1D4ED8] mt-[3.5vh] py-[2vh] px-[2vw] rounded-sm text-[#fff] w-full'>Book Now</button></div>
    {showBook && <Book movie={movie} />}
    </>
  )
}

export default Detail
