import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => <p className="text-gray-500 animate-pulse p-4">Loading drag and drop editor...</p>,
});

export default Editor;
