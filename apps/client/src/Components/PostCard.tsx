import React from "react";
import Link from "next/link";
import Tag from "ui/src/Components/Tag";
import { IPost } from "..";

interface PostCardProps {
  post: IPost;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="flex p-4 rounded-md flex-col gap-4 border border-stone-300">
      <Link
        href={`/posts/${post.id}`}
        className="text-lg font-semibold hover:underline"
      >
        {post.title}
      </Link>
      <div>
        {post?.tags.map((tag) => (
          <Tag key={tag.id} tag={tag.name} />
        ))}
      </div>
    </div>
  );
}
