const API_KEY = import.meta.env.VITE_API_KEY
const BASE_URL = import.meta.env.VITE_BASE_URL

export async function getGenre () {
    try {
        const response = await fetch (`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
        if (!response.ok) throw new Error("Failed fetch genre")

        const dataGenre = await response.json()
        if (!dataGenre.genres) throw new Error("No genres found")
        return dataGenre.genres.reduce((acc, genre) => {
            acc[genre.id] = genre.name
            return acc
        }, {})
    } catch (error) {
        console.error(error.message)
        return []
    }
}

export async function getRecomended () {
    try {
        const response = await fetch (`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=1`)
        if(!response.ok) throw new Error ("Fsiled fetch movie")

        const dataTopRate = await response.json()
        if (!dataTopRate) throw new Error ("No movie found")
        return dataTopRate.results
    } 
    catch (error) {
        console.error(error.message)
        return []
    }
}