import { Link, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiActivity,
  FiUserPlus,
  FiChevronDown,
  FiFileText,
  FiDatabase,
  FiCheckSquare,
  FiMap,
  FiMapPin 
} from "react-icons/fi";

import { useAuth } from "@/context/AuthContext"; // pastikan ini sudah di atas
import { useState, useEffect } from "react";

import { webFetch } from "@/utils/webFetch";
import { toast } from "react-toastify";


export default function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [userPrivilege, setUserPrivilege] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [isDataTeknisOpen, setIsDataTeknisOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const { user } = useAuth(); // gunakan data global

  const [expandedMenu, setExpandedMenu] = useState(null);
  const [expandedSetting, setExpandedSetting] = useState(false);
  const [activeItem, setActiveItem] = useState(window.location.pathname);
  const [menuItems, setMenuItems] = useState([
    { id: "dashboard", path: "/dashboard", icon: <FiHome />, title: "DASHBOARD" }
  ]);

  useEffect(() => {
    const updateYear = () => {
      const storedMenu = localStorage.getItem("selected_menu");
      const storedYear = storedMenu ? localStorage.getItem(`selected_year_${storedMenu}`) : "";
  
    //  console.log(`📌 [Sidebar] Tahun diperbarui dari localStorage: ${storedYear}`);
  
      setSelectedYear(storedYear || "");
    };
  
    updateYear();
  
    window.addEventListener("year_update", updateYear);
  
    return () => {
      window.removeEventListener("year_update", updateYear);
    };
  }, []);
  
  useEffect(() => {
    const updateMenu = () => {
      const storedMenu = localStorage.getItem("selected_menu");
     // console.log("📌 [Sidebar] selected_menu dari localStorage:", storedMenu);
  
      let newMenu = [
        { id: "dashboard", path: "/dashboard", icon: <FiHome />, title: "DASHBOARD" }
      ];
  
      if (storedMenu) {
        const dynamicMenu = {
          data_teknis: { 
            id: "data_teknis", 
            path: "#",
            icon: <FiDatabase />, 
            title: "VERIFIKASI DATA TEKNIS",
            subMenu: [
              { id: "sk", path: "/data-teknis/sk", icon: <FiFileText />, title: "SK (Surat Keputusan)" }, // SK dokumen → File teks
              { id: "dd1", path: "/data-teknis/dd1", icon: <FiMap />, title: "DD1 (Jalan)" }, // DD1 untuk jalan → Pakai ikon peta
              { id: "dd2", path: "/data-teknis/dd2", icon: <FiHome />, title: "DD2 (Jembatan)" }, // DD2 untuk jembatan → Pakai ikon bangunan/jembatan
              { id: "form_ruas", path: "/data-teknis/form-ruas", icon: <FiMapPin />, title: "Form Ruas (Detail Ruas Jalan)" } // Form ruas → Ikon titik lokasi/peta
              
            ]
          },
          usulan_koridor: { id: "usulan_koridor", path: "/usulan-koridor", icon: <FiBarChart2 />, title: "Verifikasi Usulan Koridor" },
          konsultasi_regional: { id: "konsultasi_regional", path: "/konsultasi-regional", icon: <FiActivity />, title: "Konsultasi Regional" },
          dbh_sawit: { id: "dbh_sawit", path: "/dbh-sawit", icon: <FiCheckSquare />, title: "DBH Sawit" }
        };
        if (dynamicMenu[storedMenu]) {
          newMenu.push(dynamicMenu[storedMenu]);
        }
      }
  
    //  console.log("📌 [Sidebar] menuItems setelah update:", newMenu);
      setMenuItems(newMenu);
    };
  
    updateMenu();
    window.addEventListener("menu_update", updateMenu);
  
    return () => {
      window.removeEventListener("menu_update", updateMenu);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = () => {
      const storedPrivilege = localStorage.getItem("user_privilege");
      const storedUser = localStorage.getItem("user_data");

      if (storedPrivilege !== null) {
        setUserPrivilege(Number(storedPrivilege));
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser({
            fullName: parsedUser.fullName || "Pengguna",
            email: parsedUser.email || "email@example.com",
            images: parsedUser.images || "user_default.png",
          });
        } catch (error) {
       //   console.error("❌ Gagal parsing user_data dari LocalStorage:", error);
        }
      }
    };

    fetchUserData();
    window.addEventListener("storage", fetchUserData);

    return () => {
      window.removeEventListener("storage", fetchUserData);
    };
  }, []);

  useEffect(() => {
    setActiveItem(window.location.pathname);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const handleLogout = async () => {
    try {
      const res = await webFetch("logout", {
        method: "POST",
      });
  
      if (res?.success || res?.message === "Logged out") {
        toast.success("🚪 Berhasil logout!");
      } else {
        toast.error("⚠️ Logout gagal. Silakan coba lagi.");
      }
    } catch (error) {
      toast.error("❌ Terjadi kesalahan saat logout.");
      console.error("Logout error:", error);
    } finally {
      sessionStorage.clear();
      window.location.href = "/login"; // Paksa reload bersih
    }
  };
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <>
      {/* Mobile overlay */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 z-10 backdrop-blur-sm transition-all duration-300"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
   <aside 
  className={`bg-sidebar fixed left-0 top-0 bottom-0 z-[50] transition-all duration-300 ease-in-out 
    ${isOpen ? "w-64" : "w-20"} flex flex-col justify-between`}
>



<button
  onClick={toggleSidebar}
  className="absolute -right-3 top-6 bg-blue-600 text-white p-2 rounded-full shadow-md 
    hover:bg-blue-500 transition-all duration-300 border border-blue-400"
>
  <FiChevronLeft
    className={`${isOpen ? "rotate-0" : "rotate-180"} transform transition-transform duration-300`}
  />
</button>


        {/* Sidebar header */}
        <div className={`flex items-center h-16 px-5 border-b border-gray-700/50 bg-gradient-to-r from-gray-900 to-gray-800 ${isOpen ? "justify-start" : "justify-center"}`}>
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105">
              <FiGrid className="text-xl text-white" />
            </div>
            {isOpen && (
              <div className="ml-3">
                <h1 className="text-lg font-bold text-white drop-shadow-md">
                  SiPDJD
                </h1>
                <p className="text-xs text-gray-400 italic">Sistem Pengelolaan Database Jalan Daerah</p>
              </div>
            )}
          </div>
          </div>

{isOpen && (
 <div className="px-4 pt-4">
 {/* Bisa atur spacing di sini */}
    <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 flex items-center">
      <div className="h-px flex-grow bg-gradient-to-r from-transparent via-gray-600 to-transparent mr-2"></div>
      Menu Utama
      <div className="h-px flex-grow bg-gradient-to-r from-gray-600 via-transparent to-transparent ml-2"></div>
    </span>
  </div>
)}


        {/* Sidebar navigation */}
        <nav 
  className={`flex-grow overflow-y-auto px-3 pb-10 custom-scrollbar 
    ${isOpen ? "pt-6 space-y-3" : "pt-12 space-y-6"}`}
>

          {menuItems.map((menu) => (
            <div key={menu.id} className="transition-all">
              {/* Menu item */}
              <button 
                 className={`flex items-center w-full text-left rounded-md transition-all duration-300 px-4 py-3 text-sm 
        font-medium tracking-wide uppercase font-dm
                ${
                  expandedMenu === menu.id || activeItem === menu.path 
                    ? "bg-transparent text-blue-400 border-l-4 border-blue-500 shadow-md"
                    : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 hover:border-l-4 hover:border-blue-500/50"
                }`} 
                onClick={(e) => {
                  e.preventDefault();
                  if (menu.subMenu) {
                    setExpandedMenu(expandedMenu === menu.id ? null : menu.id);
                  } else {
                    setActiveItem(menu.path);
                    navigate(menu.path);
                  }
                }}
              >
                <div className={`text-lg ${
                  expandedMenu === menu.id || activeItem === menu.path 
                     ? "text-blue-400" 
                    : "text-white"
                }`}>
                  {menu.icon}
                </div>

                
                {isOpen && (
                  <div className="ml-3 flex items-center justify-between w-full">
               <span className={`text-[15px] font-semibold tracking-wide transition-all duration-300 ${
                  expandedMenu === menu.id || activeItem === menu.path
                   ? "text-blue-400" 
    : "text-white"
                }`}>
                      {menu.title}
                    </span>
                    {menu.subMenu && (
                      <span className={`transform transition-transform duration-300 ${
                        expandedMenu === menu.id || activeItem === menu.path
                          ? "text-blue-300" 
                          : "text-gray-500"
                      }`}>
                        {expandedMenu === menu.id ? <FiChevronDown /> : <FiChevronRight />}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* Submenu with animation */}
              {expandedMenu === menu.id && menu.subMenu && (
                <div className="ml-6 mt-1 border-l-2 border-blue-500/50 pl-2 overflow-hidden transition-all duration-300 animate-fadeIn">
                  {menu.subMenu.map((sub) => (
                    <Link 
                      key={sub.id} 
                      to={sub.path} 
                      className={`flex items-center p-2 rounded-md my-1 transition-all duration-200 ${
                        activeItem === sub.path 
                          ? "bg-gray-800 text-gray-300 shadow-md border-l-2 border-blue-400"
                          : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 hover:border-l-2 hover:border-blue-400/50"
                      }`}
                      onClick={() => {
                        setActiveItem(sub.path);
                        navigate(sub.path);
                      }}
                    >
                      <div className={`text-sm mr-2 ${
                        activeItem === sub.path 
                          ? "text-blue-300" 
                          : "text-gray-500"
                      }`}>
                        {sub.icon || <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-2"></div>}
                      </div>
                      <span className={`text-sm ${
                        activeItem === sub.path 
                          ? "text-blue-300" 
                          : "text-gray-400"
                      }`}>
                        {sub.title}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}



          {/* Divider */}
          {isOpen && (
  <div className="flex items-center my-4 px-3">
    <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
    <span className="mx-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
      PENGATURAN  
    </span>
    <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
  </div>
)}


{/* Settings section - only for admin */}
          {userPrivilege === 9 && (
            <>
              <button 
                         className={`flex items-center w-full text-left rounded-md transition-all duration-300 px-4 py-3 text-sm 
        font-medium tracking-wide uppercase font-dm
                      ${
                        expandedMenu === "settting" 
                         ? "bg-transparent text-blue-400 border-l-4 border-blue-500 shadow-md"
                    : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 hover:border-l-4 hover:border-blue-500/50"
                      }`}
                onClick={(e) => {
                  e.preventDefault();
                  setExpandedMenu(expandedMenu === "setting" ? null : "setting");
                }}
              >
                <div className={`text-lg ${
                  expandedMenu === "setting" 
                    ? "text-blue-300" 
                    : "text-gray-500"
                }`}>
                  <FiSettings className={expandedMenu === "setting" ? "animate-spin-slow" : ""} />
                </div>
                {isOpen && (
                  <div className="ml-3 flex items-center justify-between w-full">
                    <span className={`font-medium ${
                      expandedMenu === "setting" 
                      ? "text-blue-400" 
                        : "text-white"
                    }`}>
                      PENGATURAN
                    </span>
                    <span className={`transform transition-transform duration-300 ${
                      expandedMenu === "setting" 
                      ? "text-blue-400" 
                      : "text-white"
                    }`}>
                      {expandedMenu === "setting" ? <FiChevronDown /> : <FiChevronRight />}
                    </span>
                  </div>
                )}
              </button>

              {/* Settings submenu */}
{expandedMenu === "setting" && (
  <div className={`mt-1 border-l-2 border-blue-500/50 pl-2 overflow-hidden transition-all duration-300 animate-fadeIn
    ${isOpen ? "ml-6" : "ml-2"}
  `}>
    <Link 
      to="/settings/users" 
      className={`flex items-center p-2 rounded-md my-1 transition-all duration-200 ${
        activeItem === "/settings/users" 
          ? "bg-blue-900/40 text-blue-300 shadow-md border-l-2 border-blue-400" 
          : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 hover:border-l-2 hover:border-blue-400/50"
      }`}
      onClick={() => {
        setActiveItem("/settings/users");
        navigate("/settings/users");
      }}
    >
      <FiUsers className={`text-lg ${
        activeItem === "/settings/users" 
          ? "text-blue-300" 
          : "text-gray-500"
      }`} />
      {isOpen && (
        <span className={`ml-3 text-sm ${
          activeItem === "/settings/users" 
            ? "text-blue-300" 
            : "text-gray-400"
        }`}>
          User
        </span>
      )}
    </Link>

    <Link 
  to="/settings/form-user" 
  className={`flex items-center p-2 rounded-md my-1 transition-all duration-200 ${
    activeItem === "/settings/form-user" 
      ? "bg-blue-900/40 text-blue-300 shadow-md border-l-2 border-blue-400" 
      : "bg-transparent text-gray-400 hover:text-gray-300 hover:bg-gray-800/50 hover:border-l-2 hover:border-blue-400/50"
  }`}
  onClick={() => {
    setActiveItem("/settings/form-user");
    navigate("/settings/form-user");
  }}
>
  {/* Icon tetap muncul */}
  <FiUserPlus className={`text-lg ${
    activeItem === "/settings/form-user" 
      ? "text-blue-300" 
      : "text-gray-500"
  }`} />
  
  {/* Teks hanya muncul jika sidebar terbuka */}
  {isOpen && (
    <span className={`ml-3 text-sm ${
      activeItem === "/settings/form-user" 
        ? "text-blue-300" 
        : "text-gray-400"
    }`}>
      Formulir User
    </span>
  )}
</Link>

                </div>
              )}
            </>
          )}
        </nav>

        {/* User profile section */}
        {isOpen && user && (
  <div className="mt-auto p-4 border-t border-gray-700/50 bg-gradient-to-b from-gray-800/40 to-gray-900/60">
    <div className="flex items-center">
      <div className="relative">
        <img
          src={`https://sipdjd-laravel.test/storage/profile_images/${user.images || "user_default.png"}`}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/50"
        />
      </div>
      <div className="ml-3 w-[150px] min-w-0">
        <p className="text-sm font-medium text-white leading-tight">{user.fullName}</p>
        <p className="text-xs text-gray-400 leading-tight break-words">{user.email}</p>
      </div>
    </div>
  </div>
)}

        {/* Logout button */}
        <div className={`p-3 border-t border-gray-700/50 bg-gradient-to-t from-gray-900/60 to-transparent ${isOpen ? "" : "flex justify-center"}`}>
        <button
  onClick={handleLogout}
  className={`flex items-center w-full p-2 rounded-lg transition-all duration-300
  text-red-400 bg-transparent hover:bg-red-900/30 hover:text-red-300 hover:translate-x-1 group
  ${isOpen ? "" : "justify-center"}`}
  style={{ backgroundColor: "transparent" }}
>

    <FiLogOut className="text-lg" />
    {isOpen && <span className="ml-3 text-sm font-medium">Logout</span>}
  </button>
</div>

      </aside>
    </>
  );
}

// Keeping the original SidebarItem component for reference
function SidebarItem({ to, icon, title, isOpen, isActive, onClick }) {
  return (
    <Link
      to={to || "#"}
      className={`relative flex items-center px-3 py-2.5 rounded-lg transition-all duration-300 group ${
        isActive 
          ? "bg-blue-900/40 text-blue-300 shadow-md border-l-4 border-blue-500" 
          : "bg-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/70 hover:border-l-4 hover:border-blue-500/50"
      }`}
      onClick={onClick}
    >
      {isActive && <span className="absolute inset-y-0 left-0 w-1 bg-blue-400 rounded-r-full"></span>}
      <span className={`text-lg ${isActive ? "text-blue-300" : "text-gray-400 group-hover:text-gray-200"}`}>{icon}</span>
      {isOpen && <span className="ml-3 text-sm font-medium">{title}</span>}
    </Link>
  );
}