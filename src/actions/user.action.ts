"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { log } from "console";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) return;

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        // Use optional chaining to avoid null values
        email: user.emailAddresses?.[0]?.emailAddress || "",
        name:
          user.fullName || `${user.firstName} ${user.lastName}` || "",
        username:
          user.username ?? user.emailAddresses?.[0].emailAddress.split("@")[0],
        image: user.imageUrl || "",
      },
    });

    return dbUser;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          post: true,
        },
      },
    },
  });
  if (!user) {

    console.log("is the error here");
    return null}
  return user;
}

export async function getDbUserId() {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error(" Unathorized");

  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error("User not found");

  return user.id;
}

export async function getRandomUsers() {
  try {
    const currentUserId = await getDbUserId();
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            NOT: {
              id: currentUserId,
            }, 
          },
          {
            NOT: {
              //todo : check if this is correct
              following: {
                some: {
                  followingId: currentUserId,
                },
              },
            },
          },
        ],
      },

      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3, //get only 3 users
    });
    log("random users", users);
    return users;
  } catch (error) {
    console.log("error getting random users", error);
    return [];
  }
}

export const toggleFollow = async (targetUserId: string) => {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) throw new Error("Unathorized");
    if (currentUserId === targetUserId) throw new Error("Cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where:{
        followerId_followingId:{
          followerId: currentUserId,
          followingId: targetUserId
        }
      }
    })

    if(existingFollow){
      // unfollow
      await prisma.follows.delete({
        where:{
          followerId_followingId:{
            followerId: currentUserId,
            followingId: targetUserId
          }

        }
      })
    }

    else{
      // follow
      await prisma.$transaction([
        prisma.follows.create({
          data:{
            followerId: currentUserId,
            followingId: targetUserId
          }
        }),
        prisma.notification.create({
          data:{
            type:"FOLLOW",
            userId: targetUserId, //user being followed
            creatorId: currentUserId //user following
          }
        })
      ])
    }
    revalidatePath('/')
    return { success: true , following: !existingFollow };

  } catch (error) {
    console.log(error);
    return { success: false };
  }
};
