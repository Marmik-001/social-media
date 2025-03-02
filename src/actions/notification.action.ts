"use server"

import { prisma } from "@/lib/prisma";
import { getDbUserId } from "./user.action"

export async function getNotifications() {

    try {
        
        const userId = await getDbUserId();
        if(!userId) return [];
        
        const notifications = await prisma.notification.findMany({
            where:{
                userId
            },
            include:{
                creator:{
                    select:{
                        id: true,
                        username: true,
                        image: true,
                        name: true

                    }
                },
                post:{
                    select:{
                        id: true,
                        content: true,
                        image: true,

                    }
                },
                comment:{
                    select:{
                        id: true,
                        content: true,
                        createdAt: true

                    }
                }
            },
            orderBy:{
                createdAt: 'desc'
            }
        })

        return notifications;

    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function markNotificationsAsRead(notificationId: string[]) {
    try {
        const userId = await getDbUserId();
        if(!userId) return {sucsess : false};

        await prisma.notification.updateMany({
            where:{
                id: {
                    in: notificationId
                }
            },
            data:{
                read: true
            }
        })

        return {sucsess : true};

    } catch (error) {
        console.log(error);
        return {sucsess : false};
    }
}