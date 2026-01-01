import { Id } from "@/convex/_generated/dataModel";
import BlogClient from "./blog-client"

type Props = {
    params: {
        blog: Id<"posts">
    };
};

export default async function BlogPage({ params }: Props) {
    const { blog } = await params

    return <BlogClient blogId={blog} />
}

