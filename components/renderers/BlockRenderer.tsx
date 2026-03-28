import React from "react";
import type { JSX } from "react";

interface BlockData {
  type: string;
  data: any;
}

export default function BlockRenderer({ blocks }: { blocks: BlockData[] }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "header":
            const HeaderTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
            return (
              <HeaderTag
                key={index}
                className="font-bold text-gray-900 dark:text-gray-100"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          case "paragraph":
            return (
              <p
                key={index}
                className="text-gray-700 leading-relaxed dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          case "list":
            const ListTag = block.data.style === "ordered" ? "ol" : "ul";
            return (
              <ListTag key={index} className="list-inside list-disc pl-4 space-y-1">
                {block.data.items.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ListTag>
            );
          case "image":
            return (
              <figure key={index} className="my-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={block.data.url}
                  alt={block.data.caption || "Blog Image"}
                  className="rounded-xl shadow-md w-full object-cover"
                />
                {block.data.caption && (
                  <figcaption className="text-sm text-center text-gray-500 mt-2">
                    {block.data.caption}
                  </figcaption>
                )}
              </figure>
            );
          default:
            console.warn(`Unknown block type: ${block.type}`);
            return null;
        }
      })}
    </div>
  );
}
