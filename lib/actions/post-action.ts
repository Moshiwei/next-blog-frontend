'use server'
import { z } from 'zod';
import { redirect } from 'next/navigation';

const PostSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export async function createPost(formtData: FormData) {
    // const validPost = PostSchema.parse(formtData);
    const title = formtData.get("title") as string;
    const content = formtData.get("content") as string;
    // Save the post to the database
    const response = await fetch('http://localhost:3000/api/blog', {
        method: 'POST',
        body: JSON.stringify({title, content}),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if(!response.ok) {
        throw new Error("Failed to create post")
    }
    redirect('http://localhost:3000/blog')
}