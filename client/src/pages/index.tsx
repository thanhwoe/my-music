import {
  Stack,
  Flex,
  Button,
  Spinner,
} from '@chakra-ui/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { addApolloState, initializeApollo } from '../lib/apolloClient'
import { PostsDocument, usePostsQuery, useGetMeQuery, useSongsQuery } from '../generated/graphql'
import { NetworkStatus } from '@apollo/client'
import Layout from 'components/Layout/Layout'
import Hero from 'components/Hero/Hero'
import SlideSong from 'components/Slider/SlideSong'
import ListBox from 'components/ListBox/ListBox'
import { useContext } from 'react'
import { ContextStore } from 'store/context'

export const limit = 3

const Index = () => {
  const {data, fetchMore, networkStatus , loading  } = usePostsQuery({
    variables: {limit},
    notifyOnNetworkStatusChange: true
  })
  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore
  const loadMoreData = () => fetchMore({variables:{cursor: data?.posts?.cursor}})

  const {data: meData} = useGetMeQuery()

  const {data: songs}= useSongsQuery()
  const {state} = useContext(ContextStore)
  console.log(state);

  return (
  <Layout>
    <Stack spacing={8}>
      <Hero/>
    {state.loading ? (
      <Flex justifyContent={'center'} alignItems={'center'} minH='100vh'>
        <Spinner/>
      </Flex>
    ):(
      <>
        <SlideSong songs={state.playlist}/>
        <ListBox songs={state.playlist} />
      {/* {data?.posts?.paginatedPosts.map(post=>(
        <Card post={post} key={post.id}/>
      ))} */}
      </>
      )}
    {data?.posts?.hasMore && (
      <Flex >
        <Button mt={'auto'} my={8} isLoading={loadingMorePosts} onClick={loadMoreData}>
          {loadingMorePosts ? 'Loading' : 'Show more'}
        </Button>
      </Flex>
    )}
    </Stack>
  </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
) => {
	const apolloClient = initializeApollo({ headers: context.req.headers })

	await apolloClient.query({
		query: PostsDocument,
		variables: {
			limit
		}
	})

	return addApolloState(apolloClient, {
		props: {}
	})
}


export default Index
