import React from "react";

export default function BlockRenderer({ blocks }: { blocks: any[] }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "header": {
            const Tag = `h${block.data.level}` as keyof React.JSX.IntrinsicElements;
            const sizes: Record<number, string> = { 1: "text-3xl font-black mt-8 mb-4", 2: "text-2xl font-bold mt-6 mb-3", 3: "text-xl font-bold mt-5 mb-2" };
            return (
              <Tag key={index} className={sizes[block.data.level] || "text-lg font-bold mt-4 mb-2"}
                style={{ color: "var(--fg)" }}
                dangerouslySetInnerHTML={{ __html: block.data.text }} />
            );
          }
          case "paragraph":
            return (
              <p key={index} className="leading-relaxed"
                style={{ color: "var(--fg)" }}
                dangerouslySetInnerHTML={{ __html: block.data.text }} />
            );
          case "list": {
            const Tag = block.data.style === "ordered" ? "ol" : "ul";
            return (
              <Tag key={index} className="pl-5 space-y-1.5" style={{ color: "var(--fg)" }}>
                {block.data.items.map((item: string, i: number) => (
                  <li key={i} className="list-disc" dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </Tag>
            );
          }
          case "image":
            return (
              <figure key={index} className="my-8">
                <img src={block.data.url} alt={block.data.caption || ""}
                  className="rounded-xl w-full object-cover" style={{ border: "1px solid var(--border)" }} />
                {block.data.caption && (
                  <figcaption className="text-sm text-center mt-2" style={{ color: "var(--fg-muted)" }}>{block.data.caption}</figcaption>
                )}
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
