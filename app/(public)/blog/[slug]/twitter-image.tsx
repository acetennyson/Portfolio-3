import { OG_SIZE, renderPostCard } from "../../../../lib/og/postCard";

export const alt = "Article by Ado Daniel Nji";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderPostCard(slug);
}
