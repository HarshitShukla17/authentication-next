
import UserModel from "@/model/User";


import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request:Request)
{
    await dbConnect();

    const session= await getServerSession(authOptions);
    
    const user:User=session?.user as User;

    if(!session||!session.user)
    {
        return Response.json(
            {
                status:false,
                message:"please login to access the messages"
            },
            {status:401}
        )
    }

    const userId=new mongoose.Types.ObjectId(user.id);

    try {
        //logic to fetch the messages
        //fetch the user from the database

        const user=await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:"$messages"},
            {$sort:{"messages.createdAt":-1}},
            {$group:{_id:"$_id",messages:{$push:"$messages"}}}
        ])

        if(!user||user.length===0)
        {
            return Response.json(
                {
                    status:false,
                    message:"no messages found"
                },
                {status:404}
            )
        }
        else {
            return Response.json(
                {
                    status:true,
                    messages:user[0].messages
                }
            )
        }
        



        
    } catch (error) {
        console.log("failed to fetch the messages",error)
        return Response.json(
            {
                status:false,
                message:"failed to fetch the messages"
            }
        )
    }
}

