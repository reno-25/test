'use client';

import React, { useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';

interface CustomDataTableProps<T extends object> {
  title?: string;
  data: T[];
  columns: ColumnDef<T>[];
  searchKeys?: (keyof T)[];
}

const CustomDataTable = <T extends object>({
  title = 'Data Table',
  data,
  columns,
  searchKeys,
}: CustomDataTableProps<T>) => {
  const [sorting, setSorting] = useState<any>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // 🔍 Search filter
  const filteredData = useMemo(() => {
    if (!searchKeys || searchKeys.length === 0) return data;
    return data.filter((row) =>
      searchKeys.some((key) =>
        String(row[key]).toLowerCase().includes(globalFilter.toLowerCase())
      )
    );
  }, [data, searchKeys, globalFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-5 w-full">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search..."
        className="border rounded-md px-3 py-2 mb-4 w-full md:w-1/3"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
      />

      {/* 📋 Table */}
      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 border-b text-left font-semibold cursor-pointer select-none"
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <span>
                        {{
                          asc: ' ▲',
                          desc: ' ▼',
                        }[header.column.getIsSorted() as string] ?? ''}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-4 text-gray-500"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>
          <button
            className="ml-2 px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>
        </div>
        <div>
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
};

export default CustomDataTable;
