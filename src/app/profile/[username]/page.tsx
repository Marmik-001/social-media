import { getProfile, getUserLikedPosts, getUserPosts, isFollowing } from "@/actions/profile.action"
import { notFound, redirect } from "next/navigation";
import ProfilePageClient from "./ProfilePageClient";


export async function generateMetadata({params}: {params: {username: string}}) {
  const {username} =  await params


  const user = await getProfile(username);
  if (!user) return;

  return {
    title: `${user.name ?? user.username}`,
    description: user.bio || `Check out ${user.username}'s profile.`,
  };
// console.log("params", params.username)
}


async function ProfilePageServer({ params }: { params: { username: string } }) {
  const user = await getProfile(params.username);

  if (!user) notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <ProfilePageClient
      user={user}
      posts={posts}
      likedPosts={likedPosts}
      isFollowing={isCurrentUserFollowing}
    />
  );
}
export default ProfilePageServer;