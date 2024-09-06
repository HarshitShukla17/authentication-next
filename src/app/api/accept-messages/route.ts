import { getServerSession } from "next-auth";

import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";


export async function POST(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    // Check if the user is logged in

    if(!session||!session.user){
        return Response.json(
            {
                success:false,
                message:"You need to be logged in to accept messages"
            },
            {status:401}
        )
    }

    const userID=user._id;
    const {acceptMessages}=await request.json();

    try {

        const updatedUser=await UserModel.findByIdAndUpdate(
            userID,
            {isAcceptingMessages:acceptMessages},
            {new:true}
        );
        if(!updatedUser){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {status:404}
            )
        }
        else{
            return Response.json(
                {
                    success:true,
                    message:"User updated to accept messages",
                    user:updatedUser
                },
                {status:200}
            )
        }

        
        
    } catch (error) {
        console.log("failed to update user to accept messages",error);
        return Response.json(
            {
                success:false,
                message:"failed to update user to accept messages"
            },
            {status:500}
        )
    }


    
}

export async function GET(request:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    // Check if the user is logged in

    if(!session||!session.user){
        return Response.json(
            {
                success:false,
                message:"You need to be logged in to accept messages"
            },
            {status:401}
        )
    }

    const userID=user._id;

    try {
        const foundUser=await UserModel.findById(userID);
        if(!foundUser){
            return Response.json(
                {
                    success:false,
                    message:"User not found"
                },
                {status:404}
            )
        }
        else{
            return Response.json(
                {
                    success:true,
                    message:"successfully fectch the status of messages acceptance",
                    isAcceptingMessages:foundUser.isAcceptingMessages
                },
                {status:200}
            )
        }
        
    } catch (error) {
        console.log("failed to get user to accept messages",error);
        return Response.json(
            {
                success:false,
                message:"failed to get user to accept messages"
            },
            {status:500}
        )
    }
}