import {
    List,
    ListItem,
    Box,
    Flex,
    Text,
    Image,
    Heading
  } from '@chakra-ui/react'
import styles from './styles.module.scss';
import classNames from "classnames/bind";
import { ISong } from 'types/song'


interface IProps {
    songs?: ISong[]
}

const ListBox = ({songs} : IProps) => {
    const cx = classNames.bind(styles)

    return (
        <Box className={cx('listBox')} >
            <Heading className={cx('heading','--backdrop')}>Library</Heading>
            <Flex direction={'row'} p={5} w={'70%'} className={cx('boxWrapper')}>
                <Box><Image src={songs?.[0].thumbnail} h={'188px'} minW={'256px'} /></Box>
                <Box w={'full'} ml={3} >
                    <List overflowY={'scroll'} h={'100%'} className={cx('listItem')}>
                        {songs && songs.map(song => (
                            <ListItem className={cx('item')} key={song.id}>
                                <Text noOfLines={1} color={'pink.200'}>{song.title} - {song.artist}</Text>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Flex>
        </Box>
  )
}

export default ListBox