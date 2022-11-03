import { Formik, Form, FormikHelpers } from 'formik'
import Wrapper from '../components/Wrapper'
import Input from '../components/Input/Input'
import { Button } from '@chakra-ui/react'
import { GetMeDocument, GetMeQuery, LoginInput, useLoginMutation } from '../generated/graphql'
import { mapErrors } from '../utils/helpers/mapErrors'
import { useRouter } from 'next/router'

const Login = ()=>{

  const router = useRouter()
  const initValues: LoginInput = {usernameOrEmail:'', password:''}
  const [loginUser, {error}] = useLoginMutation()
  const onLoginSubmit = async (
    value: LoginInput,
    {setErrors}: FormikHelpers<LoginInput>
    ) =>{
    const response = await loginUser({
      variables: {
        loginInput: value
      },
      update(cache, {data}){
        if(data?.login.success){
          cache.writeQuery<GetMeQuery>({
            query: GetMeDocument,
            data: {getMe: data.login.user}
          })
        }
      }
    })
    if (response.data?.login?.errors){
      setErrors(mapErrors(response.data.login.errors))
    }
    if (response.data?.login?.user){
      router.push('/')
    }
  }

  return(
    <Wrapper maxW='400px' w='100%' mt={8} mx='auto'>
      {error && <p>error</p>}
      <Formik 
      initialValues={initValues}
      onSubmit={onLoginSubmit}
      >
        {({isSubmitting})=>(
          <Form>
            <Input
                name='usernameOrEmail'
                placeholder='Username'
                label='Username'
                type='text'
            />
            <Input
              name='password'
              placeholder='Password'
              label='Password'
              type='password'
            />
            <Button type='submit' mt={4} isLoading={isSubmitting} >Login</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    
  )
}

export default Login