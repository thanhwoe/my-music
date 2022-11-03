import { ChakraProvider } from '@chakra-ui/react'
import theme from '../theme'
import { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import { useApollo } from '../lib/apolloClient'
import Context from 'store/context'

function MyApp({ Component, pageProps }: AppProps) {

  const client = useApollo(pageProps)
  return (
    <ApolloProvider client={client}>
      <ChakraProvider theme={theme}>
        <Context>
          <Component {...pageProps} />
        </Context>
      </ChakraProvider>
    </ApolloProvider>
  )
}

export default MyApp
