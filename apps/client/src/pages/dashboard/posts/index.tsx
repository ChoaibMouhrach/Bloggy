import { useGetPostsQuery } from "@/features/apis/postApit";
import { IPost } from "@/index";
import { withAuth } from "@/middlewares";
import { ChangeEvent, useEffect, useState } from "react";
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
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const { data: posts, isLoading } = useGetPostsQuery({
    page: pagination.pageIndex + 1,
    search
  });

  const debounce = (cb: Function, delay = 1000) => {
    let id: NodeJS.Timeout;

    return (...args: any) => {
      clearTimeout(id)

      id = setTimeout(() => {
        cb(...args)
      }, delay)
    }
  }

  const changeIt = debounce((v: string) => setSearch(v))

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    changeIt(e.target.value)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-wide">Posts list</h1>
        <p className="text-stone-500 tracking-wide">
          You can see and manage your posts from here
        </p>
      </div>
      <Table<IPost>
        handleSearch={handleSearch}
        columns={columns}
        data={posts?.data ?? []}
        pageCount={posts ? Math.ceil(posts.count / posts.limit) : 0}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
});

export default Posts;
