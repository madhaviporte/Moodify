import { children } from "react";
import { createContext } from "react";
import { useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({ children }) => {

    const [song, setSong] = useState({
        
   "_id": {
    "$oid": "69b19eb6d0f6764664b5dff4"
            },
     "url": "https://ik.imagekit.io/tcidpbq78/cohort-2/moodify/song/Khaamiyan_yZV9o-VJa.mp3",
    "posterUrl": "https://ik.imagekit.io/tcidpbq78/cohort-2/moodify/posters/Khaamiyan_tV_L9-mV7.jpeg",
    "title": "Khaamiyan",
     "mood": "happy",
        })

        const [loading,setLoading] = useState(false)

        return (
            <SongContext.Provider
            value={{loading,setLoading,song,setSong}}
            >
                {children}
            </SongContext.Provider>
        )
}