import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import QR from '../../assets/qr.png'
import Download from '../../assets/Download.png'

function Ticket() {
    const book = useSelector((state) => state.book)
    const movieTitle = book?.title
    const bookDate = book?.date
    const bookTime = book?.time
    const seatnums = book?.seats.map(seat => seat.seat)
    const seatids = book?.seats.map(seat => seat.seat_id)
    const total = book?.total

    const navigate = useNavigate()
    const nextPage = () => {
        navigate("/")
    }

  return (
    <section className='md:w-2/5 py-[10vh] px-[10vw]'>
        <div className='bg-[#fff] py-[5vh] px-[3vw]'>
            <div className='pb-[3vh] border-b-3 border-dashed border-[#DEDEDE]'><img src={QR} alt="QR Ticket" /></div>
            <div className='ticket-grid gap-[1vw] mt-[3vh]'>
                <div>
                    <div className='font-normal text-xs text-[#AAAAAA]'>Movie</div>
                    <div className='font-normal text-sm text-[#14142B] mt-[1vh] mb-[2vh]'>{movieTitle}</div>
                </div>
                <div>
                    <div className='font-normal text-xs text-[#AAAAAA]'>Category</div>
                    <div className='font-normal text-sm text-[#14142B] mt-[1vh] mb-[2vh]'>PG-13</div>
                </div>
                <div>
                    <div className='font-normal text-xs text-[#AAAAAA]'>Date</div>
                    <div className='font-normal text-sm text-[#14142B] mt-[1vh] mb-[2vh]'>{bookDate ? new Date(bookDate).toLocaleDateString("en-US", {day: "numeric", month: "long"}) : "No date selected"}</div>
                </div>
                <div>
                    <div className='font-normal text-xs text-[#AAAAAA]'>Time</div>
                    <div className='font-normal text-sm text-[#14142B] mt-[1vh] mb-[2vh]'>{bookTime}</div>
                </div>
                <div>
                    <div className='font-normal text-xs text-[#AAAAAA]'>Count</div>
                    <div className='font-normal text-sm text-[#14142B] mt-[1vh] mb-[2vh]'>{`${seatids.length} pcs`}</div>
                </div>
                <div>
                    <div className='font-normal text-xs text-[#AAAAAA]'>Seats</div>
                    <div className='font-normal text-sm text-[#14142B] mt-[1vh] mb-[2vh]'>{seatnums.join(", ")}</div>
                </div>
                <div className='col-span-2 flex flex-row justify-around items-center border border-solid border-[#DEDEDE] rounded-sm m-[0]'>
                    <div className='font-normal text-xs text-[#AAAAAA]'>Total</div>
                    <div className='font-normal text-sm text-[#14142B] mt-[1vh] mb-[2vh]'>{`Rp ${total}`}</div>
                </div>
            </div>
        </div>
        <div className='flex flex-col w-full my-[7vh]'>
            <button className='custom-button flex flex-row items-center justify-center font-semibold text-sm text-[#1D4ED8] py-[2vh] md:py-[1vh] mb-[2vh]'>
                <img className='w-1/20 md:w-1/10 h-1/20 md:h-1/10 mr-[1vw]' src={Download} alt="Download" />
                <p>Download</p>
            </button>
            <button onClick={nextPage} className='custom-button flex flex-row items-center justify-center font-semibold text-sm text-[#fff] bg-[#1D4ED8] py-[2vh] md:py-[1vh]'>Done</button>
        </div>
    </section>
  )
}

export default Ticket
