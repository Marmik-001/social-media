// "use client";

// import { useUser } from "@clerk/nextjs";
// import { useState } from "react";
// import { Card, CardContent } from "./ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import Link from "next/link";
// import { Textarea } from "@/components/ui/textarea"
// import { Button } from "./ui/button";
// import { Image, Send } from "lucide-react";
// import { createPost } from "@/actions/post.action";
// import toast from "react-hot-toast";
// import ImageUpload from "./ImageUpload";

// function CreatePost() {
//   const { user } = useUser();

//   const [content, setContent] = useState("");
//   const [imageUrl, setImageUrl] = useState("");
//   const [posting, setPosting] = useState(false);
//   const [showImageUpload, setShowImageUpload] = useState(false); //for dropzone
  

//   const handleSumbit = async () => {
//     if(!content.trim() && !imageUrl ) return;
//     setPosting(true);
//     try {
//       const result = await createPost(content, imageUrl);
//       if(result.success){
//         console.log('post created successfully');
//         setContent("");
//         setImageUrl("");
//         setPosting(false);
//         toast.success("Post created successfully");
//       }

//     } catch (error) {
//       console.log('error creating post', error);
//       toast.error("Error creating post");
      
//     }
//     finally{
//       setPosting(false);
//       setContent("");
//       setImageUrl("");
//     }
//   };

//   if (!user) return null;

//   return (
//     <Card className="mb-6">
//       <CardContent className="p-4">
//         <div className="border-gray-300 border-2 rounded-md p-2">
//           <div className="flex pt-6 pl-2  space-x-6 min-h-24">
//             <Avatar className="w-10 h-9   avatar border-2 border-white  dark:text-gray-200 ">
//               <AvatarImage src={user.imageUrl || "./avatar.png"} className="" />
//               <AvatarFallback className="w-20 h-20 justify-self-center   border-2 border-white  dark:text-gray-200 ">
//                 404
//               </AvatarFallback>
//             </Avatar>
//             <Textarea 
//             className="border-none mt-[-10px]  placeholder:text-gray-500 "
//             placeholder={`Express your thoughts here`}
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             disabled={posting}
//             />
//           </div>
//         </div>
//           <div className="flex justify-between mt-4">
//             {/* todo: add image upload */}
            
//             {(showImageUpload || imageUrl) && (
//             <div className="border rounded-lg p-4">
//               <ImageUpload
//                 endpoint="postImage"
//                 value={imageUrl}
//                 onChange={(url) => {
//                   setImageUrl(url);
//                   if (!url) setShowImageUpload(false);
//                 }}
//               />
//             </div>
//           )}

//           <div className="flex  justify-between w-full">
//             <Button className="dark:bg-black bg-white  text-gray-500 p-2 hover:bg-slate-200 dark:hover:bg-black hover:ring-1 hover:ring-white">
//               <Image size={24} className="text-gray-500   " />
//               <div>Photo</div>
//             </Button>
//             <Button 
//             className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 hover:ring-1 hover:ring-white"
//             onClick={handleSumbit}
//             disabled={(!content && !imageUrl) ||  posting}
//             >
//               <div className=""> { posting ? `Posting...` :  'Post' } </div>
//               <Send size={24} className="text-white " />
//               </Button>
//           </div>


//           </div>
//       </CardContent>
//     </Card>
//   );
// }
// export default CreatePost;


"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

function CreatePost() {
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;

    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        // reset the form
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.imageUrl || "/avatar.png"} />
            </Avatar>
            <Textarea
              placeholder="What's on your mind?"
              className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
          </div>

          {(showImageUpload || imageUrl) && (
            <div className="border rounded-lg p-4">
              <ImageUpload
                endpoint="postImage"
                value={imageUrl}
                onChange={(url) => {
                  setImageUrl(url);
                  if (!url) setShowImageUpload(false);
                }}
              />
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-4">
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary"
                onClick={() => setShowImageUpload(!showImageUpload)}
                disabled={isPosting}
              >
                <ImageIcon className="size-4 mr-2" />
                Photo
              </Button>
            </div>
            <Button
              className="flex items-center"
              onClick={handleSubmit}
              disabled={(!content.trim() && !imageUrl) || isPosting}
            >
              {isPosting ? (
                <>
                  <Loader2Icon className="size-4 mr-2 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <SendIcon className="size-4 mr-2" />
                  Post
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default CreatePost;