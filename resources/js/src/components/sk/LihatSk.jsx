import { useEffect, useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { apiFetch } from "@/utils/api";
import ResponsiveTableWrapper from "@/components/ResponsiveTableWrapper";
import { webFetch } from "@/utils/webFetch";
const columnHelper = createColumnHelper();


export default function LihatSk({ selectedProvinsi, selectedKabupaten }) {
  const [dataSK, setDataSK] = useState([]);

  const [dataRuas, setDataRuas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDokumen, setLoadingDokumen] = useState(false);
  const [loadingRuas, setLoadingRuas] = useState(false);
  

  const [user, setUser] = useState(null);

useEffect(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      console.error("User JSON error:", err);
    }
  }
}, []);


  useEffect(() => {
    if (selectedProvinsi && selectedKabupaten) {
      setLoadingDokumen(true);
      setLoadingRuas(true);
  
      webFetch(`data-sk?kdlokasi=${selectedProvinsi.value}&kdkabkota=${selectedKabupaten.value}`)
        .then((data) => {
          if (data.success) {
            setDataSK(data.dokumen || []);
            setDataRuas(data.data_sk || []);
          } else {
            setDataSK([]);
            setDataRuas([]);
          }
        })
        .catch((err) => {
          console.error("Gagal fetch data SK:", err);
          setDataSK([]);
          setDataRuas([]);
        })
        .finally(() => {
          setLoadingDokumen(false);
          setLoadingRuas(false);
        });
    }
  }, [selectedProvinsi, selectedKabupaten]);
  
  const Tcolumns = useMemo(() => [
    columnHelper.accessor("nomor_ruas", {
      header: "Nomor Ruas",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("nama_ruas", {
      header: "Nama Ruas",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("kecamatan", {
      header: "Kecamatan yang Dilalui",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("panjang", {
      header: "Panjang (m)",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("lebar", {
      header: "Lebar (m)",
      cell: (info) => info.getValue(),
    }),
  ], []);


  const dokumenColumns = useMemo(
    () => [
      columnHelper.accessor("tglUpload", {
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


      columnHelper.accessor("verifikasi", {
        header: "Verifikasi Pusat",
        cell: (info) => {
          const value = info.getValue();
          const row = info.row.original;
      
          const isAdmin = user?.privilege === 9 && user?.subprivilege === 10;
      
          const handleChange = async (e) => {
            const newValue = e.target.checked ? 1 : 0;
            // Call API untuk update status verifikasi
            await updateVerifikasi(row.id, newValue);
          };
      
          return (
            <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={!!value}
              disabled={!isAdmin}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className={`
              w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out
              border-2
              ${!!value ? "bg-green-600 border-green-700" : "bg-gray-100 border-gray-400"}
              ${isAdmin ? "group-hover:ring-4 group-hover:ring-green-300 shadow-lg" : "opacity-50 cursor-not-allowed"}
            `}>
              {!!value && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
          
          
          );
        },
      }),
      
      columnHelper.accessor("verifikasibalai", {
        header: "Verifikasi Balai",
        cell: (info) => {
          const value = info.getValue();
          const row = info.row.original;
      
          const isAdmin = user?.privilege === 9 && user?.subprivilege === 10;
      
          const handleChange = async (e) => {
            const newValue = e.target.checked ? 1 : 0;
            await updateVerifikasiBalai(row.id, newValue);
          };
      
          return (
            <label className="relative inline-flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={!!value}
              disabled={!isAdmin}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className={`
              w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out
              border-2
              ${!!value ? "bg-green-600 border-green-700" : "bg-gray-100 border-gray-400"}
              ${isAdmin ? "group-hover:ring-4 group-hover:ring-green-300 shadow-lg" : "opacity-50 cursor-not-allowed"}
            `}>
              {!!value && (
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </label>
          
          
          
          
          );
        },
      }),
      



    ],
    []
  );

  const dokumenTable = useReactTable({
    data: dataSK,
    columns: dokumenColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const filteredRuas = useMemo(() => {
    if (!searchTerm) return dataRuas;
  
    return dataRuas.filter((item) => {
      const keyword = searchTerm.toLowerCase();
      return (
        (item.nomor_ruas || "").toLowerCase().includes(keyword) ||
        (item.nama_ruas || "").toLowerCase().includes(keyword) ||
        (item.kecamatan || "").toLowerCase().includes(keyword)
      );
    });
  }, [searchTerm, dataRuas]);



  const ruasTable = useReactTable({
    data: filteredRuas, // ✅ Gunakan hasil filter
    columns: Tcolumns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  return (
    <>
      {/* 📄 DOKUMEN SK */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">📄 Dokumen SK</h2>
  
      {loadingDokumen  ? (
        <p className="text-gray-600">Loading data SK...</p>
      ) : dataSK.length === 0 ? (
        <p className="text-gray-600">Tidak ada data SK untuk wilayah ini.</p>
      ) : (
        <ResponsiveTableWrapper>
<table className="table-auto w-full text-sm md:text-base whitespace-nowrap">

  <thead className="bg-blue-600 text-white">
            {dokumenTable.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} className="p-4 text-center whitespace-nowrap">
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
                  <td key={cell.id} className="p-4 text-center align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTableWrapper>
      )}
  
      {/* 📍 DATA RUAS */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">📍 Data Ruas Jalan</h2>


  {/* 🔍 Input Cari */}
<div className="mb-4">
  <input
    type="text"
    placeholder="Cari ruas jalan..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border px-4 py-2 rounded w-full md:w-1/2"
  />
</div>


      {loadingRuas  ? (
        <p className="text-gray-600">Loading data ruas...</p>
      ) : dataRuas.length === 0 ? (
        <p className="text-gray-600">Tidak ada data ruas jalan untuk wilayah ini.</p>
      ) : (

          <ResponsiveTableWrapper>
            <table className="table-auto w-full text-sm md:text-base whitespace-nowrap">
              <thead className="bg-blue-600 text-white">
                {ruasTable.getHeaderGroups().map((group) => (
                  <tr key={group.id}>
                    {group.headers.map((header) => (
                      <th key={header.id} className="p-4 text-center whitespace-nowrap">
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
                      <td key={cell.id} className="p-4 text-center align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </ResponsiveTableWrapper>

      )}
    </>
  );
  
  
}
