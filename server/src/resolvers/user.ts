import { User } from "../entities/User";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import argon2 from 'argon2'
import { UserMutationResponse } from "../types/UserMutationResponse";
import { RegisterInput } from "../types/RegisterInput";
import { validateRegisterInput } from "../utils/validateRegisterInput";
import { LoginInput } from "../types/LoginInput";
import { Context } from "../types/Context";
import { COOKIE_NAME } from '../constants'

@Resolver()
export class UserResolver {

	@Query(_return => User, {nullable: true})
	async getMe(@Ctx() {req}: Context): Promise<User | undefined|null> {
		const id = req.session.userId
		
		if(!id) return null
		return User.findOne({where:[{id}]})
	}

  @Mutation(_return => UserMutationResponse)
  async register(
    @Arg('registerInput') registerInput: RegisterInput,
    @Ctx() {req}:Context

  ): Promise<UserMutationResponse> {
    const validate = validateRegisterInput(registerInput)
		console.log(validate)
    if(validate !== null)return { code: 400, success: false, ...validate}
    try{
      const {username, email, password} = registerInput
      const existUser = await User.findOne({where: [{username},{email}]})
    if(existUser) return {
      code: 400,
      success: false,
      message: 'Username or Email already exist',
      errors:[
        {
          field: existUser.username === username ? 'username': 'email',
          message:'duplicate'
        }
      ]
    }

    const hashPass = await argon2.hash(password)

    const newUser = User.create({
      username,
      password: hashPass,
      email
    })
    
    await newUser.save()
    req.session.userId = newUser.id

    return {
      code: 200,
      success: true,
      message: 'Register success',
      user: newUser
    }

    }catch(err){
      return {
        code: 500,
        success: false,
        message: err,
      }
    }
    
  }

  @Mutation(_return => UserMutationResponse)
	async login(
		@Arg('loginInput') { usernameOrEmail, password }: LoginInput,
    @Ctx() {req}: Context
	): Promise<UserMutationResponse> {
		try {
      const isEmail = usernameOrEmail.includes('@')
      ? { email: usernameOrEmail }
      : { username: usernameOrEmail }
			const existingUser = await User.findOne(
				{where: [isEmail]}
			)

			if (!existingUser)
				return {
					code: 400,
					success: false,
					message: 'User not found',
					errors: [
						{ field: 'usernameOrEmail', message: 'Username or email incorrect' }
					]
				}

			const passwordValid = await argon2.verify(existingUser.password, password)

			if (!passwordValid)
				return {
					code: 400,
					success: false,
					message: 'Wrong password',
					errors: [{ field: 'password', message: 'Wrong password' }]
				} 

      req.session.userId = existingUser.id

			return {
				code: 200,
				success: true,
				message: 'Logged in successfully',
				user: existingUser
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

  @Mutation(_return => Boolean)
	logout(@Ctx() { req, res }: Context): Promise<boolean> {
		return new Promise((resolve, _reject) => {
			res.clearCookie(COOKIE_NAME)

			req.session.destroy(error => {
				if (error) {
					console.log('DESTROYING SESSION ERROR', error)
					resolve(false)
				}
				resolve(true)
			})
		})
	}
}