import {
	Arg,
	Ctx,
	FieldResolver,
	ID,
	Int,
	Mutation,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from 'type-graphql'
import { Post } from '../entities/Post'
import { PostMutationResponse } from '../types/PostMutationResponse'
import { CreatePostInput, UpdatePostInput } from '../types/PostInput'
import { auth } from '../middleware/auth'
import { User } from '../entities/User'
import { Context } from "../types/Context";
import { PaginatedPosts } from '../types/PaginatedPosts'
import { LessThan } from 'typeorm'

@Resolver( _ => Post)
export class PostResolver {


	@FieldResolver(_return => User)
	async user(
		@Root() root: Post,
		// @Ctx() { dataLoaders: { userLoader } }: Context
	) {
		return await User.findOne({where:[{id: root.userId}]})
		// return await userLoader.load(root.userId)
	}

  @Mutation(_return => PostMutationResponse)
	@UseMiddleware(auth)
	async createPost(
		@Arg('createPostInput') { title, description }: CreatePostInput,
		@Ctx() { req }: Context
	): Promise<PostMutationResponse> {
		try {
			const newPost = Post.create({
				title,
				description,
				userId: req.session.userId
			})

			await newPost.save()

			return {
				code: 200,
				success: true,
				message: 'Post created successfully',
				post: newPost
			}
		} catch (error) {
			console.log(error)
			return {
				code: 500,
				success: false,
				message: `Internal server error ${error.message}`
			}
		}
	}

	@Query(_return => PaginatedPosts, {nullable: true})
	async posts(
		@Arg('limit', _type => Int) limit: number,
		@Arg('cursor', {nullable: true}) cursor?: string
	): Promise<PaginatedPosts | null>{

			const total = await Post.count()
			const queryLimit = Math.min(10,limit)
			if(total >= 1){

				const findOptions: { [key: string]: any } = {
					order: {
						createAt: 'DESC'
					},
					take: queryLimit
				}
				
				let lastPost: Post[] = []
				if (cursor) {
					findOptions.where = { createAt: LessThan(cursor) }
					
					lastPost = await Post.find({ order: { createAt: 'ASC' }, take: 1 })
				}
				
				const posts = await Post.find(findOptions)
				
				return {
					totalCount: total,
					cursor: posts[posts.length - 1].createAt,
					hasMore: cursor
					? posts[posts.length - 1].createAt.toString() !== lastPost[0].createAt.toString()
					: posts.length !== total,
					paginatedPosts: posts
				}
			} else{
				return null
			}

	}

	@Query(_return => Post, {nullable: true})
	async post(
		@Arg('id', _type => ID) id: number
	): Promise<Post | null>{
		const post = await Post.findOne({where:[{id}]})
		return post
	}

	@Mutation(_return => PostMutationResponse)
	@UseMiddleware(auth)
	async updatePost(
		@Arg('updatePostInput') { id, title, description }: UpdatePostInput,
		@Ctx() { req }: Context
	): Promise<PostMutationResponse> {
		const existingPost = await Post.findOne({where:[{id}]})
		if (!existingPost)
			return {
				code: 400,
				success: false,
				message: 'Post not found'
			}
		if (existingPost.userId !== req.session.userId) 
			return { 
				code: 401, 
				success: false, 
				message: 'Unauthorised' 
			}

		existingPost.title = title
		existingPost.description = description

		await existingPost.save()

		return {
			code: 200,
			success: true,
			message: 'Post updated successfully',
			post: existingPost
		}
	}

	@Mutation(_return => PostMutationResponse)
	@UseMiddleware(auth)
	async deletePost(
		@Arg('id', _type => ID) id: number,
		@Ctx() { req }: Context
	): Promise<PostMutationResponse> {
		const existingPost = await Post.findOne({where:[{id}]})
		if (!existingPost)
			return {
				code: 400,
				success: false,
				message: 'Post not found'
			}
		if (existingPost.userId !== req.session.userId) 
			return { 
				code: 401, 
				success: false, 
				message: 'Unauthorised' 
			}

		await Post.delete({ id })

		return { code: 200, success: true, message: 'Post deleted successfully' }
	}

}
