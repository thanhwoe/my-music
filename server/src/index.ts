import express from 'express'
import { AppDataSource } from './data-source'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { buildSchema } from 'type-graphql'
import mongoose from 'mongoose'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import cors from 'cors'
import { UserResolver } from './resolvers/user'
import { InitQuery } from './resolvers/initQuery'
import { COOKIE_NAME, __prod__ } from './constants'
import { Context } from './types/Context'
import { PostResolver } from './resolvers/post'
import { SongResolver } from './resolvers/song'
import path from 'path'

const main = async () => {

  await AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))

  const app = express()

  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    })
  )

  app.use( '/static',express.static(path.join(__dirname, 'public'))) //  http://localhost:4000/static/logo.svg

  const MG_URL = `mongodb+srv://${process.env.MG_USERNAME}:${process.env.MG_PASSWORD}@cluster0.mef1iw4.mongodb.net/?retryWrites=true&w=majority`

  await mongoose.connect(MG_URL)
  console.log('connect success')

  app.use(session({
    name: COOKIE_NAME,
    store: MongoStore.create({ mongoUrl: MG_URL }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      secure: __prod__,
      sameSite: 'lax'
    },
    secret: process.env.MG_SECTION_SECRET as string,
    saveUninitialized: false,
    resave: false
  }));

  const apolloServer = new ApolloServer({
    schema: await buildSchema({resolvers:[InitQuery, UserResolver, PostResolver, SongResolver], validate: false}),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    context: ({req,res}): Context => ({req,res})
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({app, cors: false})

  const PORT = process.env.PORT || 4000 
  app.listen(PORT, ()=> console.log('sever started'))
}
main()
