import {z} from 'zod';

export const usernameValidation = z.string()
                .min(3,{message:"username must be atleast 3 character"})
                .max(10,{message:"username must be atmost 10 character"})
                .regex(/^[a-zA-Z0-9_]+$/,{message:"username must contain only alphanumeric characters and underscore"});

export const signUpSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"password must be atleast 6 character"}).max(8,{message:"password must be atmost 8 character"}),
});
