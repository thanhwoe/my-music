import { Field, InputType } from 'type-graphql'

@InputType()
export class CreateSongInput {
	@Field()
	source: string
}

