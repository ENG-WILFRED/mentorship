"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { X } from "lucide-react";
import InputField from "../form fields/InputField";
import Button from "../Button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  showFilters?: boolean;
}

export default function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  showFilters = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Get unique values for filters
  const getUniqueSchools = () => {
    const schools = new Set<string>();
    data.forEach((row: any) => {
      if (row.school) schools.add(row.school);
    });
    return Array.from(schools).sort();
  };

  // Get current filter values
  const statusFilter =
    (table.getColumn("status")?.getFilterValue() as string) ?? "";
  const priorityFilter =
    (table.getColumn("priority")?.getFilterValue() as string) ?? "";
  const schoolFilter =
    (table.getColumn("school")?.getFilterValue() as string) ?? "";

  // Check if any filters are active
  const hasActiveFilters = statusFilter || priorityFilter || schoolFilter;

  // Clear all filters
  const clearFilters = () => {
    table.getColumn("status")?.setFilterValue("");
    table.getColumn("priority")?.setFilterValue("");
    table.getColumn("school")?.setFilterValue("");
  };

  return (
    <div className="space-y-4 px-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-4">
        {/* Search Bar */}
        {searchKey && (
          <div className="flex items-center w-auto">
            <InputField
              name="search"
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="w-auto"
            />
          </div>
        )}

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex flex-col md:flex-row gap-2 ">
              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  table
                    .getColumn("status")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="FULFILLED">Fulfilled</SelectItem>
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select
                value={priorityFilter}
                onValueChange={(value) =>
                  table
                    .getColumn("priority")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                </SelectContent>
              </Select>

              {/* School Filter */}
              <Select
                value={schoolFilter}
                onValueChange={(value) =>
                  table
                    .getColumn("school")
                    ?.setFilterValue(value === "all" ? "" : value)
                }
              >
                <SelectTrigger className="w-full sm:w-50">
                  <SelectValue placeholder="School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Schools</SelectItem>
                  {getUniqueSchools().map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button type="button" onClick={clearFilters} className="w-auto flex items-center">
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600">
            <span className="font-medium">Active filters:</span>
            {statusFilter && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md">
                Status: {statusFilter}
              </span>
            )}
            {priorityFilter && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-md">
                Priority: {priorityFilter}
              </span>
            )}
            {schoolFilter && (
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md">
                School: {schoolFilter}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-gray-600">
          Showing {table.getRowModel().rows.length} of {data.length} results
        </div>
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
