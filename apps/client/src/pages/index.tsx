import React from "react";
import Tag from "ui/src/Components/Tag";
import { useGetPostsQuery } from "@/features/Post/post.api";
import { useGetTagsQuery } from "@/features/Tag/tag.api";
import PublicLayout from "@/Components/Layouts/PublicLayout";
import PostCard from "@/Components/PostCard";
import { IPaginate, IPost } from "..";

interface TitleProps {
  title: string;
}

function Title({ title }: TitleProps) {
  return <h3 className="text-lg font-bold tracking-wide">{title}</h3>;
}

function SideBar() {
  const { data: tags, isSuccess: tagsLoaded } = useGetTagsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  return (
    <div className="col-start-4 col-end-5 hidden lg:block">
      <div className="flex flex-col gap-4">
        <Title title="Useful tags" />
        <div className="flex flex-wrap gap-2">
          {tags?.data.map((tag) => (
            <Tag key={tag.id} tag={tag.name} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Content() {
  const { data: posts } = useGetPostsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  return (
    <div className="col-start-1 col-end-5 lg:col-end-4">
      <div className="flex flex-col gap-4">
        <Title title="Recent Posts" />
        {posts?.data.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PublicLayout>
      <section className="h-[calc(100vh_-_80px)] grid grid-cols-4 gap-4">
        <Content />
        <SideBar />
      </section>
    </PublicLayout>
  );
}
