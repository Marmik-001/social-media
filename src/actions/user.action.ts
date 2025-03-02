"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { log } from "console";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const { userId } = await auth();
    // console.log("User ID from syncUser:", userId);
    const user = await currentUser();
    // console.log("User from syncUser:", user);
    if (!userId || !user) {
      console.log("No userId or user found");
      return false;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    // Check if email is already in use
    const emailInUse = await prisma.user.findUnique({
      where: {
        email: user.emailAddresses?.[0]?.emailAddress || "",
      },
    });

    if (emailInUse) {
      console.log("Email already in use");
      return emailInUse;
    }

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses?.[0]?.emailAddress || "",
        name:
          user.fullName ||
          user.emailAddresses?.[0]?.emailAddress.split("@")[0] ||
          `${user.firstName} ${user.lastName}` ||
          "",
        username:
          user.username ?? user.emailAddresses?.[0]?.emailAddress.split("@")[0],
        image: user.imageUrl || "",
      },
    });

    revalidatePath("/");
    return dbUser;
  } catch (error) {
    console.log("Error in syncUser:", error);
    return null;
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    if (!clerkId) {
      return null;
    }
    // console.log("this here ", clerkId)
    // console.log('user_2tUpRzK2GbEiTXkdrXl2qSLKzG1')
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
    // console.log("User from getUserByClerkId:", user);

    if (!user) {
      console.log("User not found with clerkId:", clerkId);
      return null;
    }
    // revalidatePath("/");
    return user;
  } catch (error) {
    console.error("Error in getUserByClerkId:", error);
    return null;
  }
}

export async function getDbUserId() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.log("No clerkId found in auth");
      return null;
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
      console.log("User not found for clerkId:", clerkId);
      return null;
    }

    return user.id;
  } catch (error) {
    console.error("Error in getDbUserId:", error);
    return null;
  }
}

export async function getRandomUsers() {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) {
      console.log("No current user ID found");
      return [];
    }

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
              followers: {
                some: {
                  followerId: currentUserId,
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
      take: 3,
    });

    log("Random users:", users);
    return users;
  } catch (error) {
    console.log("Error getting random users:", error);
    return [];
  }
}

export const toggleFollow = async (targetUserId: string) => {
  try {
    const currentUserId = await getDbUserId();
    if (!currentUserId) throw new Error("Unauthorized");
    if (currentUserId === targetUserId)
      throw new Error("Cannot follow yourself");

    const existingFollow = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    if (existingFollow) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        },
      });
    } else {
      await prisma.$transaction([
        prisma.follows.create({
          data: {
            followerId: currentUserId,
            followingId: targetUserId,
          },
        }),
        prisma.notification.create({
          data: {
            type: "FOLLOW",
            userId: targetUserId,
            creatorId: currentUserId,
          },
        }),
      ]);
    }

    revalidatePath("/");
    return { success: true, following: !existingFollow };
  } catch (error) {
    console.log("Error in toggleFollow:", error);
    return { success: false };
  }
};
