"use client"

import { loginSchema } from "@/app/schemas/auth";

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

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
    Controller,
    useForm
} from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function LoginPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    function onSubmit(data: z.infer<typeof loginSchema>) {
        startTransition(async () => {
            await authClient.signIn.email({
                email: data.email,
                password: data.password,
                fetchOptions: {
                    onSuccess: () => {
                        toast.success("Logged in successfully");
                        router.push("/");
                    },
                    onError: (error) => {
                        toast.error(`Error logging in: ${error.error.message}`);
                    }
                }
            })
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login to get strated right away</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup className="gap-y-4">
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
                                <span>Log In</span>
                            )}
                        </Button>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    )
}
