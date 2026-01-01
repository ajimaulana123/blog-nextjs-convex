"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator"
import { CommentSection } from "@/components/web/CommentSection";
import { Comment } from "@/types/comment"
import { PostPresence } from "@/components/web/PostPresence";
import { redirect } from "next/navigation";

type BlogId = {
    blogId: Id<"posts">
}

export default function BlogClient({
    blogId,
}: BlogId) {
    const post = useQuery(api.posts.getBlogById, { blogId });
    const comments = useQuery(api.comments.getCommentsByPost, { postId: blogId });
    const userId = useQuery(api.presence.getUserId);

    const safeComments: Comment[] = comments ?? [];

    if (post === undefined) return <SkeletonBlogDetail />;
    if (post === null) return <PostNotFound />;

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500">
            <Link
                className={`${buttonVariants({ variant: "outline" })} mb-4 inline-flex items-center gap-2`}
                href="/blog"
            >
                <ArrowLeft className="size-4" />
                Back to blog
            </Link>

            {/* IMAGE */}
            <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
                <Image
                    src={
                        post.imageUrl ??
                        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
                    }
                    alt={post?.title}
                    fill
                    unoptimized
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            <div className="space-y-4 flex flex-col">
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                    {post?.title}
                </h1>

                <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                        Posted on:{" "}
                        {new Date(post._creationTime).toLocaleDateString("id-ID")}
                    </p>

                    {userId && <PostPresence roomId={post._id} userId={userId} />}
                </div>

                <Separator className="my-8" />

                <p className="text-lg leading-relaxed text-foreground">
                    {post?.body}
                </p>

                <Separator className="my-8" />

                <CommentSection comments={safeComments} />
            </div>
        </div>
    );

}

export function SkeletonBlogDetail() {
    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-pulse">
            {/* Back button */}
            <Skeleton className="h-9 w-32 mb-6 rounded-md" />

            {/* Image */}
            <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden">
                <Skeleton className="h-full w-full" />
            </div>

            {/* Content */}
            <div className="space-y-4 flex flex-col">
                {/* Title */}
                <Skeleton className="h-10 w-3/4" />

                {/* Date */}
                <Skeleton className="h-4 w-40" />

                {/* Body */}
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-11/12" />
                <Skeleton className="h-5 w-10/12" />
            </div>
        </div>
    );
}

export function PostNotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6 animate-in fade-in duration-300">
                {/* Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <FileQuestion className="h-8 w-8 text-muted-foreground" />
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Post tidak ditemukan
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Post yang kamu cari mungkin sudah dihapus atau URL-nya salah.
                    </p>
                </div>

                {/* Action */}
                <Link
                    href="/blog"
                    className={buttonVariants({
                        variant: "outline",
                        className: "inline-flex items-center gap-2",
                    })}
                >
                    <ArrowLeft className="size-4" />
                    Kembali ke Blog
                </Link>
            </div>
        </div>
    );
}