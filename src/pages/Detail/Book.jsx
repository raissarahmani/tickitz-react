import { useNavigate} from 'react-router'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { storeBookDetails } from '../../redux/slices/bookingSlice'
import { VITE_API_URL } from '../../api/movieList'

function Book({movie}) {
    const movie_id = movie?.id

    const [schedule, setSchedule] = useState([])
    const [location, setLocation] = useState([])
    const [scheduleMap, setScheduleMap] = useState({})
    const [availableCinemas, setAvailableCinemas] = useState([])
    const [showCinemaForm, setShowCinemaForm] = useState(false)

    const [formData, setFormData] = useState({
        scheduleId: null,
        date: "",
        time: "",
        cityId: null,
        location: "",
        cinemaId: null,
        cinema: "",
    })
    
    const [error, setError] = useState({})
    const [isFormValid, setIsFormValid] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        let newError = {}
        if(!formData.date) newError.date = "Data should be filled"
        if(!formData.time) newError.time = "Data should be filled"
        if(!formData.location) newError.location = "Data should be filled"
        if(!formData.cinemaId) newError.cinema = "Data should be filled"

        setError(newError)
        setIsFormValid(Object.keys(newError).length === 0)
    }, [formData])

    const getCityAndSchedule = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}/showing/schedule?movie_id=${movie_id}`)
        const input = await res.json()

        if (input?.data) {
            setSchedule(input.data.schedules || [])
            setLocation(input.data.cities || [])
        }
      } catch (error) {
        console.error("Failed to load schedules or cities", error)
      }
    }

    useEffect(() => {      
        getCityAndSchedule()
      }, [movie_id])

    const formHandler = (e) => {
      console.log(e.target.name, e.target.value)
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
      

    const filterSchedule = async () => {     
        const { date, time, location } = formData
        if (!date || !time || !location) return

        setShowCinemaForm(true)
      
        try {
          const res = await fetch(`${VITE_API_URL}/showing/schedule?movie_id=${movie_id}&city_id=${formData.location}&schedule_id=${formData.time}`)
          const input = await res.json()
    
          const cinemas = input?.data?.cinemas
          setAvailableCinemas(input.data.cinemas);
          console.log(cinemas)

          if (Array.isArray(cinemas)) {
            setAvailableCinemas(cinemas)
          
            const cinemasMap = cinemas.reduce((acc, cinema) => {
              acc[cinema.id] = cinema.schedule_id
              return acc;
            }, {});
            setScheduleMap(cinemasMap);
          }

        } catch (err) {
          console.error("Failed to fetch cinemas", err)
        }
    }   
    
    useEffect(() => {
    }, [availableCinemas]);
        
    const submitForm = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    
        if (isFormValid) {
            const selectedScheduleId = scheduleMap[formData.cinema]
            const formatTime = (datetime) => {
              const date = new Date(datetime);
              const hours = String(date.getUTCHours()).padStart(2, '0');
              const minutes = String(date.getUTCMinutes()).padStart(2, '0');
              return `${hours}:${minutes}`;
            }
            const selectedCity = location.find(c => String(c.id) === formData.location);
            const selectedSchedule = schedule.find(s => String(s.id) === formData.time);
            const selectedCinema = availableCinemas.find(c => String(c.id) === formData.cinemaId);
            console.log(selectedCinema)

            dispatch(storeBookDetails({
              scheduleId: selectedScheduleId,
              date: formData.date,
              time: formatTime(selectedSchedule?.time),
              cityId: selectedCity?.id,
              location: selectedCity?.name,
              cinemaId: selectedCinema?.id,
              cinema: selectedCinema?.cinema
            }))

            navigate(`/showing/seat`);
        }
    }
    
  return (
    <section className='pt-[5vh] pb-[10vh] px-[5vw] md:px-[10vw]'>
        <p className='font-semibold md:font-normal text-xl md:text-3xl text-center md:text-left text-[#121212]'>Book Tickets</p>
        <form onSubmit={submitForm} className='md:font-semibold text-sm md:text-basis text-[#000] flex flex-col md:flex-row flex-1 md:my-[5vh]'>
            <div className='flex flex-col mr-[1vw] w-full md:w-1/4'>
                <label for="date">Choose Date</label>
                <div className='flex flex-row items-center border-input bg-[#EFF0F6] px-[5vw] md:px-[1vw]'>
                    <input onChange={formHandler} className='border-none w-full min-w-[100px] py-[2vh] px-[1vw] ml-[0.5vw] cursor-pointer md:font-semibold outline-none' type="date" name="date" value={formData.date} />
                </div>
                {isSubmitted && error.date && <p className='validation-msg'>{error.date}</p>}
            </div>
            <div className='flex flex-col mr-[1vw] w-full md:w-1/4'>
              <label htmlFor="time">Choose Time</label>
                <div className='flex flex-row items-center border-input bg-[#EFF0F6] px-[5vw] md:px-[1vw]'>
                  <select onChange={formHandler} value={formData.time} name="time" className='border-none w-full min-w-[100px] py-[2vh] px-[1vw] ml-[0.5vw] cursor-pointer md:font-semibold outline-none'>
                    <option value="">-- Select Time --</option>
                    {Array.isArray(schedule) && schedule.map((t) => {
                      const time = new Date(t.time);
                      const formattedTime = time.getUTCHours().toString().padStart(2, '0') + '.' + time.getUTCMinutes().toString().padStart(2, '0');
                      return (
                        <option key={t.id} value={t.id}>
                          {formattedTime}
                        </option>
                      )
                    })}
                  </select>
                </div>
              {isSubmitted && error.time && (<p className='validation-msg'>{error.time}</p>)}
            </div>
            <div className='flex flex-col mr-[1vw] w-full md:w-1/4'>
              <label htmlFor="location">Choose Location</label>
              <div className='flex flex-row items-center border-input bg-[#EFF0F6] px-[5vw] md:px-[1vw]'>
                <select onChange={formHandler} value={formData.location} name="location" className='border-none w-full min-w-[100px] py-[2vh] px-[1vw] ml-[0.5vw] cursor-pointer md:font-semibold outline-none'>
                  <option value="">-- Select Location --</option>
                  {Array.isArray(location) && location.map((city, index) => (
                    <option key={city.id || index} value={city.id}>
                      {city.city || `City ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
              {isSubmitted && error.location && (<p className='validation-msg'>{error.location}</p>)}
            </div>
            <div>
                <div className='flex flex-col items-center justify-center bg-transparent border-none'>
                    <button onClick={filterSchedule} className='custom-button bg-[#1D4ED8] mt-[3.5vh] py-[2vh] px-[2vw] rounded-sm text-[#fff] w-full'>Filter</button>
                </div>
            </div>
        </form>
        {showCinemaForm && (
            <div ><div className='block md:flex flex-row items-center my-[5vh] md:my-0'><p className='text-xl md:text-xl md:font-semibold text-center md:text-left text-[#000] mr-[3vw]'>Choose Cinema</p></div>
            <form onSubmit={submitForm}>
                <div className='flex justify-between items-center mt-[1vh] mb-[5vh] w-full'>
                    {availableCinemas.map((cinema, index) => {
                      return (
                        <div className='cinema-radio' key={index}>
                          <input onChange={formHandler} className='hidden peer' type="radio" name="cinemaId" id={`cinema-${cinema.id}`} value={cinema.id} checked={formData.cinemaId == String(cinema.id)}/>
                          <label className='label-radio peer-checked:bg-[#1D4ED8]' htmlFor={`cinema-${cinema.id}`}>
                            <img className='w-[12vw] h-[5vh] object-contain' src={`/${cinema.cinema}.svg`} alt={cinema.cinema}/>
                          </label>
                        </div>
                      );
                    })}
                  </div>
                {isSubmitted && error.cinema && <p className='validation-msg'>{error.cinema}</p>}
                <div className='flex justify-center my-[5vh]'><button type="submit" className='custom-button bg-[#1D4ED8] mt-[3.5vh] py-[2vh] px-[2vw] rounded-sm text-[#fff] w-full'>Choose Seat</button></div>
            </form> 
        </div>
        )}
    </section>
  )
}

export default Book
