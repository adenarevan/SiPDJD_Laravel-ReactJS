import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiChevronDown, FiCheckCircle, FiCalendar, FiArrowRight, FiSearch } from "react-icons/fi";
import { FaCheckCircle, FaRoad, FaGlobeAsia, FaTree } from "react-icons/fa";

// ✅ Komponen MenuCard (Kartu untuk setiap menu)
const MenuCard = ({ icon, title, description, color, years, menuId, isSelected, onSelect, onYearChange }) => {
  const [selectedYear, setSelectedYear] = useState(() => localStorage.getItem(`selected_year_${menuId}`) || "2022");
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Ambil tahun dari localStorage setiap kali modal dibuka ulang
  useEffect(() => {
    if (isSelected) {
      const storedYear = localStorage.getItem(`selected_year_${menuId}`);
      if (storedYear) {
        setSelectedYear(storedYear);
      }
    }
  }, [isSelected]);




  const handleYearChange = async (year) => {
    if (year === selectedYear) return;

    setSelectedYear(year);
    localStorage.setItem(`selected_year_${menuId}`, year); // Simpan tahun berdasarkan `menuID`
    window.dispatchEvent(new Event("year_update")); // Kirim event agar sidebar update
  
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/api/set-year", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          menu_id: menuId,
          year: year
        })
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan tahun ke server");
      }

      console.log("Tahun berhasil disimpan:", await response.json());
      onYearChange(menuId, year);
    } catch (error) {
      console.error("Error menyimpan tahun:", error);
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg p-6 border-l-4 transition-all duration-300 cursor-pointer
        ${isSelected ? "border-blue-500 bg-blue-50 scale-105 shadow-xl" : "border-gray-300 bg-white hover:scale-105 hover:shadow-lg"}`}
      onClick={onSelect}
      style={{ borderLeftColor: color }}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl p-2 rounded-full" style={{ color: color }}>
              {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 py-2 rounded-lg"
              onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}
            >
              <FiCalendar />
              {selectedYear}
              <FiChevronDown className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute left-0 top-full bg-white rounded-lg shadow-xl py-1 border border-gray-200 mt-2 z-50"
                style={{ minWidth: "150px" }}>
                {years.map(year => (
                  <button key={year} className="w-full text-left px-4 py-2 hover:bg-gray-100" 
                          onClick={() => {
                            setShowDropdown(false);
                            handleYearChange(year);
                          }}>
                    {year}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm">{description}</p>

        {/* ✅ Tombol tahun tetap ada di semua menu, tapi hanya yang dipilih berwarna biru */}
        <div className="flex gap-2">
          {years.map(year => (
            <button 
              key={year} 
              className={`inline-flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                isSelected && selectedYear === year ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
              onClick={() => handleYearChange(year)}
            >
              {year} <FiArrowRight className="ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function PremiumVerificationModal({ isOpen, onClose }) {
  const [selectedMenuId, setSelectedMenuId] = useState(() => localStorage.getItem("selected_menu") || "");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Ambil data dari localStorage setiap kali modal dibuka ulang
  useEffect(() => {
    if (isOpen) {
      const storedMenuId = localStorage.getItem("selected_menu");
      if (storedMenuId) {
        setSelectedMenuId(storedMenuId);
      }
    }
  }, [isOpen]);



const handleMenuSelect = (menuId) => {
  console.log("📌 [Modal] Menu dipilih:", menuId); // 🔍 Debugging

  localStorage.setItem("selected_menu", menuId);
  window.dispatchEvent(new Event("menu_update")); // ✅ Paksa sidebar update tanpa refresh
  setSelectedMenuId(menuId);
};

  if (!isOpen) return null;

  const menuItems = [
    {
      menuId: "data_teknis",
      icon: <FaCheckCircle />,
      title: "Verifikasi Data Teknis",
      description: "Validasi data teknis proyek",
      color: "#10B981",
      years: ["2022", "2023", "2024", "2025"]
    },
    {
      menuId: "usulan_koridor",
      icon: <FaRoad />,
      title: "Verifikasi Usulan Koridor",
      description: "Evaluasi usulan koridor pembangunan",
      color: "#EC4899",
      years: ["2022", "2023", "2024", "2025"]
    },
    {
      menuId: "konsultasi_regional",
      icon: <FaGlobeAsia />,
      title: "Konsultasi Regional",
      description: "Layanan konsultasi pembangunan wilayah",
      color: "#3B82F6",
      years: ["2022", "2023", "2024", "2025"]
    },

    {
      menuId: "dbh_sawit",
      icon: <FaTree />,
      title: "DBH Sawit",
      description: "Dana bagi hasil pengembangan kelapa sawit",
      color: "#10B981",
      years: ["2025"] // ✅ Hanya tersedia tahun 2025
    }
  ];

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md z-50">

<div className="relative w-full max-w-5xl p-6 bg-white rounded-2xl shadow-2xl max-h-screen overflow-auto">

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Menu Verifikasi</h2>
          <button 
  onClick={onClose} 
  className="absolute top-3 right-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 z-50"
>
<FiX className="text-gray-700 sm:text-xl text-lg" />

</button>

        </div>

        <p className="text-gray-600 mb-4">Pilih menu dan tahun yang ingin Anda akses</p>

        {/* ✅ Search Bar */}
        <div className="relative mb-4">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari menu..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
            <MenuCard key={item.menuId} {...item} isSelected={selectedMenuId === item.menuId} onSelect={() => handleMenuSelect(item.menuId)} />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
