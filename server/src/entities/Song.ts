import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Song extends BaseEntity{
    @Field(_type => ID)
    @PrimaryColumn()
    id!: string

    @Field()
    @Column()
    title!: string

    @Field()
    @Column()
    artist: string

    @Field()
    @Column()
    source!: string

    @Field()
    @Column()
    thumbnail: string

    @Field()
    @Column()
    filePath!: string

    @Field()
    @Column()
    provider: string

    @Field()
    @Column()
    userId!: number


    @Field()
    @CreateDateColumn({ type: 'timestamptz' })
    createdAt: Date

    @Field()
    @UpdateDateColumn({ type: 'timestamptz' })
    updatedAt: Date

    @Field(_type => User)
    @ManyToOne(()=> User, user => user.songs)
    user: User
}