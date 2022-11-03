import { Field, InputType, ID } from 'type-graphql'

@InputType()
export class CreatePostInput {
	@Field()
	title: string

	@Field()
	description: string
}

@InputType()
export class UpdatePostInput {
	@Field(_type=> ID)
	id:number

	@Field()
	title: string

	@Field()
	description: string
}