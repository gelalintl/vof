"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Undo2,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { toEditorHtml } from "@/lib/richText";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  name,
  placeholder = "Rédigez votre contenu…",
  required = false,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: toEditorHtml(value),
    onUpdate: ({ editor: instance }) => {
      onChange(instance.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-purple max-w-none min-h-48 px-3 py-2.5 text-justify font-sans text-sm text-slate-800 outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor || editor.isFocused) {
      return;
    }

    const next = toEditorHtml(value);
    if (next !== editor.getHTML()) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  return (
    <div className={cn("vof-rich-text mt-1.5 overflow-hidden border border-slate-200 bg-white", className)}>
      {name ? <input type="hidden" name={name} value={value} required={required} /> : null}

      <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-slate-50 px-1.5 py-1">
        <ToolbarButton
          label="Titre H2"
          active={editor?.isActive("heading", { level: 2 })}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Titre H3"
          active={editor?.isActive("heading", { level: 3 })}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          label="Gras"
          active={editor?.isActive("bold")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italique"
          active={editor?.isActive("italic")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          label="Liste à puces"
          active={editor?.isActive("bulletList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Liste numérotée"
          active={editor?.isActive("orderedList")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          label="Citation"
          active={editor?.isActive("blockquote")}
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Séparateur"
          disabled={!editor}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus className="size-4" />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          label="Annuler"
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Rétablir"
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarDivider() {
  return <span className="mx-1 h-5 w-px bg-slate-200" aria-hidden />;
}

function ToolbarButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center text-slate-600 hover:bg-violet-50 hover:text-[#6d28d9] disabled:pointer-events-none disabled:opacity-40",
        active && "bg-violet-100 text-[#6d28d9]",
      )}
    >
      {children}
    </button>
  );
}
