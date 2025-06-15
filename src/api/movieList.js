export const VITE_API_URL = import.meta.env.VITE_API_URL

export async function movieList () {
    try {
        const response = await fetch(`${VITE_API_URL}/movies`, {
          method: "GET",
          headers: {"Content-Type": "application/json"},
        })
        if (!response.ok) throw new Error("Failed fetch movie list")

        const dataMovie = await response.json()
        if (!dataMovie) throw new Error ("No movie found")

        return dataMovie
    } 
    catch (error) {
        console.error (error.message)
    }
}

export async function getDetail (id) {
  try {
    const response = await fetch(`${VITE_API_URL}/movies/${id}`)
    if (!response.ok) throw new Error("Failed fetch detail movie")
    return response.json()
  }
  catch (error) {
    console.error (error.message)
  }
}

export async function nowPlaying () {
  try {
    const response = await fetch(`${VITE_API_URL}/movies/now-playing`)
    if (!response.ok) throw new Error ("Failed fetch movie")

      const dataPlaying = await response.json()
      if(!dataPlaying) throw new Error ("No movie found")

      return dataPlaying
  }
  catch (error) {
    console.error(error.message)
  }
}

export async function upcomingList () {
  try {
      const response = await fetch(`${VITE_API_URL}/movies/upcoming`)
      if (!response.ok) throw new Error ("Failed fetch movie")

      const dataUpcoming = await response.json()
      if(!dataUpcoming) throw new Error ("No movie found")

      return dataUpcoming
  }
  catch (error) {
      console.error(error.message)
  }
}

export async function filterTitle(title = "") {
  try {
    const response = await fetch(`${VITE_API_URL}/movies/filter?title=${encodeURIComponent(title)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
    if (!response.ok) throw new Error("Failed to fetch movie list")

    const dataMovie = await response.json();
    if (!dataMovie) throw new Error("No movie found")

    return dataMovie
  } catch (error) {
    console.error(error.message)
  }
}
