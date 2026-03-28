"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Editor from "../../../../components/editor";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { createBlog } from "../../../../firebase/firestore";

export default function NewBlogPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert("Please ensure title, slug, and content are filled.");
      return;
    }

    setIsSaving(true);
    try {
      await createBlog({
        title,
        slug,
        content
      });
      alert("Blog post published successfully!");
      router.push("/admin");
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("Failed to publish blog post.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
          <p className="text-gray-500 mt-2">Write your story using the drag-and-drop block editor.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !content || !title}>
          {isSaving ? "Publishing..." : "Publish Post"}
        </Button>
      </header>

      <section className="space-y-6">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-gray-700">Post Title</label>
            <Input
              id="title"
              placeholder="e.g. My Awesome Post"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Auto-generate slug if it's empty
                if (!slug) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''));
                }
              }}
            />
          </div>
          <div className="flex-1 space-y-2">
            <label htmlFor="slug" className="text-sm font-medium text-gray-700">URL Slug</label>
            <Input
              id="slug"
              placeholder="my-awesome-post"
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
            />
          </div>
        </div>

        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <span className="text-sm font-semibold text-gray-700">Post Content</span>
          </div>
          <Editor
            onChange={(data) => {
              setContent(data);
            }}
          />
        </div>
      </section>
    </div>
  );
}
