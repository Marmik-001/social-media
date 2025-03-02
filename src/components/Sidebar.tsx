import { currentUser } from "@clerk/nextjs/server";
import UnAuthenticatedSidebar from "./UnAuthenticatedSidebar";
import { getUserByClerkId } from "@/actions/user.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

async function Sidebar() {
  try {
    // const authUser = await currentUser();
    const authUser = await currentUser()
    // console.log("Auth user:", authUser); // Add this line to log the auth user
    if (!authUser) {
      return <UnAuthenticatedSidebar />;
    }

    const user = await getUserByClerkId(authUser.id);
    if (!user) {
      console.log("User not found in database for Clerk ID:", authUser.id);
      return <UnAuthenticatedSidebar />;
    }

    const username = user.username || "user";
    const email = user.email || "No email";
    const bio = user.bio || "No bio";
    const location = user.location || "No Location";
    const website = user.website || "#";
    const image = user.image || "./avatar.png";

    const followerCount = user._count?.followers || 0;
    const followingCount = user._count?.following || 0;

    return (
      <div className="sticky top-20">
        <Card>
          <Avatar className="w-20 h-18 justify-self-center mt-10 avatar border-2 border-white dark:text-gray-200">
            <Link href={`/profile/${username}`}>
              <AvatarImage src={image} className="" />
              <AvatarFallback className="w-20 h-20 justify-self-center border-2 border-white dark:text-gray-200">
                {username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Link>
          </Avatar>
          <CardHeader>
            <CardTitle>@{username}</CardTitle>
            <CardDescription>{email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm font-semibold max-h-20">Bio</p>
              <p className="text-xs pt-1 text-gray-400">{bio}</p>

              <Separator className="my-3 bg-gray-400" />
              <div className="flex justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">Followers</p>
                  <p className="text-lg font-bold">{followerCount}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold">Following</p>
                  <p className="text-lg font-bold">{followingCount}</p>
                </div>
              </div>
              <Separator className="my-3 bg-gray-400" />
              <div className="text-normal gap-2 flex flex-col">
                <p>{location}</p>
                <Link href={website} target="_blank">
                  {website !== "#" ? website : "No Website"}
                </Link>
              </div>
            </div>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error rendering Sidebar:", error);
    return <UnAuthenticatedSidebar />;
  }
}

export default Sidebar;
