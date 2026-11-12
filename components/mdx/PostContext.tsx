"use client";

import React from "react";

interface PostContextValue {
  slug: string;
}

const PostContext = React.createContext<PostContextValue | null>(null);

export function PostProvider({ slug, children }: { slug: string; children: React.ReactNode }) {
  return <PostContext.Provider value={{ slug }}>{children}</PostContext.Provider>;
}

export function usePost() {
  const context = React.useContext(PostContext);
  if (!context) {
    throw new Error("usePost must be used within PostProvider");
  }
  return context;
}

export function usePostOptional() {
  return React.useContext(PostContext);
}
