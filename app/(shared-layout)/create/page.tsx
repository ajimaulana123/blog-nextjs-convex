"use client"

import { postSchema } from "@/app/schemas/blog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { redirect } from "next/navigation";

export default function CreateRoute() {
    const generateUploadUrl = useMutation(api.posts.generateImageUploadUrl)
    const mutation = useMutation(api.posts.createPost);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            content: "",
            image: undefined
        },
    });

    async function onSubmit(value: z.infer<typeof postSchema>) {
        startTransition(async () => {
            try {
                const postUrl = await generateUploadUrl();

                const uploadResult = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": value.image.type },
                    body: value.image,
                });
                const { storageId } = await uploadResult.json();

                mutation({
                    title: value.title,
                    body: value.content,
                    imageStorageId: storageId
                });

                toast.success("Everything was fine");

                router.push("/");
            } catch {
                toast.success("Failed upload image");
            }
        });
    }

    return (
        <div className="py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Create Post</h1>
                <p className="text-xl text-muted-foreground pt-4">Share your thoughts with the world</p>
            </div>
            <Card className="w-full max-w-xl mx-auto">
                <CardHeader>
                    <CardTitle>Create Blog Article</CardTitle>
                    <CardDescription>Create a new blog article</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup className="gap-y-4">
                            <Controller
                                name="title"
                                control={form.control}
                                rules={{ required: "Title is required" }}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Title</FieldLabel>
                                        <Input
                                            aria-invalid={!!fieldState.error}
                                            placeholder="super cool title"
                                            type="text"
                                            {...field}
                                        />
                                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="content"
                                control={form.control}
                                rules={{ required: "Content is required" }}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Content</FieldLabel>
                                        <Textarea
                                            aria-invalid={!!fieldState.error}
                                            placeholder="super cool blog content"
                                            {...field}
                                        />
                                        <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                    </Field>
                                )}
                            />
                            <Controller
                                name="image"
                                control={form.control}
                                rules={{ required: "Image is required" }}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Image</FieldLabel>
                                        <Input
                                            aria-invalid={!!fieldState.error}
                                            placeholder="super cool blog content"
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => {
                                                const file = event.target.files?.[0];
                                                field.onChange(file);
                                            }}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
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
                                    <span>Create Post</span>
                                )}
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}