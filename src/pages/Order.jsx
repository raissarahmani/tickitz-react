import { useSearchParams } from 'react-router-dom'
import Steps from './Order/Steps'
import Seats from './Order/Seats'

function Order() {
  const [searchParams] = useSearchParams();

  const queryParams = {
    movieId: searchParams.get("movie_id"),
    cityId: searchParams.get("city_id"),
    cinemaId: searchParams.get("cinema_id"),
    scheduleId: searchParams.get("schedule_id"),
  }

  return (
    <div className='bg-[#a0a3bd33] px-[10vw] py-[5vh] relative'>
      <Steps />
      <div className='flex flex-row'>
        <Seats {... queryParams} />
      </div>
    </div>
  )
}
export default Order
