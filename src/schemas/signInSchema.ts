import {z} from "zod";

export const signInSchema = z.object({
    identifier:z.string(),
    password:z.string().min(6,{message:"password must be atleast 6 character"}).max(8,{message:"password must be atmost 8 character"}),
});