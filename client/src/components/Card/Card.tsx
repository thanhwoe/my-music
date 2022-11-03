import { Box, Button, Heading, Image, Stack, Icon } from "@chakra-ui/react";
import styles from './styles.module.scss';
import classNames from "classnames/bind";
import { images } from "assets";
import { useState } from "react";
import { ISong } from 'types/song'
import { BsYoutube } from 'react-icons/bs';
import { ImSoundcloud } from 'react-icons/im';
import { useContext } from 'react'
import { ContextStore } from 'store/context'

interface IProps {
    song: ISong
}
const Card = ({song}: IProps) => {
    const cx = classNames.bind(styles)
    const { state, updateCurrentSong, updateIsPlaying } = useContext(ContextStore)

    const isSongPlaying = state.isPlaying && song.id === state.currentSong?.id

    const handlePlaySong = () => {
        if(state.isPlaying) { 
            updateIsPlaying(false)
            return;
        }
        updateCurrentSong(song.id)
        updateIsPlaying(true)
    }

    return (
        <Box className={cx('card')}>
            <Box className={cx('card__point')}>
                <Image src={images.point.src} className={cx('point')}/>
                <Image src={images.pointActive.src} className={[cx('pointActive'), 'pointActive'].join(' ')}/>
            </Box>
            <Stack className={cx('card__content')}>
                <Box my={5}>
                    <Heading 
                        noOfLines={1}
                        w={300}
                        textAlign={'center'}
                        size={'md'}
                    > {song.title}
                    </Heading>
                </Box>
                <Image src={song.thumbnail} className={isSongPlaying ? cx('playing') : cx('pause')}/>
                <Box py={5}>
                    <Button onClick={handlePlaySong} >{!isSongPlaying ? 'Play' : 'Pause'}</Button>
                </Box>
                {song.provider === 'youtube' ?
                    <Icon as={BsYoutube} className={cx('provider','--yt')}/>
                    :
                    <Icon as={ImSoundcloud} className={cx('provider','--sc')}/>
                }
            </Stack>
        </Box>
    )
}

export default Card