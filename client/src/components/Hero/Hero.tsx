import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { gsap } from "gsap";
import React, { useRef, useEffect } from "react";
import styles from './styles.module.scss'


interface ISprite {
    frame: number
}

const Hero = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    const frameCount = 575;
    const width = canvas?.width || 0
    const height = canvas?.height || 0
    const currentFrame = (index:number) => (
        `/images/sprite/${(index + 1).toString().padStart(4, '0')}.png`
    );
    const images: HTMLImageElement[] = []
    const sprite: ISprite = {
        frame: 0
    };
    const tetst = useRef(sprite)

    function render() {
        context?.clearRect(0, 0, width, height);
        context?.drawImage(images[sprite.frame], 0, 0);
    }
    
    useEffect(() => {
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            images.push(img);
        }
        const ctx = gsap.context(()=>{
            gsap.to(sprite, {
                frame: frameCount -1,
                snap: "frame",
                ease: "none",
                duration: 10,
                repeat: -1,
                onUpdate: render,
            })
        }, canvasRef)
        images[0].onload = () => {
            render() 
        }
        console.log('render');
        return () => ctx.revert()
    })
    console.log('re-render')
    return (
        <Flex className={styles['hero']} direction={'row'} justifyContent={'start'} alignItems='center' w={'100%'}>
            <Flex direction={'column'} >
                <Heading className={styles['heading']} >Feelings are made to be shared</Heading>
                <Text className={styles['description']} color={'green.400'} fontSize='xl'>Start listening
                <svg
                    width="27" height="12" viewBox="0 0 27 12" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M4.87574 0L0.724264 0C0.456993 0 0.323143 0.323143 0.512132 0.512132L5.78787 5.78787C5.90503 5.90503 5.90503 6.09497 5.78787 6.21213L0.512132 11.4879C0.323143 11.6769 0.456993 12 0.724264 12L4.87574 12C4.9553 12 5.03161 11.9684 5.08787 11.9121L10.7879 6.21213C10.905 6.09497 10.905 5.90503 10.7879 5.78787L5.08787 0.087868C5.03161 0.0316071 4.9553 0 4.87574 0Z"
                        fill="#91FFB4" className={styles["arrow1"]} />
                    <path
                        d="M12.8757 0L8.72426 0C8.45699 0 8.32314 0.323143 8.51213 0.512132L13.7879 5.78787C13.905 5.90503 13.905 6.09497 13.7879 6.21213L8.51213 11.4879C8.32314 11.6769 8.45699 12 8.72426 12L12.8757 12C12.9553 12 13.0316 11.9684 13.0879 11.9121L18.7879 6.21213C18.905 6.09497 18.905 5.90503 18.7879 5.78787L13.0879 0.087868C13.0316 0.0316071 12.9553 0 12.8757 0Z"
                        fill="#91FFB4" className={styles["arrow2"]} />
                    <path
                        d="M20.8757 0L16.7243 0C16.457 0 16.3231 0.323143 16.5121 0.512132L21.7879 5.78787C21.905 5.90503 21.905 6.09497 21.7879 6.21213L16.5121 11.4879C16.3231 11.6769 16.457 12 16.7243 12L20.8757 12C20.9553 12 21.0316 11.9684 21.0879 11.9121L26.7879 6.21213C26.905 6.09497 26.905 5.90503 26.7879 5.78787L21.0879 0.087868C21.0316 0.0316071 20.9553 0 20.8757 0Z"
                        fill="#91FFB4" className={styles["arrow3"]} />
                </svg>
                </Text>
            </Flex>
            <Box className={styles['visual']}>
                <Box className={styles['visual__inner']}>
                    <canvas ref={canvasRef} width="1201" height="1201" ></canvas>
                </Box>
            </Box>
        </Flex>
    )
}

export default Hero