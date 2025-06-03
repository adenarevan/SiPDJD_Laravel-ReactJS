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
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import * as Tooltip from '@radix-ui/react-tooltip';
import { toast } from "react-toastify";
import { useAuth } from '@/context/AuthContext';

const columnHelper = createColumnHelper();

export default function LihatSk({ selectedProvinsi, selectedKabupaten }) {
  const { user, authChecked } = useAuth();
  const [dataSK, setDataSK] = useState([]);
  const [dataRuas, setDataRuas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingDokumen, setLoadingDokumen] = useState(false);
  const [loadingRuas, setLoadingRuas] = useState(false);
  const [ruasPage, setRuasPage] = useState(1);
  const [totalRuasPages, setTotalRuasPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingVerifikasi, setPendingVerifikasi] = useState(null);
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);
  const [triggerFetch, setTriggerFetch] = useState(0);

  const handleConfirmVerifikasi = async () => {
    if (!pendingVerifikasi) return;

    const { id, newValue, type } = pendingVerifikasi;

    if (!newValue) {
      toast.error("⚠️ Pilih terlebih dahulu: Verifikasi atau Kirim Revisi.");
      return;
    }

    if (newValue === 2 && keterangan.trim() === "") {
      toast.error("📝 Komentar revisi wajib diisi!");
      return;
    }

    try {
      let response;

      if (type === "pusat") {
        response = await updateVerifikasi(id, newValue, keterangan);
      } else if (type === "balai") {
        response = await updateVerifikasiBalai(id, newValue, keterangan);
      }

      if (response?.success) {
        toast.success(
          type === "pusat"
            ? "✅ Verifikasi pusat berhasil disimpan!"
            : "✅ Verifikasi balai berhasil disimpan!"
        );
        await fetchData();
      } else {
        toast.error("❌ Gagal menyimpan verifikasi. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("⚠️ Terjadi kesalahan saat menyimpan.");
      console.error("❌ Error simpan verifikasi:", error);
    } finally {
      setModalOpen(false);
      setPendingVerifikasi(null);
      setKeterangan("");
    }
  };

  const fetchData = async () => {
    setLoadingDokumen(true);
    setLoadingRuas(true);

    const params = new URLSearchParams({
      kdlokasi: selectedProvinsi.value,
      kdkabkota: selectedKabupaten.value,
      ruas_page: ruasPage,
      perPage: perPage,
      search: searchTerm,
    });

    try {
      const data = await webFetch(`data-sk?${params.toString()}`);
      if (data.success) {
        setDataSK(data.dokumen || []);
        const ruasPagination = data.data_sk;
        setDataRuas(ruasPagination.data || []);
        setTotalRuasPages(ruasPagination.last_page || 1);
      } else {
        setDataSK([]);
        setDataRuas([]);
      }
    } catch (err) {
      toast.error("Gagal ambil data ruas jalan. Silakan coba lagi.");
      console.error("❌ Gagal fetch data SK:", err);
      setDataSK([]);
      setDataRuas([]);
    } finally {
      setLoadingDokumen(false);
      setLoadingRuas(false);
    }
  };

  useEffect(() => {
    setRuasPage(1);
  }, [selectedProvinsi, selectedKabupaten]);

  useEffect(() => {
    if (!authChecked || !user) return; // ⛔ jangan fetch dulu
    if (selectedProvinsi && selectedKabupaten) {
      fetchData();
    }
  }, [authChecked, user, selectedProvinsi, selectedKabupaten, ruasPage, perPage, searchTerm, triggerFetch]);

  useEffect(() => {
    const handleUpdate = () => {
      console.log("🔄 Tahun/menu berubah");
      setTriggerFetch((prev) => prev + 1); // trigger ulang
    };
  
    window.addEventListener("year_update", handleUpdate);
    window.addEventListener("menu_update", handleUpdate);
  
    return () => {
      window.removeEventListener("year_update", handleUpdate);
      window.removeEventListener("menu_update", handleUpdate);
    };
  }, []);





  useEffect(() => {
    if (pendingVerifikasi?.keterangan) {
      setKeterangan(pendingVerifikasi.keterangan);
    }
  }, [pendingVerifikasi]);

  const updateVerifikasi = async (id, status, keterangan = "") => {
    try {
      return await webFetch(`verifikasi-pusat-simpan/${id}`, {
        method: "POST",
        body: JSON.stringify({ status, keterangan }),
      });
    } catch (error) {
      toast.error("Gagal update verifikasi pusat. Silakan coba lagi.");
      console.error("Gagal update verifikasi pusat:", error);
    }
  };

  const updateVerifikasiBalai = async (id, status, keterangan = "") => {
    try {
      return await webFetch(`verifikasi-balai/${id}`, {
        method: "POST",
        body: JSON.stringify({ status, keterangan }),
      });
    } catch (error) {
      toast.error("Gagal update verifikasi balai. Silakan coba lagi.");
      console.error("Gagal update verifikasi balai:", error);
    }
  };



/// Fetch data SK saat provinsi dan kabupaten dipilih

/// Kolom untuk tabel ruas jalan
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

/// Kolom untuk tabel dokumen SK
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

  
/// Kolom untuk file PDF
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
          const isAdmin = user?.privilege === 9 && user?.sub_privilege === 10;
      
          const handleChange = (e) => {
            const newValue = e.target.checked ? 1 : 0;
            setPendingVerifikasi({
              id: row.id,
              newValue,
              type: "pusat",
              keterangan: row.keterangan || "",
            });
            setModalOpen(true);
          };
      
          const showRevisi = value === 2;
      


          return (

            <div className="flex items-center justify-center">
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <label
                      className={clsx(
                        "relative inline-flex items-center group",
                        !isAdmin && "cursor-not-allowed",
                        isAdmin && "cursor-pointer"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={value === 1}
                        disabled={!isAdmin}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={clsx(
                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out border-2",
                          value === 1
                            ? "bg-green-600 border-green-700"
                            : showRevisi
                            ? "bg-yellow-300 border-yellow-500 animate-pulse"
                            : "bg-gray-100 border-gray-400",
                          isAdmin
                            ? "group-hover:ring-4 group-hover:ring-green-300 shadow-lg"
                            : "opacity-50"
                        )}
                      >
                        {value === 1 && (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="4"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                        {showRevisi && (
                          <svg
                            className="w-4 h-4 text-yellow-700"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  </Tooltip.Trigger>
      
                  {row.keterangan && (
                    <Tooltip.Content
                      side="top"
                      className="bg-black text-white px-3 py-1 text-xs rounded shadow-md z-50"
                    >
                      📝 {row.keterangan}
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  )}
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          );
        },
      }),
      

      columnHelper.accessor("verifikasibalai", {
        header: "Verifikasi Balai",
        cell: (info) => {
          const value = info.getValue();
          const row = info.row.original;
          const isAdmin = user?.privilege === 3;
      
          const handleChange = (e) => {
            const newValue = e.target.checked ? 1 : 0;
            setPendingVerifikasi({
              id: row.id,
              newValue,
              type: "balai",
              keterangan: row.keteranganbalai || "", // 📝 komentar balai
            });
            setModalOpen(true);
          };
      
          const showRevisi = value === 2;
      
          return (
            <div className="flex items-center justify-center">
              <Tooltip.Provider delayDuration={0}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <label
                      className={clsx(
                        "relative inline-flex items-center group",
                        !isAdmin && "cursor-not-allowed",
                        isAdmin && "cursor-pointer"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={value === 1}
                        disabled={!isAdmin}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        className={clsx(
                          "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ease-in-out border-2",
                          value === 1
                            ? "bg-green-600 border-green-700"
                            : showRevisi
                            ? "bg-yellow-300 border-yellow-500 animate-pulse"
                            : "bg-gray-100 border-gray-400",
                          isAdmin
                            ? "group-hover:ring-4 group-hover:ring-green-300 shadow-lg"
                            : "opacity-50"
                        )}
                      >
                        {value === 1 && (
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
                        {showRevisi && (
                          <svg
                            className="w-4 h-4 text-yellow-700"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.232 5.232l3.536 3.536M9 11l6-6 3.536 3.536-6 6H9v-3.536z"
                            />
                          </svg>
                        )}
                      </div>
                    </label>
                  </Tooltip.Trigger>
      
                  {row.keteranganbalai && (
                    <Tooltip.Content
                      side="top"
                      className="bg-black text-white px-3 py-1 text-xs rounded shadow-md z-50"
                    >
                      📝 {row.keteranganbalai}
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  )}
                </Tooltip.Root>
              </Tooltip.Provider>
            </div>
          );
        },
      }),
      

    ],
    [user] // ✅ supaya kolom re-render kalau user berubah
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

  useEffect(() => {
    if (pendingVerifikasi?.keterangan) {
      setKeterangan(pendingVerifikasi.keterangan);
    }
  }, [pendingVerifikasi]);
  
  
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
<table className="table-auto w-full text-sm md:text-base whitespace-nowrap border border-gray-300">

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
  <div className="mb-4 flex items-center gap-4">
<input
    type="text"
    placeholder="Cari ruas jalan..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setRuasPage(1); // Reset ke halaman 1 saat search
    }}
    className="border px-4 py-2 rounded w-full md:w-1/2"
  />

<select
    value={perPage}
    onChange={(e) => {
      setPerPage(parseInt(e.target.value));
      setRuasPage(1);
    }}
    className="border px-2 py-1 rounded"
  >
    <option value="10">10 / halaman</option>
    <option value="20">20 / halaman</option>
    <option value="50">50 / halaman</option>
    <option value="100">100 / halaman</option>
    <option value="150">150 / halaman</option>
  </select>
</div>
{loadingRuas ? (
  <p className="text-gray-600">Loading data ruas...</p>
) : (
  <>
    {/* 🛑 Tampilkan pesan jika hasil pencarian kosong */}
    {filteredRuas.length === 0 ? (
      <p className="text-gray-600">Tidak ada hasil untuk pencarian ini.</p>
    ) : (
      <ResponsiveTableWrapper>
        <table className="table-auto w-full text-sm md:text-base whitespace-nowrap">
          <thead className="bg-blue-600 text-white">
            {ruasTable.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th
                  key={header.id}
                  className="p-4 text-center whitespace-nowrap border border-gray-300 bg-blue-600 text-white"
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
               <td
               key={cell.id}
               className="p-4 text-center align-middle border border-gray-200"
             >
               {flexRender(cell.column.columnDef.cell, cell.getContext())}
             </td>
             
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ResponsiveTableWrapper>
    )}



  {/* ✅ Pagination selalu tampil kalau ada lebih dari 1 halaman */}
    {totalRuasPages > 1 && (
      <div className="mt-4 flex justify-center gap-2">
        <button
          onClick={() => setRuasPage((prev) => Math.max(1, prev - 1))}
          disabled={ruasPage === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1 font-medium text-gray-700">
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
  </>
)}


{/* Gunakan AnimatePresence untuk animasi modal */}
<AnimatePresence>
  {modalOpen && (
    <Dialog.Root open={modalOpen} onOpenChange={setModalOpen}>
      <Dialog.Portal forceMount>
      <Dialog.Overlay className="fixed inset-0 bg-black/80 z-40" />

        <Dialog.Content asChild>

        <motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  className="fixed top-1/2 left-1/2 z-50 w-[95vw] max-w-2xl -translate-x-1/2 -translate-y-1/2 
             bg-gray-900 text-white p-6 rounded-2xl shadow-2xl border border-gray-700"
>


<Dialog.Title className="text-xl font-semibold mb-4">
  {pendingVerifikasi?.newValue === 1
    ? "✅ Konfirmasi Verifikasi"
    : pendingVerifikasi?.newValue === 2
    ? "✏️ Kirim Revisi"
    : "Konfirmasi Aksi"}
</Dialog.Title>

<p className="mb-4 text-sm text-gray-300">
  {pendingVerifikasi?.newValue === 1
    ? "Apakah kamu yakin ingin MENYETUJUI dokumen ini?"
    : pendingVerifikasi?.newValue === 2
    ? "Kamu akan mengirim permintaan REVISI. Masukkan catatan revisi agar bisa diperbaiki."
    : "Apakah kamu yakin ingin menyimpan status ini?"}
</p>

{/* 🧠 Pilihan Verifikasi / Revisi */}
{(user?.privilege === 9 || user?.privilege === 3) && (
  <div className="mb-4">
    <label className="block text-sm text-gray-400 mb-2">  🛠 Aksi Verifikasi {pendingVerifikasi?.type === "balai" ? "Balai" : "Pusat"}
    </label>
    <div className="space-y-2 text-sm text-white">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="verifikasiType"
          value={1}
          checked={pendingVerifikasi?.newValue === 1}
          onChange={() =>
            setPendingVerifikasi({ ...pendingVerifikasi, newValue: 1 })
          }
        />
        ✅ Setujui Dokumen
      </label>

      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="verifikasiType"
          value={2}
          checked={pendingVerifikasi?.newValue === 2}
          onChange={() =>
            setPendingVerifikasi({ ...pendingVerifikasi, newValue: 2 })
          }
        />
        ✏️ Kirim Komentar (Revisi)
      </label>
    </div>
  </div>
)}

{/* 📝 Textarea untuk keterangan */}
{(user?.privilege === 9 || user?.privilege === 3|| pendingVerifikasi?.newValue === 2) && (
  <div className="mb-6">
    <label className="block text-sm text-gray-400 mb-1">
      📝 {keterangan ? "Edit Keterangan" : "Tambah Keterangan"}
    </label>
    <textarea
      className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
      rows={3}
      value={keterangan}
      onChange={(e) => setKeterangan(e.target.value)}
      placeholder="Contoh: Dokumen kurang lengkap"
    />
    {pendingVerifikasi?.newValue === 2 && keterangan.trim() === "" && (
      <p className="text-xs text-red-400 mt-1">Komentar revisi wajib diisi</p>
    )}
  </div>
)}


  <div className="flex justify-end gap-2">
    <button
      onClick={() => setModalOpen(false)}
      className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-white"
    >
      Batal
    </button>
    <button
      disabled={loading} onClick={handleConfirmVerifikasi}
      className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold"
    >
      {loading ? "Menyimpan..." : "Simpan"}
    </button>
  </div>
</motion.div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )}
</AnimatePresence>

    </>
  );
  
}
