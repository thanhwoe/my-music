import { FieldError } from "../../generated/graphql";

export const mapErrors = (errors: FieldError[]) =>{
  return errors.reduce((pre, cur)=>({
    ...pre,
    [cur.field]: cur.message
  }),{})
}