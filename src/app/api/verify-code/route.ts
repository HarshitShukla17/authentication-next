import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";

const VerifyCodeQuerySchema = z.object({
  code: z.string({message:"verify code must be string"}).length(6,{message:"verify code must be 6 characters long"}),
});

export async function POST(request: Request) {
    await dbConnect();

    const {code}=await request.json();
    const result=VerifyCodeQuerySchema.safeParse(code);
    
    if(!result.success){
        return Response.json({success:false,message:"Invalid code"},{status:400});
    }

    try {
         const {username,code}=await request.json();

        //  const decodedCode=decodeURIComponent(code);
         const decodedUsername=decodeURIComponent(username);

         const user=await UserModel.findOne({username:decodedUsername})

         if(!user)
         {
            return Response.json(
                {
                    status:false,
                    message:"User not found"
                },
                {status:404}
            )
         }

         const isCodeValid=user.verifyCode===code;
         const isCodeNotExpired=new Date(user.verifyCodeExpiry)>new Date();

         if(isCodeValid && isCodeNotExpired)
         {
             user.isVerified=true;
             await user.save();

             return Response.json(
                 {
                     success:true,
                     message:"Account verified Successfully"
                 },
                 {status:200}
             )
         }
         else if(!isCodeValid)
         {
            return Response.json(
                {
                    success:false,
                    message:"Invalid code"
                },
                {status:400}
            )
         }
            else
            {
                return Response.json(
                    {
                        success:false,
                        message:"Code is expired pleae sign up again"
                    },
                    {status:400})
            }


        
    } catch (error) {
        return Response.json(
            {
                success:false,
                message:"error verifying user"
            },
            {status:500})
        
    }
}