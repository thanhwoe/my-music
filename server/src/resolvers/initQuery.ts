import { Context } from "../types/Context";
import { Ctx, Query, Resolver } from "type-graphql";

@Resolver()
export class InitQuery{
  @Query(_return => String)
  async initQuery(@Ctx() {req}: Context){
    console.log(req.session.userId)
   
    return 'data'
  }
}