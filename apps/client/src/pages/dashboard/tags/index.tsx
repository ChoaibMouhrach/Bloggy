import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { Column, Table } from "ui";
import PageTitle from "@/Components/PageTitle";
import { useGetTagsQuery } from "@/features/Tag/tag.api";
import { debounce } from "@/helpers";
import { ITag } from "@/index";
import { withAuth } from "@/middlewares";
import useDestroyTag from "@/features/Tag/useDestroyTag";
import { ROLES } from "@/config/constants";

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
  const router = useRouter();

  // state
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const { destroyTag } = useDestroyTag();
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
    const response = await destroyTag(id);

    if ("data" in response) {
      await refetch();
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/tags/edit/${id}`);
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
}, [ROLES.ADMIN]);

export default Index;
