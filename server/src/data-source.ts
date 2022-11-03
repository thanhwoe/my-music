require('dotenv').config()
import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Post } from './entities/Post'
import { Song } from './entities/Song'
import { User } from './entities/User'

export const AppDataSource = new DataSource({
  type: "postgres",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: "hightech",
  synchronize: true,
  logging: true,
  entities: [User, Post, Song]
})