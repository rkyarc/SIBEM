import { useState, useEffect } from "react";
import axios from "axios";

interface AnggaranData {
  id: number;
  proker_id: number | null;
  nama_kegiatan: string;
  divisi: string;
  jenis: string;
  jumlah: number;
  keterangan: string | null;
  tanggal: string | null;
  bukti_file: string | null;
  status: string;
}

interface KasRutinData {
  id: number;
  nama: string;
  nominal: number;
  periode: string;
  hari_mingguan: number | null;
  tanggal_bulanan: number | null;
  bulan_tahunan: number | null;
  tanggal_tahunan: number | null;
  tingkatan: string;
  kementerian: string | null;
}

const KEMENTERIAN_OPTIONS = [
  "Advokesma",
  "Kominfo",
  "PSDM",
  "Sosmas",
  "Ekraf",
  "Kastrat",
  "Dagri",
  "Risil",
  "Dalam Negeri",
  "Luar Negeri",
  "Agama",
];

const MAX_BUKTI_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_BUKTI_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];

const getRoleKementerian = (role: string) => {
  const normalizedRole = role.toLowerCase();
  return KEMENTERIAN_OPTIONS.find((dept) => normalizedRole.includes(dept.toLowerCase())) || "";
};

const getApiErrorMessage = (error: any, fallback: string) => {
  const responseData = error?.response?.data;
  if (responseData?.message) return responseData.message;

  const errors = responseData?.errors;
  if (errors && typeof errors === "object") {
    const firstError = Object.values(errors).flat().find(Boolean);
    if (firstError) return String(firstError);
  }

  if (error?.message === "Network Error") {
    return "Tidak bisa terhubung ke server backend. Pastikan Laravel berjalan di .";
  }

  return fallback;
};

const Anggaran = () => {
  const [daftarAnggaran, setDaftarAnggaran] = useState<AnggaranData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nama_kegiatan: "",
    divisi: "",
    jenis: "pengeluaran",
    jumlah: "",
    tanggal: "",
    keterangan: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [viewMode, setViewMode] = useState<"anggaran" | "kas" | "pagu">("anggaran");
  const [daftarPagu, setDaftarPagu] = useState<any[]>([]);
  const [formPagu, setFormPagu] = useState({ kementerian: "", nominal: "" });

  // Kas Rutin state
  const [daftarKasRutin, setDaftarKasRutin] = useState<KasRutinData[]>([]);
  const [formKasRutin, setFormKasRutin] = useState({
    nama: "", nominal: "", periode: "bulanan",
    hari_mingguan: "", tanggal_bulanan: "", bulan_tahunan: "", tanggal_tahunan: "",
  });
  const [isEditKasRutin, setIsEditKasRutin] = useState(false);
  const [editKasRutinId, setEditKasRutinId] = useState<number | null>(null);

  useEffect(() => {
    fetchAnggarans();
    fetchPagu();
    fetchKasRutin();
  }, []);

  async function fetchPagu() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/pagu", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDaftarPagu(response.data);
    } catch (error) {
      console.error("Gagal mengambil pagu:", error);
    }
  }

  const handleSavePagu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPagu.kementerian || !formPagu.nominal) return alert("Isi semua field!");
    try {
      const token = localStorage.getItem("token");
      await axios.post("/api/pagu", {
        kementerian: formPagu.kementerian,
        pagu_awal: Number(formPagu.nominal),
        tahun_periode: new Date().getFullYear().toString()
      }, { headers: { Authorization: `Bearer ${token}` } });
      setFormPagu({ kementerian: "", nominal: "" });
      fetchPagu();
      alert("Alokasi pagu berhasil disimpan!");
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan alokasi pagu");
    }
  };

  // Kas Rutin functions
  async function fetchKasRutin() {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/kas-rutin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDaftarKasRutin(response.data);
    } catch (error) {
      console.error("Gagal mengambil kas rutin:", error);
    }
  }

  const handleSubmitKasRutin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload: any = {
        nama: formKasRutin.nama,
        nominal: formKasRutin.nominal,
        periode: formKasRutin.periode,
        tingkatan: isBendahara ? "Komunal" : "Kementerian",
        kementerian: isBendahara ? null : userRole,
      };
      if (formKasRutin.periode === "mingguan") payload.hari_mingguan = formKasRutin.hari_mingguan;
      if (formKasRutin.periode === "bulanan") payload.tanggal_bulanan = formKasRutin.tanggal_bulanan;
      if (formKasRutin.periode === "tahunan") {
        payload.bulan_tahunan = formKasRutin.bulan_tahunan;
        payload.tanggal_tahunan = formKasRutin.tanggal_tahunan;
      }

      if (isEditKasRutin && editKasRutinId !== null) {
        await axios.put(`/api/kas-rutin/${editKasRutinId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("/api/kas-rutin", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setFormKasRutin({ nama: "", nominal: "", periode: "bulanan", hari_mingguan: "", tanggal_bulanan: "", bulan_tahunan: "", tanggal_tahunan: "" });
      setIsEditKasRutin(false);
      setEditKasRutinId(null);
      fetchKasRutin();
    } catch (error) {
      console.error("Gagal menyimpan kas rutin:", error);
      alert("Gagal menyimpan aturan kas rutin.");
    }
  };

  const handleEditKasRutin = (kas: KasRutinData) => {
    setFormKasRutin({
      nama: kas.nama,
      nominal: kas.nominal.toString(),
      periode: kas.periode,
      hari_mingguan: kas.hari_mingguan?.toString() || "",
      tanggal_bulanan: kas.tanggal_bulanan?.toString() || "",
      bulan_tahunan: kas.bulan_tahunan?.toString() || "",
      tanggal_tahunan: kas.tanggal_tahunan?.toString() || "",
    });
    setIsEditKasRutin(true);
    setEditKasRutinId(kas.id);
  };

  const handleDeleteKasRutin = async (id: number) => {
    if (!confirm("Yakin ingin menghapus aturan kas rutin ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/kas-rutin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchKasRutin();
    } catch (error) {
      console.error("Gagal menghapus kas rutin:", error);
    }
  };

  async function fetchAnggarans(silent = false) {
    if (!silent) setIsFetching(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/anggaran", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDaftarAnggaran(response.data);
    } catch (error) {
      console.error("Gagal mengambil data anggaran:", error);
    } finally {
      if (!silent) setIsFetching(false);
    }
  }

  const handleAddClick = () => {
    const defaultDivisi = isKementerian ? getRoleKementerian(userRole) : "";
    setFormData({
      nama_kegiatan: "",
      divisi: defaultDivisi,
      jenis: "pengeluaran",
      jumlah: "",
      tanggal: "",
      keterangan: "",
    });
    setSelectedFile(null);
    setIsEditMode(false);
    setEditId(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (anggaran: AnggaranData) => {
    setFormData({
      nama_kegiatan: anggaran.nama_kegiatan,
      divisi: anggaran.divisi,
      jenis: anggaran.jenis,
      jumlah: anggaran.jumlah.toString(),
      tanggal: anggaran.tanggal || "",
      keterangan: anggaran.keterangan || "",
    });
    setSelectedFile(null);
    setIsEditMode(true);
    setEditId(anggaran.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFile) {
      if (selectedFile.size > MAX_BUKTI_FILE_SIZE) {
        alert("Ukuran file kuitansi/nota maksimal 5 MB.");
        return;
      }

      if (!ALLOWED_BUKTI_FILE_TYPES.includes(selectedFile.type)) {
        alert("File kuitansi/nota harus berupa JPG, PNG, atau PDF.");
        return;
      }
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");

      const payload = new FormData();
      payload.append("nama_kegiatan", formData.nama_kegiatan);
      payload.append("divisi", formData.divisi);
      payload.append("jenis", formData.jenis);
      payload.append("jumlah", formData.jumlah);
      payload.append("tanggal", formData.tanggal);
      if (formData.keterangan) payload.append("keterangan", formData.keterangan);

      if (selectedFile) {
        payload.append("bukti_file", selectedFile);
      }

      if (isEditMode && editId !== null) {
        // Laravel uses _method for PUT/PATCH with FormData
        payload.append("_method", "PUT");
        await axios.post(
          `/api/anggaran/${editId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("/api/anggaran", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setIsModalOpen(false);
      fetchAnggarans(true);
    } catch (error: any) {
      console.error("Gagal menyimpan anggaran:", error);
      alert(getApiErrorMessage(error, "Terjadi kesalahan saat menyimpan data."));
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (anggaran: AnggaranData, newStatus: string) => {
    const dataSebelumnya = [...daftarAnggaran];

    setDaftarAnggaran((prev) =>
      prev.map((item) =>
        item.id === anggaran.id ? { ...item, status: newStatus } : item
      )
    );

    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/anggaran/${anggaran.id}`, {
        ...anggaran,
        status: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Gagal mengubah status:", error);
      setDaftarAnggaran(dataSebelumnya);
      alert("Terjadi kesalahan saat memvalidasi anggaran.");
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteTargetId === null) return;

    const targetId = deleteTargetId;
    const dataSebelumnya = [...daftarAnggaran];

    setDaftarAnggaran((prev) => prev.filter((item) => item.id !== targetId));
    setIsDeleteModalOpen(false);
    setDeleteTargetId(null);

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/anggaran/${targetId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Gagal menghapus anggaran:", error);
      setDaftarAnggaran(dataSebelumnya);
      alert("Terjadi kesalahan saat menghapus data.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "disetujui":
        return "bg-green-100 text-green-800";
      case "pending":
      case "verifikasi_sekjen":
        return "bg-yellow-100 text-yellow-800";
      case "ditolak":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const formatTanggal = (tanggal: string | null) => {
    if (!tanggal) return "-";
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  };

  // Role sementara didapatkan dari localStorage
  const userRole = localStorage.getItem("role") || "user";
  const isSekjen = userRole.toLowerCase().includes("sekretaris");
  const isPresbem = userRole.toLowerCase().includes("presiden");
  const isBendahara = userRole.toLowerCase().includes("bendahara");
  const isKementerian = userRole.toLowerCase().includes("menteri");

  // Filter kas rutin berdasarkan role
  const getDepartment = (role: string) => {
    const depts = ["advokesma", "kominfo", "psdm", "sosmas", "ekraf", "kastrat", "dagri", "risil"];
    const lowerRole = role.toLowerCase();
    for (const dept of depts) {
      if (lowerRole.includes(dept)) return dept;
    }
    return null;
  };
  const userDept = getDepartment(userRole);
  const filteredKasRutin = daftarKasRutin.filter((kas) => {
    if (kas.tingkatan === "Komunal") return true;
    if (userRole.toLowerCase().includes("admin") || userRole.toLowerCase().includes("presiden") || userRole.toLowerCase().includes("sekretaris") || userRole.toLowerCase().includes("bendahara")) return true;
    if (kas.kementerian) {
      const kasDept = getDepartment(kas.kementerian);
      return kasDept && kasDept === userDept;
    }
    return false;
  });

  return (
    <div className="space-y-4 relative">
      <div className="flex flex-wrap justify-end items-center mb-4 gap-3">
        {/* Tombol toggle Kas Rutin */}
        <button
          onClick={() => setViewMode(viewMode === "kas" ? "anggaran" : "kas")}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm font-medium w-full sm:w-auto"
        >
          {viewMode === "kas" ? (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg> Kembali ke Anggaran</>
          ) : (
            <><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Pengaturan Kas Rutin</>
          )}
        </button>

        {/* Tombol toggle Pagu (hanya Bendahara) */}
        {isBendahara && viewMode === "anggaran" && (
          <button
            onClick={() => setViewMode("pagu")}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm font-medium w-full sm:w-auto"
          >
            Alokasi Pagu Kementerian
          </button>
        )}
        {viewMode === "pagu" && (
          <button
            onClick={() => setViewMode("anggaran")}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm font-medium w-full sm:w-auto"
          >
            Kembali ke Anggaran
          </button>
        )}

        {viewMode === "anggaran" && (
          <button
            onClick={handleAddClick}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition shadow-sm font-medium w-full sm:w-auto"
          >
            + Ajukan Anggaran
          </button>
        )}
      </div>

      {viewMode === "anggaran" && (
        <>
      {/* Ringkasan Anggaran (Pagu Dana) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Pemasukan</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatRupiah(daftarAnggaran.filter(a => a.jenis === 'pemasukan' && a.status === 'disetujui').reduce((acc, curr) => acc + parseFloat(String(curr.jumlah)), 0))}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Pengeluaran (Disetujui)</h3>
          <p className="text-2xl font-bold text-red-500">
            {formatRupiah(daftarAnggaran.filter(a => a.jenis === 'pengeluaran' && a.status === 'disetujui').reduce((acc, curr) => acc + parseFloat(String(curr.jumlah)), 0))}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Total Saldo</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatRupiah(
              daftarAnggaran.filter(a => a.jenis === 'pemasukan' && a.status === 'disetujui').reduce((acc, curr) => acc + parseFloat(String(curr.jumlah)), 0) -
              daftarAnggaran.filter(a => a.jenis === 'pengeluaran' && a.status === 'disetujui').reduce((acc, curr) => acc + parseFloat(String(curr.jumlah)), 0)
            )}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">No.</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Kegiatan</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Divisi</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Jenis</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Nominal</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Tanggal</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-4 py-2 text-sm font-semibold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                      <p>Memuat data anggaran...</p>
                    </div>
                  </td>
                </tr>
              ) : daftarAnggaran.length > 0 ? (
                daftarAnggaran.map((anggaran, i) => (
                  <tr key={anggaran.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700 font-medium">{i + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-800 font-medium">{anggaran.nama_kegiatan}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{anggaran.divisi}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`px-2 py-1 rounded text-[11px] font-semibold ${anggaran.jenis === 'pemasukan' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {anggaran.jenis.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm font-bold text-gray-800">{formatRupiah(anggaran.jumlah)}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{formatTanggal(anggaran.tanggal)}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getStatusColor(anggaran.status)}`}>
                        {anggaran.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex justify-center gap-2">
                      {/* Tombol Approval Berjenjang */}
                      {(isBendahara && anggaran.status === 'pending') && (
                        <button
                          onClick={() => handleStatusChange(anggaran, 'disetujui')}
                          className="text-white bg-green-500 hover:bg-green-600 text-xs font-bold px-2 py-1 rounded-md transition"
                          title="Setujui Anggaran"
                        >
                          ACC
                        </button>
                      )}

                      {(isPresbem && anggaran.status === 'menunggu_presiden') && (
                        <button
                          onClick={() => handleStatusChange(anggaran, 'disetujui')}
                          className="text-white bg-green-500 hover:bg-green-600 text-xs font-bold px-2 py-1 rounded-md transition"
                          title="Persetujuan Akhir"
                        >
                          ACC Final
                        </button>
                      )}

                      {anggaran.bukti_file && (
                        <a
                          href={anggaran.bukti_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold px-2 py-1 rounded-md border border-blue-200 bg-blue-50 hover:bg-blue-100 transition"
                          title="Lihat Kuitansi"
                        >
                          Lihat Kuitansi
                        </a>
                      )}

                      {/* Tolak bisa dilakukan oleh Bendahara (saat pending) atau Presbem (saat menunggu_presiden) */}
                      {((isBendahara && anggaran.status === 'pending') || (isPresbem && anggaran.status === 'menunggu_presiden')) && (
                        <button
                          onClick={() => handleStatusChange(anggaran, 'ditolak')}
                          className="text-white bg-red-500 hover:bg-red-600 text-xs font-bold px-2 py-1 rounded-md transition"
                        >
                          Tolak
                        </button>
                      )}

                      {anggaran.status === 'pending' && (!isBendahara && !isPresbem && !isSekjen) && (
                        <>
                          <button onClick={() => handleEditClick(anggaran)} className="text-orange-600 hover:text-orange-800 text-sm font-medium bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded-md transition">Edit</button>
                          <button onClick={() => handleDeleteClick(anggaran.id)} className="text-red-600 hover:text-red-800 text-sm font-medium bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition">Hapus</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                    <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="font-medium text-gray-600">Belum ada data anggaran.</p>
                      </div>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {viewMode === "pagu" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Total Pagu BEM</h3>
              <p className="text-2xl font-bold text-blue-600">
                {formatRupiah(daftarPagu.find(p => p.kementerian === 'BEM')?.pagu_awal || 0)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Total Telah Dialokasikan</h3>
              <p className="text-2xl font-bold text-orange-500">
                {formatRupiah(daftarPagu.filter(p => p.kementerian !== 'BEM').reduce((sum, curr) => sum + Number(curr.pagu_awal), 0))}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50">
              <h3 className="text-gray-500 text-sm font-medium mb-1">Sisa Belum Dialokasikan</h3>
              <p className="text-2xl font-bold text-green-600">
                {formatRupiah(
                  (daftarPagu.find(p => p.kementerian === 'BEM')?.pagu_awal || 0) -
                  daftarPagu.filter(p => p.kementerian !== 'BEM').reduce((sum, curr) => sum + Number(curr.pagu_awal), 0)
                )}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <form onSubmit={handleSavePagu} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-50 sticky top-4">
                <h3 className="text-md font-bold mb-4 text-gray-800 border-b border-gray-100 pb-2">Atur Alokasi Pagu</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Kementerian</label>
                    <select
                      value={formPagu.kementerian}
                      onChange={e => setFormPagu({...formPagu, kementerian: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                      required
                    >
                      <option value="">-- Pilih Kementerian --</option>
                      {KEMENTERIAN_OPTIONS.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nominal Pagu (Rp)</label>
                    <input
                      type="number"
                      value={formPagu.nominal}
                      onChange={e => setFormPagu({...formPagu, nominal: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                      placeholder="Contoh: 5000000"
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl transition-colors">
                    Simpan Alokasi
                  </button>
                </div>
              </form>
            </div>
            <div className="lg:col-span-2">
              <h3 className="text-md font-bold mb-3 text-gray-800 border-b border-gray-100 pb-2">Daftar Alokasi Kementerian</h3>
              <div className="space-y-3">
                {daftarPagu.filter(p => p.kementerian !== 'BEM').length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <p className="text-sm font-medium text-gray-500">Belum ada pagu yang dialokasikan ke kementerian.</p>
                  </div>
                ) : (
                  daftarPagu.filter(p => p.kementerian !== 'BEM').map((pagu) => (
                    <div key={pagu.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-sm font-extrabold text-gray-900">{pagu.kementerian}</p>
                        <p className="text-xs text-gray-500 mt-1">Periode: {pagu.tahun_periode}</p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <p className="text-lg font-bold text-orange-600">{formatRupiah(pagu.pagu_awal)}</p>
                        <button onClick={() => setFormPagu({ kementerian: pagu.kementerian, nominal: pagu.pagu_awal.toString() })} className="text-[10px] font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors border border-orange-200">Edit</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW KAS RUTIN */}
      {viewMode === "kas" && (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1.5">Manajemen Kas</h2>
            <p className="text-[22px] font-extrabold text-gray-900 leading-tight">Pengaturan Kas Rutin</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Tambah / Edit */}
            {(isBendahara || isKementerian) && (
            <div>
              <form onSubmit={handleSubmitKasRutin} className="bg-gray-50/70 p-4 rounded-2xl border border-gray-100 sticky top-4">
                <h3 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
                  {isEditKasRutin ? "Edit Kas Rutin" : "Tambah Kas Rutin"}
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nama Kas</label>
                    <input type="text" value={formKasRutin.nama} onChange={e => setFormKasRutin({...formKasRutin, nama: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" placeholder="Contoh: Iuran Mingguan" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Nominal (Rp)</label>
                    <input type="number" value={formKasRutin.nominal} onChange={e => setFormKasRutin({...formKasRutin, nominal: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" placeholder="50000" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Periode</label>
                    <select value={formKasRutin.periode} onChange={e => setFormKasRutin({...formKasRutin, periode: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white">
                      <option value="mingguan">Mingguan</option>
                      <option value="bulanan">Bulanan</option>
                      <option value="tahunan">Tahunan</option>
                    </select>
                  </div>
                  {formKasRutin.periode === "mingguan" && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Hari (1=Senin, 7=Minggu)</label>
                      <input type="number" min="1" max="7" value={formKasRutin.hari_mingguan} onChange={e => setFormKasRutin({...formKasRutin, hari_mingguan: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
                    </div>
                  )}
                  {formKasRutin.periode === "bulanan" && (
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal (1-31)</label>
                      <input type="number" min="1" max="31" value={formKasRutin.tanggal_bulanan} onChange={e => setFormKasRutin({...formKasRutin, tanggal_bulanan: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
                    </div>
                  )}
                  {formKasRutin.periode === "tahunan" && (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Bulan (1-12)</label>
                        <input type="number" min="1" max="12" value={formKasRutin.bulan_tahunan} onChange={e => setFormKasRutin({...formKasRutin, bulan_tahunan: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 mb-1">Tanggal (1-31)</label>
                        <input type="number" min="1" max="31" value={formKasRutin.tanggal_tahunan} onChange={e => setFormKasRutin({...formKasRutin, tanggal_tahunan: e.target.value})} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white" />
                      </div>
                    </>
                  )}
                  <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-xl transition-colors text-sm">
                    {isEditKasRutin ? "Simpan Perubahan" : "Tambah Kas Rutin"}
                  </button>
                  {isEditKasRutin && (
                    <button type="button" onClick={() => { setIsEditKasRutin(false); setEditKasRutinId(null); setFormKasRutin({ nama: "", nominal: "", periode: "bulanan", hari_mingguan: "", tanggal_bulanan: "", bulan_tahunan: "", tanggal_tahunan: "" }); }} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-xl transition-colors text-sm">
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </div>
            )}

            {/* Daftar Kas Rutin */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">Daftar Aturan Kas Rutin</h3>
              <div className="space-y-3">
                {filteredKasRutin.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                    <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-sm font-medium text-gray-500">Belum ada aturan kas rutin.</p>
                  </div>
                ) : (
                  filteredKasRutin.map((kas) => (
                    <div key={kas.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center shadow-sm">
                      <div>
                        <p className="text-sm font-extrabold text-gray-900">{kas.nama}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatRupiah(kas.nominal)} / {kas.periode}
                          {kas.periode === 'mingguan' && ` (Hari ke-${kas.hari_mingguan})`}
                          {kas.periode === 'bulanan' && ` (Tgl ${kas.tanggal_bulanan})`}
                          {kas.periode === 'tahunan' && ` (Bulan ${kas.bulan_tahunan} Tgl ${kas.tanggal_tahunan})`}
                        </p>
                        <p className="text-[10px] font-bold text-gray-600 bg-gray-200 inline-block px-2 py-0.5 rounded-md uppercase tracking-wider mt-1">
                          {kas.tingkatan === 'Komunal' ? 'KOMUNAL' : `KEMENTERIAN: ${kas.kementerian}`}
                        </p>
                      </div>
                      {((kas.tingkatan === 'Komunal' && isBendahara) || (kas.tingkatan === 'Kementerian' && kas.kementerian && getDepartment(kas.kementerian) === userDept)) && (
                      <div className="flex flex-col gap-1.5 flex-shrink-0">
                        <button onClick={() => handleEditKasRutin(kas)} className="text-[10px] font-bold text-orange-600 hover:text-white bg-orange-50 hover:bg-orange-600 px-3 py-1.5 rounded-lg transition-colors border border-orange-200">Edit</button>
                        <button onClick={() => handleDeleteKasRutin(kas.id)} className="text-[10px] font-bold text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-colors border border-red-200">Hapus</button>
                      </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[95%] sm:w-full max-w-lg p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isEditMode ? "Edit Anggaran" : "Ajukan Anggaran"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kegiatan/Proker <span className="text-red-500">*</span></label>
                <input type="text" required className="w-full p-2 border border-gray-300 rounded-lg" value={formData.nama_kegiatan} onChange={(e) => setFormData({ ...formData, nama_kegiatan: e.target.value })} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Divisi/Kementerian <span className="text-red-500">*</span></label>
                  <select required className="w-full p-2 border border-gray-300 rounded-lg" value={formData.divisi} onChange={(e) => setFormData({ ...formData, divisi: e.target.value })}>
                    <option value="" disabled>-- Pilih --</option>
                    {KEMENTERIAN_OPTIONS.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis <span className="text-red-500">*</span></label>
                  <select required className="w-full p-2 border border-gray-300 rounded-lg" value={formData.jenis} onChange={(e) => setFormData({ ...formData, jenis: e.target.value })}>
                    <option value="pengeluaran">Pengeluaran (Ajukan)</option>
                    <option value="pemasukan">Pemasukan (Lapor)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nominal (Rp) <span className="text-red-500">*</span></label>
                  <input type="number" min="0" required className="w-full p-2 border border-gray-300 rounded-lg" value={formData.jumlah} onChange={(e) => setFormData({ ...formData, jumlah: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal <span className="text-red-500">*</span></label>
                  <input type="date" required className="w-full p-2 border border-gray-300 rounded-lg" value={formData.tanggal} onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keterangan / Rincian</label>
                <textarea rows={2} className="w-full p-2 border border-gray-300 rounded-lg" value={formData.keterangan} onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Kuitansi / Nota</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  capture="environment"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
                <p className="text-xs text-gray-400 mt-1">Dapat difoto langsung menggunakan HP.</p>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium">Batal</button>
                <button type="submit" disabled={isLoading} className="px-4 py-2 text-white bg-orange-600 hover:bg-orange-700 rounded-lg font-medium disabled:bg-orange-300">{isLoading ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-[95%] sm:w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Data Anggaran?</h3>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium w-full">Batal</button>
              <button onClick={confirmDelete} className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium w-full">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Anggaran;
