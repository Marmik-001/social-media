"use server";

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action";
import { revalidatePath } from "next/cache";

export const createPost = async (content: string, imageUrl: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, error: "user not found" };
    const post = await prisma.post.create({
      data: {
        content,
        image: imageUrl,
        authorId: userId,
      },
    });

    revalidatePath("/");
    return { success: true, post };
  } catch (error) {
    console.log("failed to create post  , error in createPost action", error);
    return { success: false, error };
  }
};

export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            username: true,
            name: true,
            image: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            authorId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("failed to get posts , error in getPosts action", error);
    return [];
  }
};

export const toggleLike = async (postId: string) => {
  try {
    const userId = await getDbUserId();
    if (!userId) return { success: false, error: "user not found" };

    const existingLike = await prisma.like.findUnique({
      where: {
        authorId_postId: {
          authorId: userId,
          postId,
        },
      },
    });

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) return { success: false, error: "post not found" };

    if (existingLike) {
      await prisma.like.delete({
        where: {
          authorId_postId: {
            authorId: userId,
            postId,
          },
        },
      });
      return { success: true };
    } else {
      await prisma.$transaction([
        prisma.like.create({
          data: {
            authorId: userId,
            postId,
          },
        }),
        ...(post.authorId !== userId
          ? [
              prisma.notification.create({
                data: {
                  type: "LIKE",
                  userId: post.authorId,
                  creatorId: userId,
                  postId,
                },
              }),
            ]
          : []),
      ]);
    }
    revalidatePath("/");
    return { success: true };

  } catch (error) {
    console.log("failed to like post , error in toggleLike action", error);
    return { success: false, error };
  }
};


export const createComment = async (postId: string, content: string) => {
    try {
        const userId = await getDbUserId();
        if (!userId) return { success: false, error: "user not found" };
        if (!content) return { success: false, error: "content is required" };
        const post = await prisma.post.findUnique({
            where:{
                id: postId
            },
            select:{
                authorId: true
            }
        })
        if(!post) return { success: false, error: "post not found" };

        const [comment] = await prisma.$transaction( async (tx) => {
            //create comment
            const newComment = await tx.comment.create({
                data:{
                    content,
                    postId,
                    authorId: userId
                }
            });
            //create notification
            if(post.authorId !== userId){
                await tx.notification.create({
                    data:{
                        type: "COMMENT",
                        userId: post.authorId,
                        creatorId: userId,
                        postId,
                        commentId: newComment.id
                    }
                })
            }
            return [newComment];
        })
        revalidatePath("/");
        return { success: true, comment };

    } catch (error) {
        console.log("failed to create comment , error in createComment action", error);
        return { success: false, error };
    }
}

export const deletePost = async (postId: string) => {
  try {
    
    const userId = await getDbUserId();
    if(!userId) return { success: false, error: "user not found" };

    const post = await prisma.post.findUnique({
      where:{
        id: postId
      },
      select:{
        authorId: true
      }
    })

    if(!post) return { success: false, error: "post not found" };

    if(post.authorId !==userId) return { success: false, error: "not authorized" };

    await prisma.post.delete({
      where:{
        id: postId
      }
    });
    revalidatePath("/");
    return { success: true };


  } catch (error) {
    console.log("failed to delete post , error in deletePost action", error);
    return { success: false, error };
  }
}