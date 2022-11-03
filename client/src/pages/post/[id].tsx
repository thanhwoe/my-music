import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"
import { PostDocument, PostQuery, PostsQuery, usePostQuery, PostsDocument } from "../../generated/graphql"
import { addApolloState, initializeApollo } from "../../lib/apolloClient"
import { limit } from ".."
const Post = () => {
  const router = useRouter()

  const { data } = usePostQuery(
    {
      variables: {id: router.query.id as string}
    }
  )
  return (
    <div>Post
      <p>{data?.post?.title}</p>
      <p>{data?.post?.description}</p>
      <p>{data?.post?.id}</p>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const apolloClient = initializeApollo()
  const {data} = await apolloClient.query<PostsQuery>({
    query: PostsDocument,
    variables: {limit}
  })
  return {
    paths: data.posts!.paginatedPosts.map(post => ({
      params: {id: `${post.id}`}
    })),
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps<{ [key: string]: any },{ id: string }> = async ({params})=>{
  const apolloClient = initializeApollo()
  await apolloClient.query<PostQuery>({
    query: PostDocument,
    variables: {id: params?.id}
  })
  return addApolloState(apolloClient, {props:{}})
}

export default Post