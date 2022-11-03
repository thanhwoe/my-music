import { Flex, Spinner, Box, Button } from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import { UpdatePostInput, useUpdatePostMutation, usePostQuery } from 'generated/graphql'
import Input from 'components/Input/Input'
import Link from 'next/link'
import { useRouter } from 'next/router'

const EditPost = () => {

  const router = useRouter()
	const postId = router.query.id as string
  const { data: postData, loading} = usePostQuery({
		variables: { id: postId }
	})
	const [updatePost, _] = useUpdatePostMutation()


  if (!postData?.post || loading)
		return (
				<Box mt={4}>
					<Link href='/'>
						<Button>Back to Homepage</Button>
					</Link>
				</Box>
		)
	const initialValues = {
		title: postData.post.title,
		description: postData.post.description
	}

  const onUpdatePostSubmit = async (values: Omit<UpdatePostInput, 'id'>) => {
    await updatePost({
			variables: {
				updatePostInput: {
					id: postId,
					...values
				}
			}
		})
		router.back()
  }

  return (
    <Formik initialValues={initialValues} onSubmit={onUpdatePostSubmit}>
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
									Update Post
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

export default EditPost