import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity{
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  userId!: number

  @Field()
  @Column()
  description!: string

  @Field()
  @CreateDateColumn({ type: 'timestamptz' })
  createAt: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date

  @Field(_type => User)
  @ManyToOne(()=> User, user => user.posts)
  user: User
}