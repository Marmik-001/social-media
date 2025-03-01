"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "./ui/button";
import { Image, Send } from "lucide-react";
import { Sen } from "next/font/google";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";

function CreatePost() {
  const { user } = useUser();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [posting, setPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false); //for dropzone
  

  const handleSumbit = async () => {
    if(!content.trim() && !imageUrl ) return;
    setPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if(result.success){
        console.log('post created successfully');
        setContent("");
        setImageUrl("");
        setPosting(false);
        toast.success("Post created successfully");
      }

    } catch (error) {
      console.log('error creating post', error);
      toast.error("Error creating post");
      
    }
    finally{
      setPosting(false);
      setContent("");
      setImageUrl("");
    }
  };

  if (!user) return null;

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="border-gray-300 border-2 rounded-md p-2">
          <div className="flex pt-6 pl-2  space-x-6 min-h-24">
            <Avatar className="w-10 h-9   avatar border-2 border-white  dark:text-gray-200 ">
              <AvatarImage src={user.imageUrl || "./avatar.png"} className="" />
              <AvatarFallback className="w-20 h-20 justify-self-center   border-2 border-white  dark:text-gray-200 ">
                404
              </AvatarFallback>
            </Avatar>
            <Textarea 
            className="border-none mt-[-10px]  placeholder:text-gray-500 "
            placeholder={`Express your thoughts here`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={posting}
            />
          </div>
        </div>
          <div className="flex justify-between mt-4">
            {/* todo: add image upload */}

          <div className="flex  justify-between w-full">
            <Button className="dark:bg-black bg-white  text-gray-500 p-2 hover:bg-slate-200 dark:hover:bg-black hover:ring-1 hover:ring-white">
              <Image size={24} className="text-gray-500   " />
              <div>Photo</div>
            </Button>
            <Button 
            className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 hover:ring-1 hover:ring-white"
            onClick={handleSumbit}
            disabled={(!content && !imageUrl) ||  posting}
            >
              <div className=""> { posting ? `Posting...` :  'Post' } </div>
              <Send size={24} className="text-white " />
              </Button>
          </div>


          </div>
      </CardContent>
    </Card>
  );
}
export default CreatePost;
