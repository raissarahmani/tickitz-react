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
            const {scheduleId, date, time, cityId, location, cinemaId, cinema} = action.payload

            state.scheduleId = scheduleId
            state.date = date
            state.time = time
            state.cityId - cityId
            state.location = location
            state.cinemaId = cinemaId
            state.cinema = cinema
        },
        storeSeatsDetails: (state, action) => {
            const {seats, total} = action.payload

            state.seats = seats
            state.total = total
        },
        resetData: () => initialState
    }
})

export const {storeMovieDetails, storeBookDetails, storeSeatsDetails, resetData} = bookingSlice.actions
export default bookingSlice.reducer