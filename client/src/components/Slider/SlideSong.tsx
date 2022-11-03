import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import styles from './styles.module.scss';
import Slider from 'react-slick';
import classNames from "classnames/bind";
import Card from "components/Card/Card";
import { useState } from "react";
import { ISong } from 'types/song'


interface IProps {
  songs?: ISong[]
}

const SlideSong = ({songs} : IProps) => {
    const cx = classNames.bind(styles)
    const settings = {
      arrows: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1,
      swipeToSlide: true,
      centerPadding: "60px",
      adaptiveHeight:true,
    };
    const [slider, setSlider] = useState<Slider | null>(null);

  return (
    <Box className={cx('slide')}>
        <Flex direction={'row'} className={cx('slide__top')}>
            <Heading className={cx('heading','--backdrop')}>Top Song</Heading>
            <Stack spacing={2} direction={'row'} className={cx('control')}>
                <Box 
                  className={cx('btnSlider', '--prev')} 
                  onClick={()=> slider?.slickPrev()}
                ></Box>
                <Box 
                  className={cx('btnSlider', '--next')}
                  onClick={()=>slider?.slickNext()}
                ></Box>
            </Stack>
        </Flex>
        <Flex direction={'row'} className={cx('slide__list')}>
            <Slider {...settings} ref={(slider) => setSlider(slider)}>
            {songs && songs.map((song)=>(
              <Card key={song.id} song={song}/>
            ))}
          </Slider>
        </Flex>
    </Box>
  )
}


export default SlideSong