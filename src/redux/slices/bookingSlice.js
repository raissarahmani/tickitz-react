import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    movieId: null,
    poster: "",
    title: "",
    genres: [],
    scheduleId: null,
    date: "",
    time: "",
    cityId: null,
    location: "",
    cinemaId: null,
    cinema: "",
    seats: [],
    price: 0,
    total: 0,
}

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        storeMovieDetails: (state, action) => {
            const {movieId, poster, title, genres} = action.payload

            state.movieId = movieId
            state.poster = poster
            state.title = title
            state.genres = genres
        },
        storeBookDetails: (state, action) => {
            console.log(action.payload)
            const {
                schedule: { id, date, time }, 
                cityId, 
                location, 
                cinemaId, 
                cinema
            } = action.payload

            state.scheduleId = id
            state.date = date
            state.time = time
            state.cityId = cityId
            state.location = location
            state.cinemaId = cinemaId
            state.cinema = cinema
        },
        storeSeatsDetails: (state, action) => {
            const {seats, price, total} = action.payload

            state.seats = seats
            state.price = price
            state.total = total
        },
        resetData: () => initialState
    }
})

export const {storeMovieDetails, storeBookDetails, storeSeatsDetails, resetData} = bookingSlice.actions
export default bookingSlice.reducer