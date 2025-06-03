import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { webFetch } from "@/utils/webFetch";
import ResponsiveTableWrapper from "@/components/ResponsiveTableWrapper";
import { toast } from "react-toastify";

const columnHelper = createColumnHelper();

export default function LihatDd1({ selectedProvinsi, selectedKabupaten }) {
  const [dataRuas, setDataRuas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingRuas, setLoadingRuas] = useState(false);
  const [ruasPage, setRuasPage] = useState(1);
  const [totalRuasPages, setTotalRuasPages] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    setRuasPage(1);
  }, [selectedProvinsi, selectedKabupaten]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingRuas(true);
      const params = new URLSearchParams({
        provinsi: selectedProvinsi?.value,
        kabupaten: selectedKabupaten?.value,
        perPage,
        search: searchTerm,
        page: ruasPage,
      });

      try {
        const res = await webFetch(`/dd1?${params.toString()}`);
        setDataRuas(res.data);
        setTotalRuasPages(res.last_page);
      } catch (err) {
        toast.error("❌ Gagal mengambil data ruas.");
        setDataRuas([]);
      } finally {
        setLoadingRuas(false);
      }
    };

    if (selectedProvinsi && selectedKabupaten) fetchData();
  }, [selectedProvinsi, selectedKabupaten, ruasPage, perPage, searchTerm]);


  const Tcolumns = useMemo(() => [
  {
    header: "Identitas Ruas",
    columns: [
      columnHelper.accessor("nomorruas", { header: "Nomor Ruas" }),
      columnHelper.accessor("nmruas", { header: "Nama Ruas" }),
      columnHelper.accessor("kecdilalui", { header: "Kecamatan" }),
      columnHelper.accessor("panjang", { header: "Panjang" }),
      columnHelper.accessor("lebar", { header: "Lebar" }),
    ],
  },
  {
    header: "Kondisi Perkerasan",
    columns: [
      columnHelper.accessor("hotmix", { header: "Hotmix" }),
      columnHelper.accessor("aspal", { header: "Lapen/Makadam" }),
      columnHelper.accessor("beton", { header: "Beton" }),
      columnHelper.accessor("kerikil", { header: "Kerikil" }),
      columnHelper.accessor("tanah", { header: "Tanah" }),
    ],
  },
{
  header: "Panjang Kondisi",
  columns: [
    columnHelper.accessor("baik", { header: "Baik" }),
    columnHelper.accessor("baikper", { header: "Baik %" }),
    columnHelper.accessor("sedang", { header: "Sedang" }),
    columnHelper.accessor("sedangper", { header: "Sedang %" }),
    columnHelper.accessor("rusakringan", { header: "Rusak Ringan" }), // <- ini ganti
    columnHelper.accessor("rusakringanper", { header: "Rusak Ringan %" }),
    columnHelper.accessor("rusakberat", { header: "Rusak Berat" }),
    columnHelper.accessor("rusakberatper", { header: "Rusak Berat %" }),
  ],
},

  {
    header: "Lainnya",
    columns: [
      columnHelper.accessor("lhr", { header: "LHR" }),
      columnHelper.accessor("akses", { header: "Akses ke N/P/K" }),
      columnHelper.accessor("keterangan", { header: "Keterangan" }),
    ],
  },
], []);

  const ruasTable = useReactTable({
    data: dataRuas,
    columns: Tcolumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">📍 Data Tabel DD1</h2>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Cari ruas jalan..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setRuasPage(1);
          }}
          className="border px-4 py-2 rounded w-full md:w-1/2"
        />

        <select
          value={perPage}
          onChange={(e) => {
            setPerPage(Number(e.target.value));
            setRuasPage(1);
          }}
          className="border px-2 py-1 rounded"
        >
          {[10, 20, 50, 100].map((val) => (
            <option key={val} value={val}>
              {val} / halaman
            </option>
          ))}
        </select>
      </div>

      {loadingRuas ? (
        <p className="text-gray-600">Memuat data...</p>
      ) : (
        <ResponsiveTableWrapper>
          <table className="table-auto w-full text-sm md:text-base whitespace-nowrap border border-gray-300">
            <thead className="bg-blue-600 text-white">
              {ruasTable.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="p-4 text-center border border-blue-700"
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {ruasTable.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 text-center border border-gray-200">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTableWrapper>
      )}

      {totalRuasPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <button
            onClick={() => setRuasPage((prev) => Math.max(1, prev - 1))}
            disabled={ruasPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-gray-700 font-medium">
            {ruasPage} / {totalRuasPages}
          </span>
          <button
            onClick={() => setRuasPage((prev) => Math.min(totalRuasPages, prev + 1))}
            disabled={ruasPage === totalRuasPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}