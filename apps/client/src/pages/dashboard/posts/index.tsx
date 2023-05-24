import PageTitle from "@/Components/PageTitle";
import { useDeletePostMutation, useGetPostsQuery } from "@/features/apis/postApit";
import { debounce } from "@/helpers";
import useToast from "@/hooks/useToast";
import { IPost } from "@/index";
import { withAuth } from "@/middlewares";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { Column, Table } from "ui";

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
  const [deletePost] = useDeletePostMutation();
  const { t } = useToast()

  // state
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  // RTKQ
  const { data: posts, isLoading, refetch } = useGetPostsQuery({
    page: pagination.pageIndex + 1,
    search
  });

  // handlers
  const setSearchWrapper = debounce((v: string) => setSearch(v))
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchWrapper(e.target.value)
  }

  const handleDelete = async (id: number) => {
    const response = await deletePost(id);

    if ("data" in response) {
      await refetch()
      t([{
        state: "success",
        title: "Post deleted successfully"
      }])
      return
    }

    if ("error" in response) {
      t([{
        state: "danger",
        title: "Deleting post failed"
      }])
    }

  }

  return (
    <>
      <PageTitle title="Posts list" description="You can see and manage your posts from here" />
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
