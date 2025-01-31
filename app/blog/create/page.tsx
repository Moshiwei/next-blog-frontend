'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Form from "next/form"
import { createPost } from "@/lib/actions/post-action"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";

import * as commands from "@uiw/react-md-editor/commands"

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  { ssr: false }
);

export default function CreatePost() {
  const [content, setContent] = useState("**Hello world!!!**");
  return (
    <>
    <section className="flex-grow">
      <h1 className="mb-8 text-2xl font-semibold tracking-tighte text-center">
        Create a Post
      </h1>
      <Form action={createPost} className="flex flex-col gap-4">
        <label>
          Title
          {/* input must have a name prop to make sure the submition of for data are correct */}
          <Input type="text" name="title" className="w-full" />
        </label>
        <label>
          Content
          <MDEditor
          value={content}
          onChange={(value) => setContent(value || '')}
          height={400}
        />
        {/* 隐藏的 input，用于存储 MDEditor 的值 */}
        <input type="hidden" name="content" value={content} />
        </label>
        <Button type="submit">Create Post</Button>
      </Form>
    </section>
    </>
  )
}