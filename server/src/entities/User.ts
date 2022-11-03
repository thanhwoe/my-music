import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./Post";
import { Song } from "./Song";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({unique:true})
  username!: string

  @Field()
  @Column({unique:true})
  email!: string

  @Column()
  password!: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(() => Post, post => post.user)
	posts: Post[]

  @OneToMany(() => Song, song => song.user)
	songs: Song[]
}