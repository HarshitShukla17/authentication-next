import {z} from "zod";

export const verifySchema = z.object({
    code:z.string().min(6,{message:"code must be atleast 6 character"}).max(6,{message:"code must be atmost 6 character"})
});