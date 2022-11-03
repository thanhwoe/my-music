import { createContext, ReactNode, useReducer, useEffect, } from "react";
import { ISong } from 'types/song'
import reducer from "./reducer";
import { useSongsQuery } from "generated/graphql";
import { actionType } from "./actionTypes";
import { ApolloError } from "@apollo/client";
import { shuffleArray } from "utils/helpers/common";

export interface IStore {
    playlist: ISong[]
    queue: ISong[]
    currentSong: ISong | undefined
    isPlaying : boolean
    loading: boolean
    error: ApolloError | undefined
}

interface IContext {
    state: IStore
    updatePlaylist: () => void
    updateQueue: () => void
    updateCurrentSong: (id:string) => void
    updateIsPlaying: (status: boolean) => void
    shuffle: () => void
}

interface IProps {
    children: ReactNode
}

const initialStore : IStore = {
    playlist: [],
    queue: [],
    currentSong: undefined,
    isPlaying: false,
    loading: true,
    error: undefined
}

const initialContext: IContext = {
    state : initialStore,
    updatePlaylist: () => {},
    updateQueue: () => {},
    updateCurrentSong: () => {},
    updateIsPlaying: () => {},
    shuffle: () => {}
}

export const ContextStore = createContext<IContext>(initialContext)

const Context = ({children}: IProps) =>{
    const [state, dispatch] = useReducer(reducer, initialStore)
    const {data: songs, loading, error}= useSongsQuery()
    const {UPDATE_CURRENT_SONG, UPDATE_ISPLAYING, UPDATE_PLAYLIST, SHUFFLE, UPDATE_QUEUE} = actionType

    useEffect(() => {
        if (songs && !state.currentSong){
            updatePlaylist()
            updateQueue()
            updateCurrentSong(songs.songs[0].id)
        }
    }, [songs, state.playlist])

    const updateQueue = () => {
        dispatch({
            type: UPDATE_QUEUE,
            payload: {...state, queue :songs!.songs, loading, error}
        })
    }

    const updatePlaylist = () => {
        dispatch({
            type: UPDATE_PLAYLIST,
            payload: {...state, playlist :songs!.songs, loading, error}
        })
    }
    const updateCurrentSong = (id: string) => {
        const getCurrentSong = state.playlist.find((song) => song.id === id)
        dispatch({
            type: UPDATE_CURRENT_SONG,
            payload: {...state, currentSong : getCurrentSong}
        })

    }
    const updateIsPlaying = (status: boolean) => {
        dispatch({
            type: UPDATE_ISPLAYING,
            payload: {...state, isPlaying: status}
        })
    }
    const shuffle = () => {
        const newPlaylist = shuffleArray(state.playlist)
        dispatch({
            type: SHUFFLE,
            payload: {...state, queue: newPlaylist}
        })
    }

    const contextValue: IContext ={
        state,
        updatePlaylist,
        updateCurrentSong,
        updateIsPlaying,
        shuffle,
        updateQueue
    }

    return (
        <ContextStore.Provider value={contextValue}>
            {children}
        </ContextStore.Provider>
    )
}

export default Context