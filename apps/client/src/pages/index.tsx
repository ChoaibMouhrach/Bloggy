import React from "react";
import Link from "next/link";
import { useGetPostsQuery } from "@/features/Post/post.api";
import { useGetTagsQuery } from "@/features/Tag/tag.api";
import PublicLayout from "@/Components/Layouts/PublicLayout";

function Tag({ name }: { name: string }) {
  return <div className="bg-gray-100 p-2 rounded-md"># {name}</div>;
}

export default function Home() {
  const { data: posts } = useGetPostsQuery({});
  const { data: tags, isSuccess: istagsSuccess } = useGetTagsQuery({});

  return (
    <PublicLayout>
      <section className="h-[calc(100vh_-_80px)] grid grid-cols-4 px-4 lg:px-0">
        <div className="col-start-1 col-end-2 hidden lg:block">
          <div>
            <h3 className="font-semibold">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {istagsSuccess &&
                tags.data.map((tag) => <Tag key={tag.id} name={tag.name} />)}
            </div>
          </div>
        </div>
        <div className="col-start-1 lg:col-start-2 col-end-5 flex flex-col gap-4">
          <h3 className="font-semibold">Recent Posts</h3>
          <div className="lg:grid grid-cols-2 gap-4">
            {posts?.data.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="border border-stone-300 rounded-md p-3 flex flex-col gap-4"
              >
                <div className="text-xl">{post.title}</div>
                <div className="flex flex-wrap gap-4">
                  {post?.tags.map((tag) => (
                    <Tag key={tag.id} name={tag.name} />
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
