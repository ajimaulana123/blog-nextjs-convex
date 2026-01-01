import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent } from "./auth";
import { Doc } from "./_generated/dataModel";

export const createPost = mutation({
    args: { title: v.string(), body: v.string(), imageStorageId: v.id("_storage") },
    handler: async (ctx, args) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        if (!user) {
            throw new ConvexError("Not Authenticated");
        }

        const blogArticle = await ctx.db.insert("posts", {
            title: args.title,
            body: args.body,
            authorId: user._id,
            imageStorageId: args.imageStorageId
        });

        return blogArticle;
    },
});

export const getPosts = query({
    args: {},
    handler: async (ctx) => {
        const posts = await ctx.db.query("posts").order("desc").collect();

        return await Promise.all(
            posts.map(async (post) => {
                const resolvedImageUrl = post.imageStorageId !== undefined ? await ctx.storage.getUrl(post.imageStorageId) : null;

                return {
                    ...post,
                    imageUrl: resolvedImageUrl
                }
            })
        )
    }
});

export const generateImageUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        const user = await authComponent.safeGetAuthUser(ctx);

        if (!user) {
            throw new ConvexError("Not Authenticated");
        }

        return await ctx.storage.generateUploadUrl();
    }
});

export const getBlogById = query({
    args: {
        blogId: v.id("posts")
    },
    handler: async (ctx, args) => {
        const blog = await ctx.db.get(args.blogId);

        if (!blog) {
            return null;
        }

        const resolvedImageUrl = blog.imageStorageId !== undefined ? await ctx.storage.getUrl(blog.imageStorageId) : null;

        return {
            ...blog,
            imageUrl: resolvedImageUrl,
        };
    }
})

interface serachResultTypes {
    _id: string;
    title: string;
    body: string;
}

export const searchPosts =  query({
    args: {
        term: v.string(),
        limit: v.number()
    },
    handler: (async (ctx, args) => {
        const limit  = args.limit;

        const result: Array<serachResultTypes> = [];

        const seen = new Set();

        const pushDocs = async (docs: Array<Doc<"posts">>) => {
            for (const doc of docs ) {
                if (seen.has(doc._id))  continue

                seen.add(doc._id);

                result.push({
                    _id: doc._id,
                    title: doc.title,
                    body: doc.body
                })

                if (result.length >= limit) break;
            }
        }

        const titleMatches = await ctx.db
            .query("posts")
            .withSearchIndex("search_title", (q) => q.search("title", args.term))
            .take(limit);

        await pushDocs(titleMatches);

        if (result.length < limit) {
            const bodyMacthes = await ctx.db
                .query("posts")
                .withSearchIndex("search_body", (q) => q.search("body", args.term))
                .take(limit)
        
            await pushDocs(bodyMacthes);
        }

        return result;
    })
})