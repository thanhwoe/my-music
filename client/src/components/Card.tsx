import {
  Link as ChakraLink,
  Text,
  Code,
  List,
  ListIcon,
  ListItem,
  Stack,
  Flex,
  Heading,
  Box,
  Button,
  Spinner
} from '@chakra-ui/react'
import Link from 'next/link'
import { EditIcon, DeleteIcon } from '@chakra-ui/icons'
import { useGetMeQuery, useDeletePostMutation, PaginatedPosts, PostsDocument} from '../generated/graphql'
import { Reference } from '@apollo/client'

interface IProps {
  post : {
    id: string
    title: string
    user : {
      id: string
      username: string
    }
    description: string
  }
}

const Card = ({post} : IProps) => {
  const {data: meData} = useGetMeQuery()
  const [deletePost, _] = useDeletePostMutation()

  const onDeletePost = async(id: string) => {
    await deletePost({
      variables: {id},
      update(cache , {data}){
        if(data?.deletePost.success){
          cache.modify({
						fields: {
							posts(
								existing: Pick<
									PaginatedPosts,
									'__typename' | 'cursor' | 'hasMore' | 'totalCount'
								> & { paginatedPosts: Reference[] }
							) {
								const newPostsAfterDeletion = {
									...existing,
									totalCount: existing.totalCount - 1,
									paginatedPosts: existing.paginatedPosts.filter(
										postRefObject => postRefObject.__ref !== `Post:${id}`
									)
								}

								return newPostsAfterDeletion
							}
						}
					})
        }
      }

    })
  }

  return (
    <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
          <Box flex={1}>
              <Link href={`/post/${post.id}`}>
                <ChakraLink><Heading fontSize='xl'>{post.title}</Heading></ChakraLink>
              </Link>
              <Text>{post.user.username}</Text>
              <Flex align={'center'}>
                <Text mt={4}>{post.description}</Text>
                {meData?.getMe?.id === post.user.id && (
                  <Box ml='auto'>
                    <Link href={`/post/edit/${post.id}`}>
                      <EditIcon m={2} />
                    </Link>
                    <DeleteIcon m={2} color={'red.500'} onClick={()=>onDeletePost(post.id)}/>
                  </Box>
                )}
              </Flex>
          </Box>
        </Flex>
  )
}


export default Card
