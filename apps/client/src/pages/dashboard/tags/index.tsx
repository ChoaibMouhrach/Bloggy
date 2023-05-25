import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { Column, Table } from "ui";
import PageTitle from "@/Components/PageTitle";
import { useDeleteTagMutation, useGetTagsQuery } from "@/features/apis/tagApi";
import { debounce } from "@/helpers";
import useToast from "@/hooks/useToast";
import { ITag } from "@/index";
import { withAuth } from "@/middlewares";

const columns: Column<ITag>[] = [
  {
    header: "#",
    accessorKey: "id",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
  },
];

const Index = withAuth(() => {
  const { t } = useToast();
  const router = useRouter();

  // state
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const [deleteTag] = useDeleteTagMutation();
  const {
    data: tags,
    refetch,
    isLoading,
  } = useGetTagsQuery(
    {
      page: pagination.pageIndex + 1,
      search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const changeSearch = debounce((v: string) => setSearch(v));

  const handleSearch = (element: ChangeEvent<HTMLInputElement>) => {
    changeSearch(element.target.value);
  };

  const handleDelete = async (id: number) => {
    const response = await deleteTag(id);

    if ("data" in response) {
      await refetch();
      t([
        {
          state: "success",
          title: "Tag deleted successfully",
        },
      ]);
      return;
    }

    if ("error" in response) {
      t([
        {
          state: "danger",
          title: "We clound't delete your tag",
        },
      ]);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/posts/edit/${id}`);
  };

  return (
    <>
      <PageTitle
        title="Tags list"
        description="You can see and manage your tags from here"
      />
      <Table<ITag>
        handleSearch={handleSearch}
        columns={columns}
        data={tags?.data ?? []}
        pageCount={tags ? Math.ceil(tags.count / tags.limit) : 0}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        handleDelete={handleDelete}
        handleEdit={handleEdit}
      />
    </>
  );
});

export default Index;
