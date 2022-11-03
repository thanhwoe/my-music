import { Formik, Form, FormikHelpers } from 'formik'
import Wrapper from '../components/Wrapper'
import Input from '../components/Input/Input'
import { Button } from '@chakra-ui/react'
import {GetMeDocument, GetMeQuery, RegisterInput, useRegisterMutation } from '../generated/graphql'
import { mapErrors } from '../utils/helpers/mapErrors'
import { useRouter } from 'next/router'

const Register = ()=>{

  const router = useRouter()
  const initValues: RegisterInput = {username:'', email:'', password:''}
  const [registerUser, {error}] = useRegisterMutation()
  const onRegisterSubmit = async (
    value: RegisterInput,
    {setErrors}: FormikHelpers<RegisterInput>
    ) =>{
    const response = await registerUser({
      variables: {
        registerInput: value
      },
      update(cache, {data}){
        if(data?.register.success){
          cache.writeQuery<GetMeQuery>({
            query: GetMeDocument,
            data: {getMe: data.register.user}
          })
        }
      }
    })
    if (response.data?.register?.errors){
      setErrors(mapErrors(response.data.register.errors))
    }
    if (response.data?.register?.user){
      router.push('/')
    }
  }

  return(
    <Wrapper maxW='400px' w='100%' mt={8} mx='auto'>
      {error && <p>error</p>}
      <Formik 
      initialValues={initValues}
      onSubmit={onRegisterSubmit}
      >
        {({isSubmitting})=>(
          <Form>
            <Input
                name='username'
                placeholder='Username'
                label='Username'
                type='text'
            />
            <Input
              name='email'
              placeholder='Email'
              label='Email'
              type='text'
            />
            <Input
              name='password'
              placeholder='Password'
              label='Password'
              type='password'
            />
            <Button type='submit' mt={4} isLoading={isSubmitting} >Register</Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
    
  )
}

export default Register