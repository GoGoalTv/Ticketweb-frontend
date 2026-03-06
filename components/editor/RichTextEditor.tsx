"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import TextAlign from "@tiptap/extension-text-align";
import {
  List,
  ListOrdered,
  Italic,
  Bold,
  TextAlignStart,
  TextAlignEnd,
  TextAlignCenter,
} from "lucide-react";

export default function RichTextEditor({ value, onChange }: any) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "What's the vibe? Tell people what to expect...",
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "min-h-[180px] px-4 py-3 outline-none text-white",
      },
    },
    onUpdate({ editor }: any) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-3 py-2 border-b border-white/10 text-white/60">
        <button
          type="button"
          className="cursor-pointer"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} />
        </button>

        <button
          type="button"
          className="cursor-pointer"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </button>

        <button
          type="button"
          className="cursor-pointer"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </button>

        <button
          type="button"
          className="cursor-pointer"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </button>

        <hr className="w-px" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          type="button"
          className="cursor-pointer"
        >
          <TextAlignStart size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          type="button"
          className="cursor-pointer"
        >
          <TextAlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          type="button"
          className="cursor-pointer"
        >
          <TextAlignEnd size={18} />
        </button>
      </div>

      {/* Editable Area */}
      <EditorContent editor={editor} />
    </div>
  );
}
