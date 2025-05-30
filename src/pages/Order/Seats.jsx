import { useNavigate } from 'react-router'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { storeSeatsDetails } from '../../redux/slices/bookingSlice'
import { VITE_API_URL } from '../../api/movieList'

import Down from '../../assets/Arrow-black.png'
import Right from '../../assets/right-black.png'

function Seats() {
    const book = useSelector((state) => state.book)
    const movieID = book?.movieId
    const moviePoster = book?.poster
    const movieTitle = book?.title
    const movieGenres = book?.genres
    const scheduleID = book?.scheduleId
    const bookDate = book?.date
    const bookTime = book?.time
    const cinemaID = book?.cinemaId
    const bookCinema = book?.cinema
    const cityID = book?.cityId
    console.log("book detail", book)

    const [isModalOpen, setIsModalOpen] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [seats, setSeats] = useState([])
    const [selectedSeats, setSelectedSeats] = useState([])
    const [error, setError] = useState("")

    const rows = ["A", "B", "C", "D", "E", "F", "G"]
    const colsLeft = [1,2,3,4,5,6,7]
    const colsRight = [8,9,10,11,12,13,14]

    const fetchSeats = async () => {
        try {
            const res = await fetch(`${VITE_API_URL}/showing/seat?movie_id=${movieID}&cinema_id=${cinemaID}&city_id=${cityID}&schedule_id=${scheduleID}`, {
                cache: 'no-store'
            })
            const json = await res.json();

            if (res.ok) {
              setSeats(json.data)
              const booked = json.data
                .filter(seat => seat.is_available === false)
                .map(seat => seat.seat);

                setSeatData(prev => ({
                    ...prev,
                    bookedSeats: booked
                }))
            } else {
              setError(json.msg || "Failed to fetch seat data.");
            }
          } catch {
            setError("Server error.");
          }
        }

    useEffect(() => {
        if (!movieID || !cityID || !cinemaID || !scheduleID) {
          console.log("Fetching with", { movieID, cinemaID, cityID, scheduleID })
          setError("Missing booking information.")
          return
        }

        fetchSeats();
    }, [movieID, cityID, cinemaID, scheduleID])

    const seatMap = useMemo(() => {
        const map = {};
        for (const seat of seats) {
          map[seat.seat] = {
            id: seat.id,
            is_available: seat.is_available,
          };
        }
        return map;
      }, [seats]);

    const seatHandler = (seatString, seatDbId) => {
        setSelectedSeats((prev) => {
        if (prev.includes(seatString)) {
            return prev.filter((seat) => seat !== seatString);
        } else {
            return [...prev, seatString];
        }
    })

    setSeatData((prev) => {
        const isAlreadySelected = prev.seats.some((seat) => seat.seat === seatString);
        return {
          ...prev,
          seats: isAlreadySelected
            ? prev.seats.filter((seat) => seat.seat !== seatString)
            : [...prev.seats, { seat: seatString, seat_id: seatDbId }],
        }
    })}

    const renderSeatGrid = (cols) =>
        rows.map((row) =>
          cols.map((col) => {
            const seatId = `${row}${col}`;
            const seatData = seatMap[seatId];
            const isSelected = selectedSeats.includes(seatId);
            const isAvailable = seatData?.is_available ?? false;
    
            return (
                <div
                  key={seatId}
                  onClick={() => isAvailable && seatHandler(seatId, seatData?.id)}
                  className={`seats cursor-pointer ${
                    !isAvailable
                      ? "bg-[#4E4B66] cursor-not-allowed"
                      : isSelected
                      ? "bg-[#1D4ED8]"
                      : "bg-[#D6D8E7]"
                  }`}
                />
            )
          })
        )
    
    const changeMovie = () => {
        navigate("/movies")
    }

    const [seatData, setSeatData] = useState({
        seats: [],
        price: 35000,
        total: 0,
        bookedSeats: []
    })

    useEffect(() => {
      setSeatData((prev) => ({
        ...prev,
        total: prev.seats.length * prev.price
      }))
       console.log("Dispatched seats data", {
          seats: seatData.seats,
          price: seatData.price,
          total: seatData.total
        });
    }, [seatData.seats])

    const buttonClicked = () => {
        if (seatData.seats.length === 0) return alert("Please select at least one seat")
        setIsModalOpen(true);
    }

    const nextPage = () => {
        dispatch(storeSeatsDetails({
          seats: seatData.seats,
          price: seatData.price,
          total: seatData.seats.length * seatData.price
        }))
        navigate("/payment")
    }

  return (
    <>
        <section className='w-full md:w-3/4 rounded-md bg-[#fff] py-[5vh] px-[2vw]'>
            <div className='ticket'>
                <div className='col-span-1 row-span-3 flex justify-center items-center h-full md:overflow-hidden md:pr-[2vw] pb-[2vh]'>
                    <img className='object-cover object-top w-full h-full' src={moviePoster || "/logo.png"} alt={movieTitle || "Movie Poster"} />
                </div>
                <p className='md:col-span-2 row-span-1 font-semibold text-2xl text-center md:text-left text-[#000]'>{movieTitle || ""}</p>
                <div className='md:col-span-2 row-span-1 flex flex-row items-center justify-center md:justify-start'>
                    {movieGenres 
                        ? movieGenres.split(", ").map((genre, idx) => (
                            <div key={idx} className="movie-genre">{genre}</div>
                          ))
                        : <div className="text-gray-500">No Genre Available</div>}
                </div>
                <p className='col-span-1 row-span-1 my-[2vh] text-center md:text-left'>Regular - {bookTime || ""}</p>
                <button onClick={changeMovie} className='custom-button col-span-1 row-span-1 py-[1vh] bg-[#1D4ED8] text-[#fff] text-sm font-normal'>Change</button>
            </div>
            <div>
                <p className='font-medium text-lg md:text-2xl text-[#14142B] my-[5vh] mx-[2vw]'>Choose Your Seat</p>
                <div className='px-[1vw]'>
                    <p className='hidden md:block font-semibold text-[#4E4B66] text-center w-4/5'>Screen</p>
                    <div className='flex flex-row'>
                        <div className='hidden md:block flex flex-col mt-[4vh]'>
                            {rows.map((row) => (
                                <div key={row} className='seats bg-transparent my-[2vh]'>{row}</div>
                            ))}
                        </div>
                        <div className="flex flex-row justify-between w-full md:w-2/3">
                          {error && <p className="text-red-500">{error}</p>}

                          {/* LEFT BLOCK */}
                          <div  className="grid mt-[5vh] border-b border-[red] md:border-none" style={{ gridTemplateColumns: `repeat(${colsLeft.length}, 1fr)` }}>
                            {renderSeatGrid(colsLeft)}
                            {colsLeft.map((col) => (
                              <div key={col} className="hidden md:block seats bg-transparent text-center">
                                {col}
                              </div>
                            ))}
                          </div>
                        
                          {/* RIGHT BLOCK */}
                          <div className="grid mt-[5vh] border-b border-[red] md:border-none" style={{ gridTemplateColumns: `repeat(${colsRight.length}, 1fr)` }}>
                            {renderSeatGrid(colsRight)}
                            {colsRight.map((col) => (
                              <div key={col} className="hidden md:block seats bg-transparent text-center">
                                {col}
                              </div>
                            ))}
                          </div>
                        </div>
                    </div>
                </div>
                <div className='md:text-lg my-[5vh] mx-[2vw]'>
                    <p className='font-medium md:font-normal'>Seating key</p>
                    <div className='flex flex-row justify-evenly md:justify-center '>
                        <div className='flex flex-col md:flex-row mt-[5vh]'>
                            <div className='md:hidden flex flex-row items-center'>
                                <div className='mr-[2vw] md:mr-[1vw]'><img src={Down} alt="" /></div>
                                <div>A - G</div>
                            </div>
                            <div className='flex flex-row items-center mt-[2vh] mr-[1vw]'>
                                <div className='mr-[2vw] md:mr-[1vw] rounded-sm w-[20px] h-[20px] bg-[#D6D8E7]'></div>
                                <div>Available</div>
                            </div>
                            <div className='flex flex-row mt-[2vh] mr-[1vw]'>
                                <div className='mt-[1vh] mr-[2vw] md:mr-[1vw] rounded-sm w-[20px] h-[20px] bg-[#F589D7]'></div>
                                <div>Love nest</div>
                            </div>
                        </div>
                        <div className='flex flex-col md:flex-row mt-[5vh]'>
                            <div className='md:hidden flex flex-row items-center'>
                                <div className='mr-[2vw] md:mr-[1vw]'><img src={Right} alt="" /></div>
                                <div>1 - 14</div>
                            </div>
                            <div className='flex flex-row mt-[2vh] mr-[1vw]'>
                                <div className='mt-[1vh] mr-[2vw] md:mr-[1vw] rounded-sm w-[20px] h-[20px] bg-[#1D4ED8]'></div>
                                <div>Selected</div>
                            </div>
                            <div className='flex flex-row mt-[2vh] mr-[1vw]'>
                                <div className='mt-[1vh] mr-[2vw] md:mr-[1vw] rounded-sm w-[20px] h-[20px] bg-[#4E4B66]'></div>
                                <div>Sold</div>
                            </div>
                        </div>
                    </div>
                    <button onClick={buttonClicked} disabled={seatData.seats.length === 0} className='md:hidden custom-button bg-[#1D4ED8] text-sm text-[#fff] text-center py-[1vh] mt-[5vh] w-full'>Submit</button>
                </div>
            </div>
        </section>
        <div className='hidden md:block w-1/4 pl-[2vw]'>
          <section className='rounded-md bg-[#fff]'>
              <div className='py-[5vh] px-[5vw]'>
                  <img src={`/${bookCinema || "logo"}.svg`} alt={bookCinema || "Cinema"} />
              </div>
              <div className='py-[2vh] px-[2vw]'>
                  <div className='flex flex-row justify-between mb-[3vh]'>
                      <div className='text-xs text-[#6B6B6B]'>Movie selected</div>
                      <div className='font-semibold text-xs text-right text-[#14142B]'>{movieTitle || ""}</div>
                  </div>
                  <div className='flex flex-row justify-between mb-[3vh]'>
                  <div className='text-xs text-[#6B6B6B]'>
                      {bookDate
                          ? new Date(bookDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                          })
                          : "No date selected"}
                  </div>
                      <div className='font-semibold text-xs text-center text-[#14142B]'>{bookTime || ""}</div>
                  </div>
                  <div className='flex flex-row justify-between mb-[3vh]'>
                      <div className='text-xs text-[#6B6B6B]'>One ticket price</div>
                      <div className='font-semibold text-xs text-center text-[#14142B]'>Rp {seatData.price}</div>
                  </div>
                  <div className='flex flex-row justify-between mb-[3vh]'>
                      <div className='text-xs text-[#6B6B6B]'>Seat choosed</div>
                      <div className='font-semibold text-xs text-right text-[#14142B]'>
                        {[...(seatData.seats || [])]
                          .map((s) => s.seat)
                          .sort((left, right) => {
                            const [rowLeft, colLeft] = [left[0], parseInt(left.slice(1), 10)];
                            const [rowRight, colRight] = [right[0], parseInt(right.slice(1), 10)];
                            return rowLeft > rowRight
                              ? 1
                              : rowLeft < rowRight
                              ? -1
                              : colLeft - colRight;
                          })
                          .join(", ") || "No seat selected"}
                    </div>
                  </div>
              </div>
              <div className='flex flex-row justify-between items-center py-[2vh] px-[2vw] border-t border-solid border-[#E6E6E6]'>
                  <div>Total Payment</div>
                  <div className='font-semibold text-[#1D4ED8] text-right'>Rp {seatData.total.toLocaleString()}</div>
              </div>
              <button onClick={nextPage} disabled={seatData.seats.length === 0} className='custom-button my-[6vh] mx-[2vw] py-[2vh] w-4/5 text-[#fff] text-sm bg-[#1D4ED8]'>Checkout now</button>
          </section>
      </div>
      {isModalOpen && (
        <div className='absolute inset-0 bg-[#00000099] flex justify-center items-center z-3'>
            <section className='bg-[#fff] rounded-md absolute top-1/2 left-1/2 py-[5vh] px-[5vw] md:px-[3vw] transform -translate-x-1/2 -translate-y-1/2 z-4'>
                <div className='py-[5vh] px-[5vw]'>
                    <img src={`/${bookCinema || "logo"}.svg`} alt={bookCinema || "Cinema"} />
                </div>
                <div className='py-[2vh] px-[2vw]'>
                    <div className='flex flex-row justify-between mb-[3vh]'>
                        <div className='text-xs text-[#6B6B6B]'>Movie selected</div>
                        <div className='font-semibold text-xs text-right text-[#14142B]'>{movieTitle || ""}</div>
                    </div>
                    <div className='flex flex-row justify-between mb-[3vh]'>
                    <div className='text-xs text-[#6B6B6B]'>
                        {bookDate
                            ? new Date(bookDate).toLocaleDateString("en-US", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })
                            : "No date selected"}
                    </div>
                        <div className='font-semibold text-xs text-center text-[#14142B]'>{bookTime || ""}</div>
                    </div>
                    <div className='flex flex-row justify-between mb-[3vh]'>
                        <div className='text-xs text-[#6B6B6B]'>One ticket price</div>
                        <div className='font-semibold text-xs text-center text-[#14142B]'>Rp {seatData.price}</div>
                    </div>
                    <div className='flex flex-row justify-between mb-[3vh]'>
                        <div className='text-xs text-[#6B6B6B]'>Seat choosed</div>
                        <div className='font-semibold text-xs text-right text-[#14142B]'>                        
                        {[...(seatData.seats || [])]
                          .map((s) => s.seat)
                          .sort((left, right) => {
                            const [rowLeft, colLeft] = [left[0], parseInt(left.slice(1), 10)];
                            const [rowRight, colRight] = [right[0], parseInt(right.slice(1), 10)];
                            return rowLeft > rowRight
                              ? 1
                              : rowLeft < rowRight
                              ? -1
                              : colLeft - colRight;
                          })
                          .join(", ") || "No seat selected"}
                        </div>
                    </div>
                </div>
                <div className='flex flex-row justify-between items-center py-[2vh] px-[2vw] border-t border-solid border-[#E6E6E6]'>
                    <div>Total Payment</div>
                    <div className='font-semibold text-[#1D4ED8] text-right'>Rp {seatData.total.toLocaleString()}</div>
                </div>
                <button onClick={nextPage} disabled={seatData.seats.length === 0} className='custom-button my-[6vh] mx-[2vw] py-[2vh] w-9/10 text-[#fff] text-sm bg-[#1D4ED8]'>Checkout now</button>
            </section>
        </div>
    )}
    </>
  )
}

export default Seats
