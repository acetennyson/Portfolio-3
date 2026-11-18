import { ImageResponse } from "next/og";
import { getPost } from "../blog-server";
import { blogView } from "../blog";
import { SITE_NAME } from "../site";

export const OG_SIZE = { width: 1200, height: 630 };

/** 1200×630 share card for a blog post: small (~30 KB), always correctly sized, never needs the 2 MB cover. */
export async function renderPostCard(slug: string) {
  const blog = await getPost(slug);
  const v = blog ? blogView(blog) : null;

  const title = v?.title ?? "Writing";
  const tags = (v?.tags ?? []).slice(0, 3);
  const meta = [v?.dateLabel].filter(Boolean).join("  ·  ");
  const fontSize = title.length <= 36 ? 84 : title.length <= 70 ? 68 : title.length <= 110 ? 54 : 44;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c0c0d",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#c6ff3d" }} />
            <span style={{ color: "#8d8a84", fontSize: 26, letterSpacing: 2, textTransform: "uppercase" }}>{SITE_NAME}</span>
          </div>
          <span style={{ color: "#c6ff3d", fontSize: 26, letterSpacing: 2, textTransform: "uppercase" }}>Writing</span>
        </div>

        <div style={{ display: "flex", color: "#ede8df", fontSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1 }}>
          {title}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {tags.map((t) => (
              <span
                key={t}
                style={{ display: "flex", color: "#ede8df", fontSize: 24, padding: "8px 20px", border: "2px solid #3a3936", borderRadius: 999 }}
              >
                {t}
              </span>
            ))}
          </div>
          <span style={{ display: "flex", color: "#8d8a84", fontSize: 26 }}>{meta}</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  );
}
