"use client";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import {
  useEditor,
  EditorContent,
  generateHTML,
  generateJSON,
  generateText,
  mergeAttributes,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MdOutlineFormatBold,
  MdOutlineFormatItalic,
  MdOutlineFormatListBulleted,
  MdOutlineFormatListNumbered,
  MdOutlineFormatUnderlined,
} from "react-icons/md";
import { Button } from "ui";
import Heading from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";

interface TipTapProps {
  onChange: (value: string) => void | Promise<void>;
  error?: string;
  help?: string;
}

type Level = 1 | 2 | 3 | 4 | 5 | 6;

const TipTap = ({ help, error, onChange }: TipTapProps) => {
  const editor = useEditor({
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    extensions: [
      Paragraph,
      ListItem,
      Text,
      Document,
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }).extend({
        renderHTML({ node, HTMLAttributes }) {
          const classes: Record<Level, string> = {
            1: "text-3xl",
            2: "text-2xl",
            3: "text-xl",
            4: "text-lg",
            5: "text-sm",
            6: "text-xs",
          };

          const hasLevel = this.options.levels.includes(node.attrs.level);
          const level: Level = hasLevel
            ? node.attrs.level
            : this.options.levels[0];

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: `${classes[level]} font-semibold`,
            }),
            0,
          ];
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "list-decimal",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "outline-none border-0 border-none p-6",
      },
    },
  });

  return (
    <div className="border border-stone-300 rounded-md">
      <div className="flex items-center gap-2 flex-wrap border-b border-stone-300 p-3">
        <Button
          onClick={() => editor?.chain().focus().toggleBold().run()}
          type="button"
          variant="text"
        >
          <MdOutlineFormatBold className="text-xl" />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          type="button"
          variant="text"
        >
          <MdOutlineFormatItalic className="text-xl" />
        </Button>
        <Button
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          type="button"
          variant="text"
        >
          <MdOutlineFormatUnderlined className="text-xl" />
        </Button>

        {/* LISTS */}
        <Button
          type="button"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          variant="text"
        >
          <MdOutlineFormatListBulleted className="text-xl" />
        </Button>
        <Button
          type="button"
          onClick={() => {
            editor?.chain().focus().toggleOrderedList().run();
            console.log("yesy");
          }}
          variant="text"
        >
          <MdOutlineFormatListNumbered className="text-xl" />
        </Button>

        {/* HEADINGS */}
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          type="button"
          variant="text"
        >
          Heading 1
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          type="button"
          variant="text"
        >
          Heading 2
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          type="button"
          variant="text"
        >
          Heading 3
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 4 }).run()
          }
          type="button"
          variant="text"
        >
          Heading 4
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 5 }).run()
          }
          type="button"
          variant="text"
        >
          Heading 5
        </Button>
        <Button
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 6 }).run()
          }
          type="button"
          variant="text"
        >
          Heading 6
        </Button>
      </div>
      <EditorContent editor={editor} />
      {(error || help) && (
        <p
          className={`p-2 tracking-wide text-sm ${error ? "text-red-600" : "text-gray-500"
            }`}
        >
          {error ?? help}
        </p>
      )}
    </div>
  );
};

export default TipTap;
