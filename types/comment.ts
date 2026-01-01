import { Id } from "@/convex/_generated/dataModel";

export type Comment = {
    _id: Id<"comments">;
    _creationTime: number;
    body: string;
    authorId: string;
    postId: Id<"posts">;
    authorName: string;
};
