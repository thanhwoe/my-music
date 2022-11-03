import { Box, Popover, Portal, PopoverContent, Text, PopoverBody, PopoverAnchor } from "@chakra-ui/react";
import classNames from "classnames/bind";
import { ISong } from "types/song";
import styles from './styles.module.scss';
import {memo} from 'react'
interface IProps {
    isOpen: boolean
    queueList: ISong[]
    playingId: string
    selectSong: (id:string) => void
}

const QueueBox = memo(({isOpen, queueList, playingId, selectSong} : IProps) => {
    const cx = classNames.bind(styles)
    console.log('object');

    return (
        <Popover isOpen={isOpen} placement='top-start'>
            <PopoverAnchor>
                <Box className={cx('queueAnchor')}></Box>
            </PopoverAnchor>
            <Portal >
                <PopoverContent className={cx('queueBox')}>
                    <PopoverBody>
                        {queueList.map((item)=>(
                            <Box 
                                color={'pink.200'} 
                                p={2} 
                                key={item.id}
                                className={cx(playingId === item.id && 'active')}
                                onClick={selectSong.bind(this, item.id)}
                                cursor={'pointer'}
                            >
                                <Text noOfLines={1} >{item.title}</Text>
                            </Box>
                        ))}
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    )
})
export default QueueBox