"use client"

import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle as ThemeToggle } from "./theme-toggle";
import { useConvexAuth } from "convex/react";
import { authClient } from "@/lib/auth-client";

import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SearchInput } from "./SearchInput";
import { Banana } from "lucide-react";

export function Navbar() {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const router = useRouter();

    return (
        <nav className="w-full py-5 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/">
                    <h1 className="text-3xl font-bold flex gap-1 items-center">
                        <Banana className="text-primary" />
                        Pisang
                    </h1>
                </Link>

                <div className="flex items-center gap-2">
                    <Link className={buttonVariants({ variant: "ghost" })} href="/">Home</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href="/blog">Blog</Link>
                    <Link className={buttonVariants({ variant: "ghost" })} href="/create">Create</Link>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="hidden md:block mr-2">
                    <SearchInput />
                </div>
                {isLoading ? null : isAuthenticated ? (
                    <Button onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                toast.success("Logged out successfully");
                                router.refresh(); 
                                router.push("/");
                            },
                            onError: (error) => {
                                toast.error(`Error logging out: ${error.error.message}`);
                            }
                        }
                    })}>Logout</Button>
                ) : (
                    <>
                        <Link className={buttonVariants()} href='/auth/sign-up'>Sign up</Link>
                        <Link className={buttonVariants({ variant: "outline" })} href='/auth/login'>Login</Link>
                    </>
                )}
                <ThemeToggle />
            </div>
        </nav>
    )
}