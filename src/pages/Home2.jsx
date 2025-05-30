import React from 'react'

import MovieList from "./Home/MovieList";
import Newsletter from '../components/Newsletter';

import Background from '../assets/avenger.png'

function Home2() {
  return (
    <>
    <section className='relative z-0 before:content-[""] before:absolute before:inset-0 before:-z-1 before:bg-[#00000099]' style={{backgroundImage: `url(${Background})`}}>
        <div className='py-[15vh] px-[10vw] md:w-3/5'>
            <p className='font-subtitle text-[#fff]'>LIST MOVIE OF THE WEEK</p>
            <p className='font-medium text-4xl text-[#fff] my-[2vh]'>Experience the Magic of Cinema: Book Your Tickets Today</p>
        </div>
    </section>
    <MovieList />
    <Newsletter />
    </>
  )
}

export default Home2
