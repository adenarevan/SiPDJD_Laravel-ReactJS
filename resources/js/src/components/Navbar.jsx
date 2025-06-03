import { useState, useEffect } from "react";
import { FiBell, FiUser, FiMenu, FiLogOut, FiSettings, FiKey, FiEdit, FiCamera,FiCheck , FiEye , FiEyeOff,FiX,FiCheckSquare   } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Sesuaikan dengan path yang benar
import Select from "react-select";
import VerifikasiModal from "./VerifikasiModal"; // Import Modal

import { webFetch } from "@/utils/webFetch";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";


export default function Navbar({ toggleSidebar }) {

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({});
  const [fields, setFields] = useState({ provinsi: [], kabkota: [] });
  const [imageSelected, setImageSelected] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [lastUploadedImage, setLastUploadedImage] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(false);

  const [showVerifikasiModal, setShowVerifikasiModal] = useState(false);

  const navigate = useNavigate();

  const { user } = useAuth(); // Ambil langsung dari context

//ubah password
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",  // <-- Perbaiki nama field
  });
  
  const [passwordMessage, setPasswordMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });


const handlePasswordChange = (e) => {
  setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
};

useEffect(() => {
  if (user && user.privilege !== undefined) {
    //("🔵 Privilege yang disimpan ke LocalStorage:", user.privilege);

    localStorage.setItem("user_privilege", user.privilege);

    // ✅ Tunggu 100ms sebelum trigger event 'storage' (hindari race condition)
    setTimeout(() => {
      window.dispatchEvent(new Event("storage"));
    }, 100);
  }
}, [user]);



// Toggle Show/Hide Password
const togglePasswordVisibility = (field) => {
  setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
};

// Submit perubahan password
const submitPasswordChange = () => {
  if (passwordData.new_password !== passwordData.new_password_confirmation) {
    setPasswordMessage("❌ Password baru tidak cocok!");
    return;
  }

  setLoading(true);
  
  webFetch("change-password", {
    method: "POST",

    body: JSON.stringify(passwordData),
  })
    .then((data) => {
      setPasswordMessage(data.success ? "✅ Password berhasil diubah!" : `❌ ${data.message}`);
      setLoading(false);
      if (data.success) {
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordData({ current_password: "", new_password: "", confirm_password: "" });
          setPasswordMessage("");
        }, 2000);
      }
    })
    .catch(() => {
      setPasswordMessage("❌ Terjadi kesalahan!");
      setLoading(false);
    });
};



useEffect(() => {
  console.log("User in navbar:", user);
}, [user]);


useEffect(() => {
  if (user?.privilege !== undefined) {
    localStorage.setItem("user_privilege", user.privilege);
    setTimeout(() => window.dispatchEvent(new Event("storage")), 100);
  }
}, [user]);


useEffect(() => {
  if (user) {
    setFormData({
      userid: user.userid || "",
      username: user.username || "",
      kdunit: user.kdunit || "",
      kdsbidang: user.kdsbidang || "",
      provinsi: String(user.kdlokasi) || "",
      kabkota: String(user.kdkabkota) || "",
      privilege: user.privilege || "",
      fullName: user.fullName || "",
      email: user.email || "",
      images: user.images
        ? `${import.meta.env.VITE_API_BASE_URL}/storage/profile_images/${user.images}`
        : "/storage/profile_images/default.png",
      is_active: user.is_active || 1,
    });
  }
}, [user]);



// Ambil data provinsi
useEffect(() => {
  webFetch("provinsi")

    .then((data) => {
      if (data.success) {
        //("Data Provinsi dari API:", data.data);

        const mappedProvinsi = data.data.map((prov) => ({
          value: String(prov.KDLOKASI),
          label: prov.NMLOKASI,
        }));
        setFields((prev) => ({ ...prev, provinsi: mappedProvinsi }));
      }
    })
    .catch((error) => console.error("Error webFetching provinsi:", error));
}, []);


// Ambil data privilege
useEffect(() => {
  webFetch("privilege")
  
    .then((data) => {
      if (data.success) {
        const mappedPrivilege = data.data.map((priv) => ({
          id: priv.kdprivilege,  // Ubah kdprivilege jadi id
          name: priv.nmprivilege // Ubah nmprivilege jadi name
        }));
        setFields((prev) => ({ ...prev, privilege: mappedPrivilege }));
      }
    })
    .catch((error) => console.error("Error webFetching privilege:", error));
}, []);

// Fetch Kabupaten/Kota saat Provinsi berubah
useEffect(() => {
  const fetchKabkota = async () => {
    if (!formData?.provinsi) return; // kalau kosong, keluarin saja

    try {
      const data = await webFetch(`kabkota?kdlokasi=${formData.provinsi}`);
      if (data.success) {
        const mappedKabkota = data.data.map((kab) => ({
          value: String(kab.KDKABKOTA),
          label: kab.NMKABKOTA,
        }));
        setFields((prev) => ({ ...prev, kabkota: mappedKabkota }));
      }
    } catch (error) {
      console.error("❌ Error fetch kabkota:", error);
    }
  };

  fetchKabkota();
}, [formData?.provinsi]);
;


const handleSelectChange = (selectedOption, fieldName) => {
  setFormData((prev) => ({
    ...prev,
    [fieldName]: selectedOption ? selectedOption.value : "",
  }));
};


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};


const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageSelected(file);
    setShowUploadButton(true);
  }
};


const handleSave = async () => {
  try {
    const res = await webFetch("update-profile", {
      method: "POST",
      body: JSON.stringify(formData),
    });

    if (res.success) {
      toast.success("✅ Profil berhasil diperbarui!");
      setIsEditing(false);
    } else {
      toast.error(`❌ Gagal update: ${res.message || "Terjadi kesalahan."}`);
    }
  } catch (err) {
    console.error("❌ Gagal simpan profil:", err);
    toast.error("❌ Gagal menyimpan profil.");
  }
};



const handleImageUpload = () => {
  if (!imageSelected) {
    console.error("File tidak ditemukan!");
    setUploadMessage("❌ Pilih gambar terlebih dahulu.");
    return;
  }

  const formDataData = new FormData();
  formDataData.append("image", imageSelected);

  webFetch("/upload-profile-image", {
    method: "POST",
    body: formDataData,
  })
    .then((data) => {
      if (data.success) {
        toast.success("✅ Upload berhasil!");
        setFormData((prev) => ({ ...prev, images: data.imagePath }));
        setImageSelected(null);
      } else {
        toast.error("❌ Upload gagal: " + (data.message || "Terjadi kesalahan."));
      }
    })
    .catch(async (error) => {
      if (error instanceof Response && error.status === 422) {
        const errData = await error.json();
        const validationErrors = errData.errors;
  
        if (validationErrors && validationErrors.image) {
          toast.error("❌ " + validationErrors.image.join(" "));
          setUploadMessage(validationErrors.image.join(" "));
        } else {
          toast.error("❌ Upload gagal karena data tidak valid.");
          setUploadMessage("❌ Upload gagal karena data tidak valid.");
        }
      } else {
        toast.error("❌ Gagal mengupload gambar.");
        console.error("❌ Error uploading image:", error);
        setUploadMessage("❌ Gagal mengupload. Coba lagi.");
      }
    });
};  

const handleLogout = async () => {
  try {
    // 📨 Kirim request logout ke backend
    await webFetch("logout", { method: "POST" });
  } catch (err) {
    console.error("❌ Logout error (diabaikan):", err);
    // Tetap lanjut walaupun gagal logout di server
  }

  // ✅ Tampilkan toast logout langsung (tidak ditunda)
  toast.success("✅ Logout sukses!", {
    autoClose: 2000,
    style: {
      background: "#1e293b",
      color: "#fff",
      borderRadius: "8px",
      padding: "14px 20px",
      fontWeight: "600",
    },
    iconTheme: {
      primary: "#10b981",
      secondary: "#fff",
    },
  });

  // 🔐 Delay sejenak agar toast tampil dulu
  setTimeout(() => {
    // 🔥 Force redirect (anti gagal) ke login + query untuk toast selamat datang
    window.location.href = "/login?logout=1";

    // 🧹 Bersihkan cookie & storage
    document.cookie = 'XSRF-TOKEN=; Max-Age=0; path=/; domain=.sipdjd-laravel.test; secure';
    document.cookie = 'laravel_session=; Max-Age=0; path=/; domain=.sipdjd-laravel.test; secure';
    localStorage.clear();
    sessionStorage.clear();
  }, 1000); // kasih jeda 1 detik supaya toast keburu muncul
};



const [showAnnouncements, setShowAnnouncements] = useState(false);

const announcements = [
  { id: 1, title: "🚀 Maintenance Server", message: "Maintenance dijadwalkan pada 15 Maret 2025, pukul 22:00 WIB." },
  { id: 2, title: "📢 Update Fitur", message: "Sekarang Anda dapat mengubah tema aplikasi di pengaturan!" },
  { id: 3, title: "🔔 Notifikasi Baru", message: "Jangan lupa perbarui informasi profil Anda agar tetap aman." },
];


  return (
    <>
      {/* Navbar */}
      <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center fixed top-0 left-0 right-0 z-[10000]">
        <button className="p-2 rounded-full hover:bg-gray-200" onClick={toggleSidebar}>
          <FiMenu />
        </button>





        {/* Notifikasi & Menu User * Modal  */}
        <div className="flex space-x-4 items-center relative">
         {/* 🔥 Button Verifikasi */}
         <button 
            className="p-2 rounded-full hover:bg-gray-200 flex items-center"
            onClick={() => setShowVerifikasiModal(true)}
          >
            <FiCheckSquare className="text-xl" />
            <span className="ml-2 hidden md:inline">Verifikasi</span>
          </button>


          
          {/* 🔔 Notifikasi */}
          <div className="relative">
            <button
              className="p-2 rounded-full hover:bg-gray-200 relative"
              onClick={() => setShowAnnouncements(!showAnnouncements)}
            >
              <FiBell className="text-xl" />
              {announcements.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {announcements.length}
                </span>
              )}
            </button>

 
            

            {/* Dropdown Pengumuman */}
            {showAnnouncements && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-md p-3 z-50">
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <h3 className="text-lg font-semibold">📢 Pengumuman</h3>
                  <button onClick={() => setShowAnnouncements(false)} className="text-gray-500 hover:text-gray-700">
                    <FiX />
                  </button>
                </div>

                {/* Daftar Pengumuman */}
                <div className="space-y-3">
                  {announcements.map((item) => (
                    <div key={item.id} className="p-3 bg-gray-100 rounded-md shadow-sm">
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 👤 Menu User */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-200" onClick={() => setShowUserMenu(!showUserMenu)}>
              <FiUser className="text-xl" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 min-w-[180px] max-w-[220px] bg-white shadow-lg rounded-lg p-2 z-50 divide-y divide-gray-200">
                {/* Tombol Profil */}
                <button
                  className="flex items-center px-4 py-2 w-full text-gray-700 hover:bg-gray-100 rounded-md text-left"
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowProfileModal(true);
                  }}
                >
                  <FiSettings className="mr-3 text-gray-600" /> Profil
                </button>

                {/* Tombol Ubah Password */}
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    setShowPasswordModal(true);
                  }}
                  className="flex items-center px-4 py-2 w-full text-gray-700 hover:bg-gray-100 rounded-md text-left"
                >
                  <FiKey className="mr-3 text-gray-600" /> Ubah Password
                </button>

                {/* Tombol Logout */}
                <button
                    className="flex items-center px-4 py-2 w-full text-red-600 hover:bg-red-100 rounded-md text-left"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="mr-3 text-red-500" /> Logout
                  </button>

              </div>
            )}
          </div>
        </div>
      </div>

      {user && (
       <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
       <h2 className="text-xl font-semibold mb-4 text-center">Profil Pengguna</h2>
       <div className="flex flex-col items-center mb-4 relative">
       <img
  src={formData.images ? formData.images : "/storage/profile_images/default.png"}
  alt="Foto Profil"
  className={`w-24 h-24 rounded-full border border-gray-300 shadow-md object-cover ${imageUploaded ? "ring-4 ring-green-500" : ""}`}
/>



          <label className="absolute bottom-0 right-0 bg-gray-500 text-white p-2 rounded-full cursor-pointer flex items-center">
            <FiCamera />
            <input type="file" className="hidden" onChange={handleImageChange} />
          </label>
          {imageSelected && (
            <button
              onClick={handleImageUpload}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
            >
              Upload
            </button>
          )}
          {uploadMessage && <p className="text-sm text-center mt-2 font-semibold text-gray-700">{uploadMessage}</p>}
        </div>


        
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {/* Nama Lengkap */}
         <div>
           <label className="font-medium">Nama Lengkap:</label>
           <input
             type="text"
             name="fullName"
             className="w-full p-2 border rounded-lg"
             value={formData.fullName || ""}
             readOnly={!isEditing}
             onChange={handleChange}
           />
         </div>
     
         {/* Email (Tidak bisa diubah) */}
         <div>
           <label className="font-medium">E-Mail:</label>
                      <input
              type="email"
              name="email"
              className="w-full p-2 border rounded-lg"
              value={formData.email || ""}
              onChange={handleChange}
              readOnly={!isEditing}
            />

         </div>

      {/* Provinsi */}
<label className="font-medium">Provinsi:</label>
<Select
  name="provinsi"
  options={fields.provinsi}
  value={fields.provinsi.find((p) => String(p.value) === String(formData.provinsi)) || null}
  onChange={(selectedOption) => {
    handleSelectChange(selectedOption, "provinsi");
    setFormData((prev) => ({ ...prev, kabkota: "" })); // Reset kabupaten saat provinsi berubah
  }}
  isDisabled={!isEditing}
/>

{/* Kabupaten/Kota */}
<label className="font-medium">Kabupaten/Kota:</label>
<Select
  name="kabkota"
  options={fields.kabkota}
  value={fields.kabkota.find((k) => String(k.value) === String(formData.kabkota)) || null}
  onChange={(selectedOption) => handleSelectChange(selectedOption, "kabkota")}
  isDisabled={!isEditing || !formData.provinsi}
/>


     
         {/* Privilege (Tidak bisa diubah) */}
         <div>
  <label className="font-medium">Privilege:</label>
  <input
    type="text"
    className="w-full p-2 border rounded-lg bg-gray-100"
    value={(fields?.privilege || []).find((priv) => priv.id === formData.privilege)?.name || "Tidak ada"}
    readOnly
  />
</div>

       </div>
     
       {/* Tombol Ubah / Simpan */}
       {!isEditing ? (
         <button
           className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
           onClick={() => setIsEditing(true)}
         >
           <FiEdit className="mr-2" /> Ubah Profil
         </button>
       ) : (
         <div className="flex justify-between mt-6 border-t pt-4">
           <button
             className="px-4 py-2 bg-gray-400 rounded-lg hover:bg-gray-500 text-white"
             onClick={() => setIsEditing(false)}
           >
             Batal
           </button>
           <button
             className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 text-white"
             onClick={handleSave}
           >
             Simpan Perubahan
           </button>
         </div>
       )}

       
     </Modal>
     
      )}


{/* 🔥 Modal Ubah Password */}
<Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl max-w-md sm:max-w-lg md:max-w-xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">🔑 Ubah Password</h2>

          {/* Form */}
          <div className="flex flex-col gap-4">
            {/* Input Password Lama */}
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="current_password"
                placeholder="Password Lama"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 pr-10"
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showPassword.current ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Input Password Baru */}
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="new_password"
                placeholder="Password Baru"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 pr-10"
                onChange={handlePasswordChange}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showPassword.new ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Input Konfirmasi Password Baru */}
            <div className="relative">
            <input
            type={showPassword.confirm ? "text" : "password"}
            name="new_password_confirmation"  // ✅ Gunakan ini!
            placeholder="Konfirmasi Password Baru"
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 pr-10"
            onChange={handlePasswordChange}
          />

              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showPassword.confirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Tombol Simpan */}
            <button
              className={`mt-4 text-lg font-medium text-white px-5 py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
              onClick={submitPasswordChange}
              disabled={loading}
            >
              {loading ? "⏳ Menyimpan..." : "Simpan Password"}
            </button>

            {/* Pesan Feedback */}
            {passwordMessage && <p className="text-center text-sm font-semibold text-gray-700 mt-2">{passwordMessage}</p>}
          </div>
        </div>
      </Modal>


      <VerifikasiModal isOpen={showVerifikasiModal} onClose={() => setShowVerifikasiModal(false)} />


    </>
  );
}
