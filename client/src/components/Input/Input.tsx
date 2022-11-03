
import {
	FormControl,
	FormErrorMessage,
	FormLabel,
	Input as InputCk,
	Textarea,
} from '@chakra-ui/react'
import { useField } from 'formik'

interface InputFieldProps {
	name: string
	label?: string
	placeholder: string
	type: string
	textarea?: boolean
}

const Input = ({ textarea, ...props }: InputFieldProps) => {
	const [field, { error }] = useField(props)
	return (
    <FormControl isInvalid={!!error} mt={4}>
		{props.label && (
			<FormLabel htmlFor={field.name}>{props.label}</FormLabel>
		)}
      {textarea ? (
        <Textarea {...field} id={field.name} {...props} />
      ) : (
        <InputCk {...field} id={field.name} {...props} />
      )}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
	)
}

export default Input