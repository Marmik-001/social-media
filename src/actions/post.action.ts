'use server';

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export const createPost = async (content:string, imageUrl:string) => {
    try {
        const userId = await getDbUserId();

        const post = await prisma.post.create({
            data:{
                content,
                image: imageUrl,
                authorId: userId
            }
        })

        revalidatePath("/");
        return {success: true, post};

    } catch (error) {
        console.log('failed to create post  , error in createPost action',error);
        return {success: false, error};
    }

}