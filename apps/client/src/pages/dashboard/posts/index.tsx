import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { Column, Table } from "ui";
import PageTitle from "@/Components/PageTitle";
import { useGetPostsQuery } from "@/features/Post/post.api";
import { debounce } from "@/helpers";
import { IPost } from "@/index";
import { withAuth } from "@/middlewares";
import useDestroyPost from "@/features/Post/useDestroyPost";

const columns: Column<IPost>[] = [
  {
    header: "#",
    accessorKey: "id",
  },
  {
    header: "Title",
    accessorKey: "title",
  },
  {
    header: "Written at",
    accessorKey: "createdAt",
    cell: ({ getValue }) => new Date(String(getValue())).toLocaleString(),
  },
];

const Posts = withAuth(() => {
  // hooks
  const router = useRouter();
  const { destroyPost } = useDestroyPost();

  // state
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const {
    data: posts,
    isLoading,
    refetch,
  } = useGetPostsQuery({
    page: pagination.pageIndex + 1,
    search,
  }, {
    refetchOnMountOrArgChange: true
  });

  // handlers
  const setSearchWrapper = debounce((v: string) => setSearch(v));
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWrapper(e.target.value);
  };

  const handleDelete = async (id: number) => {
    const response = await destroyPost(id);
    if ("data" in response) refetch();
  };

  return (
    <>
      <PageTitle
        title="Posts list"
        description="You can see and manage your posts from here"
      />
      <Table<IPost>
        handleSearch={handleSearch}
        columns={columns}
        data={posts?.data ?? []}
        pageCount={posts ? Math.ceil(posts.count / posts.limit) : 0}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        handleDelete={handleDelete}
        handleEdit={(id: number) => router.push(`/dashboard/posts/edit/${id}`)}
      />
    </>
  );
});

export default Posts;
