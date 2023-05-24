import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChangeEvent, useState } from "react";
import {
  MdOutlineChevronLeft,
  MdOutlineKeyboardArrowLeft,
  MdOutlineKeyboardArrowRight,
  MdOutlineKeyboardDoubleArrowLeft,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Button } from "../Button";
import { Input } from "../Input";

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pageCount: number;
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void | Promise<void>;
  isLoading: boolean
}

export type Column<T> = ColumnDef<T>;

export const Table = <T extends {}>({
  data,
  pageCount,
  handleSearch,
  columns,
  pagination,
  setPagination,
  isLoading
}: TableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,

    pageCount,

    state: {
      sorting,
      pagination,
    },

    onSortingChange: setSorting,
    onPaginationChange: setPagination,

    // settings
    manualPagination: true,

    // models
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4">
      <Input placeholder="Search..." onChange={handleSearch} />
      <div className="border rounded-md">
        <table className="w-full ">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="text-start p-3 font-semibold tracking-wide"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none flex items-center gap-2 "
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <MdOutlineChevronLeft className="rotate-90" />,
                            desc: (
                              <MdOutlineChevronLeft className="-rotate-90" />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {
              !isLoading &&
              table.getRowModel().rows.map((row) => (
                <tr className="odd:bg-stone-100" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td className="p-3 tracking-wide" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            }
            {
              isLoading && [1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
                <tr key={index} className="border-b-2 border-white" >
                  <td className={`p-3 bg-stone-200 animate-pulse`} colSpan={columns.length} >
                    &nbsp;
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
      {
        !isLoading && (
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                <input
                  type="number"
                  value={table.getState().pagination.pageIndex + 1}
                  onChange={(e) => {
                    const page = e.target.value ? Number(e.target.value) - 1 : 0;
                    table.setPageIndex(page);
                  }}
                  className="border p-1 rounded w-16"
                />
                of {table.getPageCount()}
              </strong>
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <MdOutlineKeyboardDoubleArrowLeft className="fill-white text-xl" />
              </Button>
              <Button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <MdOutlineKeyboardArrowLeft className="fill-white text-xl" />
              </Button>
              <Button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <MdOutlineKeyboardArrowRight className="fill-white text-xl" />
              </Button>
              <Button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <MdOutlineKeyboardDoubleArrowRight className="fill-white text-xl" />
              </Button>
            </div>
          </div>

        )
      }
    </div>
  );
};
