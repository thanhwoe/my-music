import { Container } from "@chakra-ui/react";
import Navbar from "components/Navbar/Navbar";
import Player from "components/Player/Player";
import { ReactNode } from "react";
import styles from './styles.module.scss';
import { useContext } from 'react'
import { ContextStore } from 'store/context'
interface IProps {
    children: ReactNode
}

const Layout = ({children}: IProps) => {
  const {state} = useContext(ContextStore)
  return (
    <div className={styles['layout']}>
    <Navbar/>
    <Container maxW={'container.xl'} minH={'calc(100vh - 20px)'} pt={6}>
      {children}
    </Container>
    {state.currentSong && <Player/>}
    </div>
  )
}

export default Layout