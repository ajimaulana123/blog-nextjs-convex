"use client"

import { signUpSchema } from "@/app/schemas/auth";
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
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
    Controller,
    useForm
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function SignUpPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    function onSubmit(data: z.infer<typeof signUpSchema>) {
        startTransition(async () => {
            await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Account created successfully");
                        router.push("/");
                    },
                    onError: (error) => {
                        toast.error(`Error signing up: ${error.error.message}`);
                    }
                }
            })
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>Sign up for an account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
                        <Controller
                            name="name"
                            control={form.control}
                            rules={{ required: "Full name is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Full Name</FieldLabel>
                                    <Input
                                        aria-invalid={!!fieldState.error}
                                        placeholder="John Doe"
                                        {...field}
                                    />
                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="email"
                            control={form.control}
                            rules={{ required: "Email is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <Input
                                        aria-invalid={!!fieldState.error}
                                        placeholder="john@example.com"
                                        type="email"
                                        {...field}
                                    />
                                    <FieldError errors={fieldState.error ? [fieldState.error] : undefined} />
                                </Field>
                            )}
                        />
                        <Controller
                            name="password"
                            control={form.control}
                            rules={{ required: "Password is required" }}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <Input
                                        aria-invalid={!!fieldState.error}
                                        placeholder="••••••••"
                                        type="password"
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
                                <span>Sign In</span>
                            )}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}