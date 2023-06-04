import { useRouter } from "next/router";
import React, { ChangeEvent, useState } from "react";
import { Column, Table } from "ui";
import PageTitle from "@/Components/PageTitle";
import { useGetRolesQuery } from "@/features/Role/role.api";
import { debounce } from "@/helpers";
import { IRole } from "@/index";
import { withAuth } from "@/middlewares";
import useDestroyRole from "@/features/Role/useDestroyRole";
import { ROLES } from "@/config/constants";

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
  const router = useRouter();

  // state
  const [search, setSearch] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });

  const { destroyRole } = useDestroyRole();

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
    const response = await destroyRole(id);
    if ("data" in response) {
      refetch();
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/roles/edit/${id}`);
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
}, [ROLES.ADMIN]);

export default Index;
