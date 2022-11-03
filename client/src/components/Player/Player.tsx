import { Box, Flex, Button, Heading, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { MdGraphicEq } from 'react-icons/md'
import { useState ,useRef, useEffect, useCallback } from "react";
import classNames from "classnames/bind";
import styles from './styles.module.scss';
import { FaPlay, FaPause } from 'react-icons/fa';
import { BsMusicNoteList } from 'react-icons/bs';
import { HiSpeakerWave } from 'react-icons/hi2';
import {TiArrowShuffle , TiArrowLoop } from 'react-icons/ti'
import { IoPlayBack, IoPlayForward, IoPlaySkipBack, IoPlaySkipForward } from 'react-icons/io5';
import { useContext } from 'react'
import { ContextStore } from 'store/context'
import { calculateTime } from "utils/helpers/common";
import QueueBox from "components/QueueBox/QueueBox";

const Player = () => {
    const cx = classNames.bind(styles)
    const audioRef = useRef<HTMLAudioElement>(null);
    const [currentTime, setCurrentTime] = useState<number>(0.0)
    const [isLoop, setLoop] = useState<boolean>(false)
    const [canPlay, setCanPlay] = useState<boolean>(false)
    const endpoint = 'http://localhost:4000'
    const {shuffle, state, updateCurrentSong, updateIsPlaying} = useContext(ContextStore)

    const { artist, filePath, title, id } = state.currentSong!
    const { isOpen: isOpenQueue, onClose: closeQueue, onOpen: openQueue } = useDisclosure()

    const toggleQueue = () => {
        if(isOpenQueue) {
            closeQueue()
        }else {
            openQueue()
        }
    }

    // 0 - No information is available about the media resource.
    // 1 - Enough of the media resource has been retrieved that 
    //      the metadata attributes are initialized. 
    //      Seeking will no longer raise an exception.
    // 2 - Data is available for the current playback position, 
    //      but not enough to actually play more than one frame.
    // 3 - Data for the current playback position as well as for 
    //      at least a little bit of time into the future is available.
    // 4 - Enough data is available—and the download rate is high enough
    //      that the media can be played through to the end without interruption.
    useEffect(() => {
     if(audioRef.current?.networkState === 2 || 4 && state.isPlaying){
        audioPlay()
     }
    }, [audioRef.current?.networkState])

    
    const audioPlay = () => {
        const audio = audioRef.current
        if(audio){
            setCurrentTime(audio.currentTime)
            audio.play()
        }
    }

    const audioStop = () => {
        const audio = audioRef.current
        if(audio){
            audio.pause()
            setCurrentTime(audio.currentTime)
        }
    }

    useEffect(() => {
        handleToggleAudio()
    }, [state.isPlaying])
    

    const handleToggleAudio = () =>{
        if (!state.isPlaying) {
            audioStop()
        }else{
            audioPlay()
        }
    }

    const handleTogglePlay = () => {
        if (state.isPlaying) {
            updateIsPlaying(false)
        }else{
            updateIsPlaying(true)
        }

    }
    const handleChangeRange = (time: number) =>{
        if (audioRef.current){
            audioRef.current.currentTime = time
        }
        setCurrentTime(time)
    }

    const playBack  = () =>{
        const audio = audioRef.current
        if (audio){
            audio.currentTime -= 5 
            setCurrentTime(audio.currentTime)
        }
    }

    const playNext = () => {
        const audio = audioRef.current
        if (audio){
            audio.currentTime += 5 
            setCurrentTime(audio.currentTime)
        }
    }

    const handleSufflePlaylist = () => {
        shuffle()
    }

    const nextSong = () => {
        const nextIndex = state.queue.findIndex((song)=> song.id === id) + 1
        if (nextIndex > state.queue.length - 1) return;
        updateCurrentSong(state.queue[nextIndex].id )
        setTimeout(() => audioPlay(), 2000)
    }

    const prevSong = () => {
        const prevIndex = state.queue.findIndex((song)=> song.id === id) - 1
        if (prevIndex < 0 ) return;
        updateCurrentSong(state.queue[prevIndex].id)
        audioPlay()
    }

    const onEndedSong = () => {
        if(isLoop) return;
        nextSong()
    }

    const selectSong = useCallback((id: string) => {
        audioStop()
        updateCurrentSong(id)
        audioPlay()
    }, [id])
   
    useEffect(() =>  {
      let timerId: number
      if(state.isPlaying){

        const f = ()=>{
            const audio = audioRef.current
            if(audio){
                audio.volume = 0.5
                setCurrentTime(audio.currentTime)
            }
            timerId = requestAnimationFrame(f)
        }
        timerId = requestAnimationFrame(f)
        return () => cancelAnimationFrame(timerId)
      }
      return () => cancelAnimationFrame(timerId)
    }, [state.isPlaying])

  return (
    <Box className={cx('player')}>
        <Flex direction={'row'}  height={'100%'} alignItems={'center'} justifyContent={'space-around'}>
            <Box w={500}>
                <Heading size={'lg'} color={'pink.200'} noOfLines={1}>{title}</Heading>
                <Heading size={'sm'} color={'pink.100'} noOfLines={1}>{artist}</Heading>
            </Box>
            <Box w={600}>
                <Stack direction={'row'} justifyContent={'center'} mb={2}>
                    <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} onClick={handleSufflePlaylist}>
                        <TiArrowShuffle color="white" size={'20px'}/>
                    </Button>
                    <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} onClick={prevSong}>
                        <IoPlaySkipBack color="white"/>
                    </Button>
                    <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} onClick={playBack}>
                        <IoPlayBack color="white"/>
                    </Button>
                    <Button 
                        onClick={handleTogglePlay} 
                        borderRadius={'50%'}
                        w={'45px'}
                        h={'45px'}
                    >
                        {!state.isPlaying ? <FaPlay/> : <FaPause/> }
                    </Button>
                    <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} onClick={playNext}>
                        <IoPlayForward color="white"/>
                    </Button>
                    <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} onClick={nextSong}>
                        <IoPlaySkipForward color="white" />
                    </Button>
                    <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} onClick={()=>setLoop(prev => !prev)}>
                        <TiArrowLoop style={{ color: isLoop ? '#67FF9D' : 'white'}} size={'22px'}/>
                    </Button>
                </Stack>
                <Stack direction={'row'} w={'100%'}>
                    <Box mr={3}>
                        <Text color="white">{calculateTime(audioRef.current?.currentTime || 0)}</Text>
                    </Box>
                    <Slider 
                            value={currentTime} 
                            defaultValue={0} 
                            min={0} 
                            max={audioRef.current?.duration} 
                            step={5}
                            onChange={handleChangeRange}
                            onChangeStart={audioStop}
                            onChangeEnd={audioPlay}
                        >
                            <SliderTrack  bg='red.100'  >
                                <SliderFilledTrack bg='green.200'/>
                            </SliderTrack>
                            <SliderThumb boxSize={5}>
                                <Box color='blue.300' as={MdGraphicEq} />
                            </SliderThumb>
                    </Slider>
                    <Box ml={3}>
                        <Text color="white">{calculateTime(audioRef.current?.duration || 0)}</Text>
                    </Box>
                </Stack>
                
                <audio 
                    ref={audioRef} 
                    src={`${endpoint}${filePath}`}
                    onEnded={onEndedSong} 
                    loop={isLoop}
                    preload={'metadata'}
                />
            </Box>
            <Box w={500} position={'relative'}>
                <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} >
                    <HiSpeakerWave color="white"/>
                </Button>
                <Button bg={'transparent'} _hover={{backgroundColor: 'none'}} onClick={toggleQueue} >
                    <BsMusicNoteList color="white"/>
                </Button>
                <QueueBox 
                isOpen={isOpenQueue} 
                queueList={state.queue} 
                playingId={id}
                selectSong={selectSong}
                />
            </Box>
        </Flex>
    </Box>
    )
}

export default Player