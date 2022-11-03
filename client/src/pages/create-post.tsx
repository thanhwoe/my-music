import { Flex, Spinner, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { CreatePostInput, useCreatePostMutation } from '../generated/graphql'
import router from 'next/router'
import Input from '../components/Input/Input'
import { useAuth } from '../utils/hook/useAuth'
import Link from 'next/link'

const CreatePost = () => {
	const { data: authData, loading: authLoading } = useAuth()

	const initialValues = { title: '', description: '' }

	const [createPost, _] = useCreatePostMutation()

	const onCreatePostSubmit = async (values: CreatePostInput) => {
		await createPost({
			variables: { createPostInput: values },
			update(cache, { data }) {
				cache.modify({
					fields: {
						posts(existing) {
							if (data?.createPost.success && data.createPost.post) {
								// Post:new_id
								const newPostRef = cache.identify(data.createPost.post)

								const newPostsAfterCreation = {
									...existing,
									totalCount: existing.totalCount + 1,
									paginatedPosts: [
										{ __ref: newPostRef },
										...existing.paginatedPosts // [{__ref: 'Post:1'}, {__ref: 'Post:2'}]
									]
								}

								return newPostsAfterCreation
							}
						}
					}
				})
			}
		})
		router.push('/')
	}

	if (authLoading || (!authLoading && !authData?.getMe)) {
		return (
			<Flex justifyContent='center' alignItems='center' minH='100vh'>
				<Spinner />
			</Flex>
		)
	} else {
		return (
				<Formik initialValues={initialValues} onSubmit={onCreatePostSubmit}>
					{({ isSubmitting }) => (
						<Form>
							<Input
								name='title'
								placeholder='Title'
								label='Title'
								type='text'
							/>

							<Box mt={4}>
								<Input
									textarea
									name='description'
									placeholder='Description'
									label='Description'
									type='textarea'
								/>
							</Box>

							<Flex justifyContent='space-between' alignItems='center' mt={4}>
								<Button
									type='submit'
									colorScheme='teal'
									isLoading={isSubmitting}
								>
									Create Post
								</Button>
								<Link href='/'>
									<Button>Go back to Homepage</Button>
								</Link>
							</Flex>
						</Form>
					)}
				</Formik>
		)
	}
}

export default CreatePost