import {
	Arg,
	Ctx,
	FieldResolver,
	ID,
	Mutation,
	Query,
	Resolver,
	Root,
	UseMiddleware,
} from 'type-graphql'
import { Post } from '../entities/Post'
import { auth } from '../middleware/auth'
import { User } from '../entities/User'
import { Context } from "../types/Context";
import { Song } from '../entities/Song'
import { SongMutationResponse } from '../types/SongMutationResponse'
import { CreateSongInput } from '../types/SongInput'
import { YoutubeDownloader } from '../utils/youtubeDownload';

@Resolver( _ => Song)

export class SongResolver {
    @FieldResolver(_return => User)
	async user(
		@Root() root: Post,
		// @Ctx() { dataLoaders: { userLoader } }: Context
	) {
		return await User.findOne({where:[{id: root.userId}]})
		// return await userLoader.load(root.userId)
	}

    @Mutation( _return => SongMutationResponse)
    @UseMiddleware(auth)
    async createSong(
        @Arg('createSongInput') { source }: CreateSongInput,
        @Ctx() { req }: Context
    ): Promise<SongMutationResponse> {
        try {
            const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
            const id = source.match(regExp)?.[7] || '';
            const data = await YoutubeDownloader(id)
            const newSong = Song.create({
                id: data.videoId,
                title: data.title,
                artist: data.artist,
                source: data.youtubeUrl,
                thumbnail: data.thumbnail,
                filePath: `/static/mp3/${id}.mp3`,
                provider: 'youtube',
                userId: req.session.userId
            })
            await newSong.save()

            return {
                code: 200,
                success: true,
                message: 'Song created successfully',
                song: newSong
            }
        } catch (e) {
            console.log(e)
            return {
                code: 500,
                success: false,
                message: `Internal server error ${e.message}`
            }
        }
    }

    @Query( _return => [Song])
    async songs(): Promise<Song[]>{
        return Song.find()
    }

    @Query( _return => Song, {nullable: true})
    async song(
        @Arg('id', _type => ID) id: string
    ): Promise<Song | null>{
        return Song.findOne({where:[{id}]})
    }
}