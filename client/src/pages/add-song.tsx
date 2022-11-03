import { Flex, Spinner, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import Input from '../components/Input/Input'
import { useAuth } from '../utils/hook/useAuth'
import Link from 'next/link'
import Layout from 'components/Layout/Layout'
import { useCreateSongMutation, CreateSongInput } from 'generated/graphql'

const AddSong = () => {
	const { data: authData, loading: authLoading } = useAuth()

	const initialValues = { source: '' }

	const [createSong, _] = useCreateSongMutation()

	// const [createPost, _] = useCreatePostMutation()

	// const onCreatePostSubmit = async (values: CreatePostInput) => {
	// 	await createPost({
	// 		variables: { createPostInput: values },
	// 		update(cache, { data }) {
	// 			cache.modify({
	// 				fields: {
	// 					posts(existing) {
	// 						if (data?.createPost.success && data.createPost.post) {
	// 							// Post:new_id
	// 							const newPostRef = cache.identify(data.createPost.post)

	// 							const newPostsAfterCreation = {
	// 								...existing,
	// 								totalCount: existing.totalCount + 1,
	// 								paginatedPosts: [
	// 									{ __ref: newPostRef },
	// 									...existing.paginatedPosts // [{__ref: 'Post:1'}, {__ref: 'Post:2'}]
	// 								]
	// 							}

	// 							return newPostsAfterCreation
	// 						}
	// 					}
	// 				}
	// 			})
	// 		}
	// 	})
	// 	router.push('/')
	// }
    const onSubmit = async (values : CreateSongInput) => {
		await createSong({
			variables: {
				createSongInput: values
			}
		})
    }

	if (authLoading || (!authLoading && !authData?.getMe)) {
		return (
			<Flex justifyContent='center' alignItems='center' minH='100vh'>
				<Spinner />
			</Flex>
		)
	} else {
		return (
            <Layout>
                <Formik initialValues={initialValues} onSubmit={onSubmit}>
                    {({ isSubmitting }) => (
                        <Form>
                            <Input
                                name='source'
                                placeholder='URL'
                                label='Url'
                                type='text'
                            />
                            <Flex justifyContent='space-between' alignItems='center' mt={4}>
                                <Button
                                    type='submit'
                                    colorScheme='teal'
                                    isLoading={isSubmitting}
                                >
                                    Add song
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Layout>

		)
	}
}

export default AddSong