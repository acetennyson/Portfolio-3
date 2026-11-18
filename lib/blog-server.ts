import { cache } from "react";
import { getBlogBySlug, getBlogs } from "../firebase/firestore";

/**
 * Request-scoped, de-duplicated reads. generateMetadata, the page and the OG image all need the same post;
 * wrapping in React's cache() means Firestore is hit once per request instead of once per caller.
 */
export const getPost = cache(async (slug: string): Promise<any | null> => getBlogBySlug(slug).catch(() => null));
export const getAllPosts = cache(async (): Promise<any[]> => getBlogs().catch(() => []));
