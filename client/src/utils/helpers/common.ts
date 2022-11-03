import { ISong } from "types/song";

export const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${returnedMinutes}:${returnedSeconds}`;
}

export function shuffleArray(array : ISong[]) {
    const newArray = array
                        .map(value => ({ value, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort)
                        .map(({ value }) => value)
    return newArray
}


export const updatePath = (songs: ISong[]) => {
    const endpoint = 'http://localhost:4000'

     const a  = songs.map((song)=>({
        ...song,
        filePath: `${endpoint}${song.filePath}`
    }))
    
    return a
}