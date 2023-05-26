import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { Column, Table } from "ui";
import PageTitle from "@/Components/PageTitle";
import {
  useDeleteRoleMutation,
  useGetRolesQuery,
} from "@/features/apis/roleApi";
import { debounce } from "@/helpers";
import useToast from "@/hooks/useToast";
import { IRole } from "@/index";
import { withAuth } from "@/middlewares";

const columns: Column<IRole>[] = [
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

  const [deleteRole] = useDeleteRoleMutation();
  const {
    data: roles,
    refetch,
    isLoading,
  } = useGetRolesQuery(
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
    const response = await deleteRole(id);

    if ("data" in response) {
      refetch();
      t([
        {
          state: "success",
          title: "Role deleted successfully",
        },
      ]);
      return;
    }

    if ("error" in response) {
      t([
        {
          state: "danger",
          title: "We clound't delete this role",
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
        title="Roles list"
        description="You can see and manage your roles from here"
      />
      <Table<IRole>
        handleSearch={handleSearch}
        columns={columns}
        data={roles?.data ?? []}
        pageCount={roles ? Math.ceil(roles.count / roles.limit) : 0}
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
