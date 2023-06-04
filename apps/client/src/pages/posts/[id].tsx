import React from "react";
import { useRouter } from "next/router";
import { EditorContent, useEditor, mergeAttributes } from "@tiptap/react";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
// do not remove
import Heading, { Level } from "@tiptap/extension-heading";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import ListItem from "@tiptap/extension-list-item";
import Paragraph from "@tiptap/extension-paragraph";
import Head from "next/head";
import StarterKit from "@tiptap/starter-kit";
import { useGetPostQuery } from "@/features/Post/post.api";
import PublicLayout from "@/Components/Layouts/PublicLayout";
import { IPost } from "@/index";

interface PostContentProps {
  post: IPost;
}

function PostContent({ post }: PostContentProps) {
  const editor = useEditor({
    content: post?.content ?? "",
    editable: false,
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

          // eslint-disable-next-line react/no-this-in-sfc
          const hasLevel = this.options.levels.includes(node.attrs.level);
          const level: Level = hasLevel
            ? node.attrs.level
            : // eslint-disable-next-line react/no-this-in-sfc
              this.options.levels[0];

          return [
            `h${level}`,
            // eslint-disable-next-line react/no-this-in-sfc
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
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <EditorContent editor={editor} />
    </>
  );
}

export default function Post() {
  const id = Number(useRouter().query.id);
  const { data: post, isSuccess, isLoading } = useGetPostQuery(id);

  return (
    <PublicLayout>
      <div className="container mx-auto">
        {isSuccess && <PostContent post={post} />}
      </div>
    </PublicLayout>
  );
}
