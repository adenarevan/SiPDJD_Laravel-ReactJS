import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { apiFetch } from "@/utils/api";

const columnHelper = createColumnHelper();

export default function LihatSk({ selectedProvinsi, selectedKabupaten }) {
  const [dataSK, setDataSK] = useState([]);

  useEffect(() => {
    if (selectedProvinsi && selectedKabupaten) {
      apiFetch(
        `data-sk?kdlokasi=${selectedProvinsi.value}&kdkabkota=${selectedKabupaten.value}`
      ).then((data) => {
        if (data.success) {
          setDataSK(data.data);
        }
      });
    }
  }, [selectedProvinsi, selectedKabupaten]);

  const dokumenColumns = useMemo(
    () => [
      columnHelper.accessor("tanggal_upload", {
        header: "Tanggal Upload",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("file_excel", {
        header: "File Excel",
        cell: (info) => (
          <a href={info.getValue()} className="text-blue-500 underline">
            Download
          </a>
        ),
      }),
      columnHelper.accessor("file_pdf", {
        header: "File PDF",
        cell: (info) => (
          <a href={info.getValue()} className="text-blue-500 underline">
            Download
          </a>
        ),
      }),
    ],
    []
  );

  const dokumenTable = useReactTable({
    data: dataSK,
    columns: dokumenColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800 mb-4">📄 Dokumen SK</h2>
    <div className="overflow-x-auto max-w-full">
        <table className="w-full border">
          <thead className="bg-blue-600 text-white">
            {dokumenTable.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} className="p-4 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {dokumenTable.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
