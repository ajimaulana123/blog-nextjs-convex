"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPage() {
    return (
        <>
            <div className="py-12">
                <div className="text-center pb-12">
                    <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Blog Articles</h1>
                    <p className="pt-4 max-w-2xl mx-auto text-xl text-muted-foreground">Insight, tought, and trends fron our team.</p>
                </div>


                <LoadBlogList />
            </div>
        </>
    )
}

function LoadBlogList() {
    const data = useQuery(api.posts.getPosts);

    if (data === undefined) return <SkeletonLoadingUi />

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((post) => (
                <Card key={post._id} className="pt-0">
                    <div className="relative aspect-[16/9] w-full">
                        <Image
                            src={post.imageUrl ?? "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"}
                            alt={post.title}
                            fill
                            unoptimized
                            className="rounded-t-lg"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <CardContent>
                        <Link href={`/blog/${post._id}`}>
                            <h1 className="text-2xl font-bold hover:text-primary">
                                {post.title}
                            </h1>
                        </Link>
                        <p className="text-muted-foreground line-clamp-3">{post.body}</p>
                    </CardContent>
                    <CardFooter>
                        <Link href={`/blog/${post._id}`} className={buttonVariants({
                            className: "w-full"
                        })}>
                            Read More
                        </Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}

function SkeletonLoadingUi() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {
                [...Array(3)].map((_, i) => (
                    <div className="flex flex-col space-y-3" key={i}>
                        <Skeleton className="h-48 w-full rounded-xl" />
                        <div className="space-y-2 flex flex-col">
                            <Skeleton className="h-6 w-3/4"></Skeleton>
                            <Skeleton className="h-4 w-full"></Skeleton>
                            <Skeleton className="h-4 w-2/"></Skeleton>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}