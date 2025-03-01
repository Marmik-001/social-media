import { getDbUserId, getRandomUsers } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { log } from "console";
import { Card, CardContent, CardTitle } from "./ui/card";
import FollowButton from "./FollowButton";

async function FollowRecommendation() {
  const randomUsers = await getRandomUsers();

  if (!randomUsers) return null;

  return (
    <Card className="p-1 pt-5 pl-4 min-h-96">
      <CardTitle>Check 'em out</CardTitle>
      <CardContent className="p-0 pt-1">
        <div className="mt-10 flex flex-col gap-2">
          {randomUsers.map((user, index) => (
            <div key={index} className="flex items-center justify-evenly rounded-lg p-px  border-slate-800 border-2 space-x-2">
              <div>
                <img
                  src={user.image || "./avatar.png"}
                  alt="profile"
                  className="w-9 h-9 rounded-full pl-0"
                />
              </div>
              <div className="flex flex-col pl-1 gap-1">
                <div >
                  <p className="text-sm">{user.name}</p>
                  <p className="text-gray-500 text-sm pt-px">@{user.username}</p>
                </div>
                <div className="text-sm text-slate-400">Followers : {user._count.followers}</div>
              </div>
              <div className="justify-self-end">
                <FollowButton userId= {user.id } username = {user.username} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
export default FollowRecommendation;
