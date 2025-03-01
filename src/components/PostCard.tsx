'use client';

import { createComment, deletePost, getPosts, toggleLike } from "@/actions/post.action";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";

type propsType = {
    post: Awaited<ReturnType<typeof getPosts>>[0],
    dbUserId: string | null
}


function PostCard({post , dbUserId  } : propsType) {
    const {user} =  useUser();
    const [newComment , setNewComment] = useState('');   
    const [isCommenting , setIsCommenting] = useState(false);
    const [isLiking , setIsLiking] = useState(false);
    const [isDeleting , setIsDeleting] = useState(false);
    const [hasLiked , setHasLiked] = useState(post.likes.some(like => like.authorId === dbUserId));
    const [optimisticLikes , setOptimisticLikes ] = useState(post._count?.likes);

    const handleLike = async () => {
        if(isLiking) return;
        setIsLiking(true);
        
        try {
            setHasLiked(prev => !prev);
            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1));
            await toggleLike(post.id);
        } catch (error) {
            setOptimisticLikes(post._count?.likes);
            setHasLiked(prev => !prev);

            setIsLiking(post.likes.some(like => like.authorId === dbUserId));
        }
        finally {
            setIsLiking(false);
        }
    }

    const handleAddComment = async () => {
        if(!newComment || isCommenting) return;

        try {
            setIsCommenting(true);
            const result = await createComment(post.id , newComment);
            if(result.success) {
                setNewComment('');
                toast.success('Comment added successfully');

            }
        } catch (error) {
            console.log('error in adding comment' , error);
            toast.error('Failed to add comment');
        }
        finally{
            setIsCommenting(false);
        }
    }

    const handleDeletePost = async () => {
        if(isDeleting) return;
        try {
            setIsDeleting(true);
            //delete post
            const result = await deletePost(post.id);
            if(result.success) {
                toast.success('Post deleted successfully');
            }
            else {
                throw new Error(''+result.error);
            }
        } catch (error) {
            console.log('error in deleting post' , error);
            toast.error('Failed to delete post');
        }
        finally {
            setIsDeleting(false);
        }
    }

  return (
    <div>
        huh
    </div>
  )
}
export default PostCard