"use client"

import { Controller, useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader2, MessageSquare } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod";
import { commentSchema } from "@/app/schemas/comments";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import z, { number } from "zod";
import { toast } from "sonner";
import { Comment } from "@/types/comment";
import { Avatar, AvatarImage } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@/components/ui/separator";

type Props = {
    comments: Comment[]
}

export function CommentSection({
    comments
}: Props ) {
    const params = useParams();
    const [isPending, startTransition] = useTransition();
    const createComment = useMutation(api.comments.createComment);

    const form = useForm({
        resolver: zodResolver(commentSchema),
        defaultValues: {
            body: "",
            postId: params.blog as Id<"posts">,
        },
    });

    function onSubmit(data: z.infer<typeof commentSchema>) {
        startTransition(async () => {
            try {
                await createComment(data);
                form.reset();
                toast.success("Comments success");
            } catch {
                toast.error("Failed to create comment");
            }
        });
    }
    
    return (
        <Card>
            <CardHeader className="flex flex-row items-center border-b">
                <MessageSquare className="size-5" />
                <h1 className="text-xl font-bold">
                    {comments.length} comments
                </h1>
            </CardHeader>
            <CardContent className="space-y-8">
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <Controller
                        name="body"
                        control={form.control}
                        rules={{ required: "Body is required" }}
                        render={({ field, fieldState }) => (
                            <Field>
                                <FieldLabel>Comment</FieldLabel>
                                <Textarea
                                    aria-invalid={!!fieldState.error}
                                    placeholder="Share youre comment"
                                    {...field}
                                />
                                <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                            </Field>
                        )}
                    />
                    <Button disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animae-spin" />
                                <span>Loading...</span>
                            </>
                        ) : (
                            <span>Comment</span>
                        )}
                    </Button>
                </form>

                {comments.length > 0 && <Separator />}

                <section className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                            <Avatar className="size-10 shrink-0">
                                <AvatarImage 
                                    src={`https://avatar.vercel.sh/${comment.authorName}`} 
                                    alt={comment.authorName}    
                                />
                                <AvatarFallback>
                                    {comment.authorName.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                                <div className="flex item-center justify-between">
                                    <p className="font-semibold text-sm">
                                        {comment.authorName}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {new Date(comment._creationTime).toLocaleDateString("id-ID")}
                                    </p>
                                </div>

                                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                    {comment.body}
                                </p>
                            </div>
                        </div>
                    ))}
                </section>
            </CardContent>
        </Card>
    )
}