import UserModel from "@/model/User";

import { Message } from "@/model/User";

import dbConnect from "@/lib/dbConnect";




export async function POST(request:Request)
{
    await dbConnect();
    const {username,content}=await request.json();

    try {
        const user=await UserModel.findById(username);
        if(!user)
        {
            return Response.json(
                {
                    succes:false,
                    message:"User not found"
                },
                {status:404}
            )
        }
        if(!user.isAcceptingMessages)
        {
            return Response.json(
                {
                    success:false,
                    message:"User is not accepting messages"
                },
                {status:400}
            )
        }
        const newMessage={content,createdAt:new Date()};
        user.messages.push(newMessage as Message);//here assersion is used to tell the compiler that the object is of type Message
        await user.save();

        return Response.json(
            {
                success:true,
                message:"Message sent"
            },
            {status:200});
    } catch (error) {
        console.error("Error in sending message",error);
        return Response.json(
            {
                success:false,
                message:"Error in sending message"
            },
            {status:500}
        )
    }

}