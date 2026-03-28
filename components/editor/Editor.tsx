"use client";

import React, { useEffect, useRef } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";

interface EditorProps {
  initialData?: OutputData;
  onChange: (data: OutputData) => void;
}

export default function Editor({ initialData, onChange }: EditorProps) {
  const ejInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }

    return () => {
      ejInstance.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  const initEditor = async () => {
    if (typeof window === "undefined") return;

    // Await imports because of Next.js server side rendering throwing errors on some Editor.js plugins.
    const Header = (await import("@editorjs/header")).default;
    const List = (await import("@editorjs/list")).default;
    const Paragraph = (await import("@editorjs/paragraph")).default;

    const editor = new EditorJS({
      holder: "editorjs-container",
      data: initialData,
      onChange: async () => {
        const data = await editor.save();
        onChange(data);
      },
      tools: {
        header: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          class: Header as any,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        paragraph: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          class: Paragraph as any,
          inlineToolbar: true,
        },
        // We will add image tool configuration later when Firebase storage upload is set up
      },
      placeholder: "Start writing your awesome story here...",
    });

    ejInstance.current = editor;
  };

  return (
    <div className="w-full h-full min-h-[500px] prose dark:prose-invert prose-indigo max-w-none">
      <div id="editorjs-container" className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white" />
    </div>
  );
}
