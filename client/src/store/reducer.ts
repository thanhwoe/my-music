import { actionType } from "./actionTypes";
import { IStore } from "./context";

const {UPDATE_CURRENT_SONG, UPDATE_ISPLAYING, UPDATE_PLAYLIST, SHUFFLE, UPDATE_QUEUE} = actionType

interface IAction {
    type: string
    payload: IStore
}

export default function reducer(state : IStore, action: IAction) : IStore{
    const {playlist, isPlaying, currentSong, loading, error, queue} = action.payload
    switch(action.type){
        case UPDATE_PLAYLIST:
            return {
                ...state,
                playlist,
                loading,
                error,
            }
        case UPDATE_QUEUE:
            return {
                ...state,
                queue,
                loading,
                error,
            }
        case UPDATE_CURRENT_SONG:
            return {
                ...state,
                currentSong,
                // loading,
                error,
            }
        case SHUFFLE:
            return {
                ...state,
                queue,
                // loading,
                error,
            }
        case UPDATE_ISPLAYING:
            return {
                ...state,
                isPlaying,
                // loading,
                error,
            }
        default:
            throw new Error('invalid action')
    }
}