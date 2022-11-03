import { Box } from "@chakra-ui/react"
import { ReactNode } from "react"

interface IProps{
  children: ReactNode
  maxW: string
  w: string
  mt: number
  mx: string
}
const Wrapper = ({children, maxW, w ,mt ,mx}: IProps)=> {
  return (
    <Box maxW={maxW} w={w} mt={mt} mx={mx}>{children}</Box>
  )
}


export default Wrapper
