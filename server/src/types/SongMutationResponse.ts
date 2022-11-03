import { Field, ObjectType } from 'type-graphql'
import { IMutationResponse } from './MutationResponse'
import { FieldError } from './FieldError'
import { Song } from '../entities/Song'

@ObjectType({ implements: IMutationResponse })
export class SongMutationResponse implements IMutationResponse {
	code: number
	success: boolean
	message?: string

	@Field({ nullable: true })
	song?: Song

	@Field(_type => [FieldError], { nullable: true })
	errors?: FieldError[]
}