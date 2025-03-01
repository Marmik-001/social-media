"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFollow } from "@/actions/user.action";

type propsType = {
  userId: string;
  username: string;
};

function FollowButton({ userId, username }: propsType) {
  const [isLoadding, setIsLoading] = useState(false);
  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const { success, following } = await toggleFollow(userId);

      if (!success) throw new Error("Error following user");
      if (following) {
        toast.success(`Just Followed ${username}`);
      } else {
        toast.success(`Just Unfollowed ${username}`);
      }
    } catch (error) {
      console.log("error following user", error);
      toast.error("Error following user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className="bg-blue-500 text-white hover:bg-blue-600 hover:scale-[102%] transition duration-300 ease-in-out"
      onClick={handleFollow}
      disabled={isLoadding}
    >
      {isLoadding ? <Loader2Icon className="size-5 animate-spin" /> : "Follow"}
    </Button>
  );
}
export default FollowButton;
