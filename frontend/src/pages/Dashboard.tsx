import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [anggaranData, setAnggaranData] = useState<any[]>([]);
  const [prokerData, setProkerData] = useState<any[]>([]);
  const [kakData, setKakData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paguDariDB, setPaguDariDB] = useState<number>(0);
  const [isEditingPagu, setIsEditingPagu] = useState(false);
  const [inputPagu, setInputPagu] = useState("");

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [periodeFilter, setPeriodeFilter] = useState('Semua Periode');
  const [kementerianFilter, setKementerianFilter] = useState('Semua Kementerian');

  // Role Management
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const userRole = user?.role || "";
  const userDivisi = userRole.split(' ').slice(1).join(' ');
  const isBPH = ["presiden", "wakil", "bendahara", "sekretaris"].some(keyword => userRole.toLowerCase().includes(keyword));
  const isPresbem = userRole.toLowerCase().includes("presiden");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch All API parallel
        const [anggaranRes, prokerRes, kakRes, paguRes, usersRes] = await Promise.all([
          axios.get('/api/anggaran', { headers }).catch(() => ({ data: [] })),
          axios.get('/api/proker', { headers }).catch(() => ({ data: [] })),
          axios.get('/api/kak', { headers }).catch(() => ({ data: [] })),
          axios.get('/api/pagu', { headers }).catch(() => ({ data: [] })),
          axios.get('/api/users', { headers }).catch(() => ({ data: [] }))
        ]);

        // Filter based on division if not BPH
        let filteredAnggaran = anggaranRes.data;
        let filteredProker = prokerRes.data;
        let filteredKak = kakRes.data;

        if (!isBPH && userDivisi) {
          filteredAnggaran = filteredAnggaran.filter((a: any) => a.divisi?.toLowerCase() === userDivisi.toLowerCase());
          filteredProker = filteredProker.filter((p: any) => p.divisi?.toLowerCase() === userDivisi.toLowerCase());
          filteredKak = filteredKak.filter((k: any) => k.divisi?.toLowerCase() === userDivisi.toLowerCase());
        }

        setAnggaranData(filteredAnggaran);
        setProkerData(filteredProker);
        setKakData(filteredKak);
        setUserData(usersRes.data.data || usersRes.data || []);
        
        const paguTarget = isBPH ? "BEM" : userDivisi;
        const myPagu = paguRes.data.find((p: any) => p.kementerian?.toLowerCase() === paguTarget?.toLowerCase());
        setPaguDariDB(myPagu ? Number(myPagu.pagu_awal) : 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isBPH, userDivisi]);

  const handleSavePagu = async () => {
    try {
      const token = localStorage.getItem("token");
      const kementerianTarget = isBPH ? "BEM" : userDivisi;
      await axios.post('/api/pagu', {
        kementerian: kementerianTarget,
        pagu_awal: Number(inputPagu),
        tahun_periode: new Date().getFullYear().toString()
      }, { headers: { Authorization: `Bearer ${token}` } });
      setPaguDariDB(Number(inputPagu));
      setIsEditingPagu(false);
    } catch (e) {
      console.error(e);
      alert("Gagal menyimpan pagu");
    }
  };
  // 3. Dynamic Data: Status KAK & Kegiatan Helpers
  const formatTanggal = (tanggal: string) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };
  const formatWaktu = (tanggal: string) => {
    if (!tanggal) return "-";
    return new Date(tanggal).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  const formatStatusText = (status: string) => {
    if (!status) return "-";
    const s = status.toLowerCase();
    if (s === "pending") return "Menunggu Approval";
    if (s.startsWith("revisi")) return "Direvisi";
    if (s === "disetujui" || s === "acc") return "Disetujui";
    if (s === "ditolak") return "Ditolak";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const normalizeText = (value: unknown) => String(value ?? "").toLowerCase();

  const getDateValue = (item: any) => item.created_at || item.tanggal || item.tanggal_pelaksanaan || item.updated_at || "";

  const getPeriodeText = (item: any) => {
    const dateValue = getDateValue(item);
    if (!dateValue) return "";

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  const getKementerianFromRole = (role: string) => {
    const roleText = role?.trim() || "";
    const roleLower = roleText.toLowerCase();
    const excludedRoles = [
      "admin",
      "presiden bem",
      "wakil presiden bem",
      "bendahara",
      "bendahara 1",
      "bendahara 2",
      "sekretaris",
      "sekretaris 1",
      "sekretaris 2",
    ];

    if (!roleLower || excludedRoles.includes(roleLower)) return "";

    return roleText.replace(/^(Menteri|Sekjen|Staff|Staf)\s+/i, "").trim();
  };

  const matchesDashboardFilters = (item: any, searchableFields: unknown[]) => {
    const statusText = formatStatusText(item.status);
    const periodeText = getPeriodeText(item);
    const kementerianText = item.divisi || item.kementerian || "";
    const haystack = searchableFields.map(normalizeText).join(" ");

    const matchSearch = !searchQuery.trim() || haystack.includes(normalizeText(searchQuery.trim()));
    const matchStatus = statusFilter === 'Semua Status' || statusText === statusFilter;
    const matchPeriode = periodeFilter === 'Semua Periode' || periodeText === periodeFilter;
    const matchKementerian = kementerianFilter === 'Semua Kementerian' || kementerianText === kementerianFilter;

    return matchSearch && matchStatus && matchPeriode && matchKementerian;
  };

  const dashboardItems = [...prokerData, ...kakData, ...anggaranData];

  const periodeMap = dashboardItems.reduce<Map<string, number>>((map, item) => {
    const periode = getPeriodeText(item);
    const dateValue = getDateValue(item);
    const timestamp = dateValue ? new Date(dateValue).getTime() : 0;
    if (periode && (!map.has(periode) || timestamp > map.get(periode)!)) {
      map.set(periode, timestamp);
    }
    return map;
  }, new Map<string, number>());

  const uniquePeriode = Array.from(periodeMap.entries())
    .sort(([, timeA], [, timeB]) => timeB - timeA)
    .map(([periode]) => periode);

  const kementerianFromUsers = userData.map(user => getKementerianFromRole(user.role)).filter(Boolean);
  const kementerianFromItems = dashboardItems.map(item => item.divisi || item.kementerian).filter(Boolean);
  const uniqueKementerian = Array.from(new Set([...kementerianFromUsers, ...kementerianFromItems])).sort() as string[];

  const uniqueStatus = Array.from(new Set(dashboardItems.map(item => formatStatusText(item.status)).filter(status => status !== "-"))).sort();

  const filteredProkers = prokerData.filter(p => {
    return matchesDashboardFilters(p, [
      p.nama_proker,
      p.divisi,
      p.deskripsi,
      formatStatusText(p.status),
      getPeriodeText(p),
    ]);
  });

  const filteredKak = kakData.filter(k => {
    return matchesDashboardFilters(k, [
      k.nama_kegiatan,
      k.divisi,
      k.tipe_pengajuan,
      k.link_drive,
      k.catatan_revisi,
      formatStatusText(k.status),
      getPeriodeText(k),
    ]);
  });

  const filteredAnggaran = anggaranData.filter(a => {
    return matchesDashboardFilters(a, [
      a.nama_kegiatan,
      a.divisi,
      a.jenis,
      a.keterangan,
      a.jumlah,
      formatStatusText(a.status),
      getPeriodeText(a),
    ]);
  });

  const isFilterActive = Boolean(searchQuery.trim()) ||
    statusFilter !== 'Semua Status' ||
    periodeFilter !== 'Semua Periode' ||
    kementerianFilter !== 'Semua Kementerian';

  // 1. Dynamic Data: Monitoring Pagu Anggaran
  const totalPengeluaran = filteredAnggaran.filter(a => a.jenis === 'pengeluaran' && a.status === 'disetujui').reduce((sum, curr) => sum + Number(curr.jumlah), 0);

  const paguTotal = paguDariDB || 0;
  const paguAnggaran = {
    total: paguTotal,
    terpakai: totalPengeluaran,
    sisa: paguTotal - totalPengeluaran,
  };
  const persentasePagu = paguAnggaran.total > 0 ? Math.min((paguAnggaran.terpakai / paguAnggaran.total) * 100, 100) : 0;
  const statusPagu = persentasePagu > 80 ? 'Kritis' : persentasePagu > 50 ? 'Waspada' : 'Aman';

  const formatRupiah = (angka: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);

  // 2. Dynamic Data: Statistik Performa Kementerian
  const approvedProkers = filteredProkers.filter(p => p.status?.toLowerCase() === 'disetujui' || p.status?.toLowerCase() === 'acc');
  const jumlahProker = approvedProkers.length;

  const jumlahProkerSelesai = approvedProkers.filter(p => {
    const kakApproved = kakData.some(k => k.nama_kegiatan === p.nama_proker && k.tipe_pengajuan === 'kak' && (k.status.toLowerCase() === 'disetujui' || k.status.toLowerCase() === 'acc'));
    const lpjApproved = kakData.some(k => k.nama_kegiatan === p.nama_proker && k.tipe_pengajuan === 'lpj' && (k.status.toLowerCase() === 'disetujui' || k.status.toLowerCase() === 'acc'));
    return kakApproved && lpjApproved;
  }).length;

  const jumlahProkerMenunggu = jumlahProker - jumlahProkerSelesai;

  const statistik = {
    totalProker: jumlahProker,
    selesai: jumlahProkerSelesai,
    menunggu: jumlahProkerMenunggu
  };

  const kegiatanTerbaru = [...filteredProkers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map(p => ({
    id: p.id,
    nama: p.nama_proker,
    status: formatStatusText(p.status),
    tanggal: formatTanggal(p.created_at),
    waktu: formatWaktu(p.created_at)
  }));

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Disetujui": return "text-green-600 bg-green-50";
      case "Ditolak": return "text-red-600 bg-red-50";
      case "Direvisi": return "text-orange-600 bg-orange-50";
      case "Menunggu Approval": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-500 bg-gray-50";
    }
  };

  // 4. Progress Kegiatan (3 Proker dengan update terbaru)
  const progressKegiatan = [...filteredProkers]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3)
    .map((p, index) => {
      const isProkerAcc = p.status?.toLowerCase() === 'disetujui' || p.status?.toLowerCase() === 'acc';
      const isProkerTolak = p.status?.toLowerCase() === 'ditolak' || p.status?.toLowerCase() === 'tolak';

      const kakApproved = kakData.some(k => k.nama_kegiatan === p.nama_proker && k.tipe_pengajuan === 'kak' && (k.status.toLowerCase() === 'disetujui' || k.status.toLowerCase() === 'acc'));
      const lpjApproved = kakData.some(k => k.nama_kegiatan === p.nama_proker && k.tipe_pengajuan === 'lpj' && (k.status.toLowerCase() === 'disetujui' || k.status.toLowerCase() === 'acc'));

      let percentage = 0;
      if (isProkerTolak) percentage = 0;
      else if (lpjApproved) percentage = 100;
      else if (kakApproved) percentage = 75;
      else if (isProkerAcc) percentage = 25;
      else percentage = 10; // Proker masih pending

      const colors = [
        { c: "text-orange-400", b: "bg-orange-400" },
        { c: "text-green-500", b: "bg-green-500" },
        { c: "text-blue-500", b: "bg-blue-500" }
      ];
      return {
        id: p.id,
        nama: p.nama_proker,
        persentase: percentage,
        color: colors[index % colors.length].c,
        bg: colors[index % colors.length].b
      };
    });

  // 5. Approval Terbaru (Kini dari KAK & LPJ, mengikuti filter dashboard)
  const approvalTerbaru = [...filteredKak]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)
    .map(k => {
      const textStatus = formatStatusText(k.status);
      let colorClass = "bg-gray-100 text-gray-600";
      if (textStatus === "Disetujui") colorClass = "bg-green-100 text-green-600";
      if (textStatus === "Direvisi") colorClass = "bg-orange-100 text-orange-600";
      if (textStatus === "Ditolak") colorClass = "bg-red-100 text-red-600";
      if (textStatus === "Menunggu Approval") colorClass = "bg-yellow-100 text-yellow-600";

      return {
        id: k.id,
        nama: k.nama_kegiatan,
        tipe: k.tipe_pengajuan ? k.tipe_pengajuan.toUpperCase() : 'KAK',
        divisi: k.divisi,
        status: textStatus,
        colorClass: colorClass
      };
    });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center space-x-2">
        <div className="w-8 h-8 border-4 border-[#FBBF24] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Memuat Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Responsif */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
        <div className="flex-1 min-w-[200px] flex items-center bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
          <svg className="w-5 h-5 text-gray-400 mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Cari kegiatan, KAK/LPJ, anggaran..."
            className="w-full outline-none bg-transparent text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="px-4 py-2 bg-white border border-gray-100 rounded-xl outline-none text-gray-500 text-sm shadow-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="Semua Status">Semua Status</option>
          {uniqueStatus.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 bg-white border border-gray-100 rounded-xl outline-none text-gray-500 text-sm shadow-sm"
          value={periodeFilter}
          onChange={(e) => setPeriodeFilter(e.target.value)}
        >
          <option value="Semua Periode">Semua Periode</option>
          {uniquePeriode.map((periode, index) => (
            <option key={index} value={periode}>{periode}</option>
          ))}
        </select>
        <select
          className="px-4 py-2 bg-white border border-gray-100 rounded-xl outline-none text-gray-500 text-sm shadow-sm"
          value={kementerianFilter}
          onChange={(e) => setKementerianFilter(e.target.value)}
        >
          <option value="Semua Kementerian">Semua Kementerian</option>
          {uniqueKementerian.map((kementerian, index) => (
            <option key={index} value={kementerian}>{kementerian}</option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearchQuery('');
            setStatusFilter('Semua Status');
            setPeriodeFilter('Semua Periode');
            setKementerianFilter('Semua Kementerian');
          }}
          className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition text-sm shadow-sm w-full sm:w-auto"
        >
          Hapus Filter
        </button>
        <p className="w-full text-xs text-gray-400">
          Menampilkan {filteredProkers.length} kegiatan, {filteredKak.length} KAK/LPJ, dan {filteredAnggaran.length} anggaran sesuai filter.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Kiri (Lebar) */}
        <div className="lg:col-span-8 space-y-4">

          {/* Monitoring Pagu Anggaran */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Monitoring Pagu Anggaran</h3>
              {isPresbem && (
                isEditingPagu ? (
                  <div className="flex items-center gap-2">
                    <input type="number" className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm w-36 focus:outline-none focus:border-blue-500" value={inputPagu} onChange={e => setInputPagu(e.target.value)} placeholder="Nominal Pagu" />
                    <button onClick={handleSavePagu} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 transition">Simpan</button>
                    <button onClick={() => setIsEditingPagu(false)} className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition">Batal</button>
                  </div>
                ) : (
                  <button onClick={() => { setInputPagu(paguDariDB.toString()); setIsEditingPagu(true); }} className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold transition">Atur Pagu</button>
                )
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center justify-center py-1">
              {/* Donut Chart */}
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#F3F4F6" strokeWidth="12" />
                  {/* Progress Circle */}
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={statusPagu === 'Kritis' ? '#EF4444' : statusPagu === 'Waspada' ? '#FBBF24' : '#3B82F6'}
                    strokeWidth="12"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (persentasePagu / 100) * 251.2}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-1">
                  <span className={`text-2xl font-bold ${statusPagu === 'Kritis' ? 'text-red-500' : 'text-blue-500'}`}>
                    {persentasePagu.toFixed(0)}%
                  </span>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-1">Terpakai</span>
                </div>
              </div>

              {/* Legends / Data */}
              <div className="flex-1 space-y-4 w-full">
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusPagu === 'Kritis' ? 'bg-red-500' : 'bg-[#3B82F6]'}`}></div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase">Sisa Pagu</p>
                      <p className="text-lg font-bold text-gray-700 leading-tight">{formatRupiah(paguAnggaran.sisa)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase">Total Terpakai</p>
                      <p className="text-sm font-bold text-gray-700 leading-tight">{formatRupiah(paguAnggaran.terpakai)}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
                    <div>
                      <p className="text-[11px] text-gray-400 font-bold uppercase">Total Pagu {isBPH ? '(BEM)' : '(Kementerian)'}</p>
                      <p className="text-sm font-bold text-gray-700 leading-tight">{formatRupiah(paguAnggaran.total)}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md ${statusPagu === 'Kritis' ? 'bg-red-50 text-red-600' : statusPagu === 'Waspada' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                    {statusPagu}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabel Kegiatan Terbaru */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-800 mb-3">Kegiatan Terbaru</h3>
            {kegiatanTerbaru.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px] text-sm text-left">
                  <thead className="text-xs text-gray-400">
                    <tr>
                      <th className="py-2 font-normal">Nama Kegiatan</th>
                      <th className="py-2 font-normal">Status</th>
                      <th className="py-2 font-normal">Tanggal Input</th>
                      <th className="py-2 font-normal text-right">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kegiatanTerbaru.map((kegiatan) => (
                      <tr key={kegiatan.id} className="border-t border-gray-50">
                        <td className="py-2.5 font-medium flex items-center gap-3">
                          <span className="text-gray-400 shrink-0">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          </span>
                          <span className="truncate max-w-[150px] sm:max-w-xs">{kegiatan.nama}</span>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-medium ${getStatusStyle(kegiatan.status)}`}>
                            {kegiatan.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-gray-400 text-xs">{kegiatan.tanggal}</td>
                        <td className="py-2.5 font-bold text-right text-gray-800 text-xs">{kegiatan.waktu}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-6">
                {isFilterActive ? "Tidak ada kegiatan yang cocok dengan filter." : "Belum ada pengajuan kegiatan."}
              </p>
            )}
          </div>
        </div>

        {/* Kanan (Sempit) */}
        <div className="lg:col-span-4 space-y-4">

          {/* Statistik Performa Kementerian */}
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {/* Card 1: Total Proker */}
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center relative overflow-hidden h-24 md:h-28 transition hover:shadow-md">
              <svg className="absolute -right-3 -bottom-3 w-16 h-16 text-orange-500 opacity-[0.07] rotate-[-15deg] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
              </svg>
              <div className="flex-1 flex items-end pb-0.5 relative z-10">
                <span className="text-3xl md:text-4xl font-medium text-gray-700 leading-none">{statistik.totalProker}</span>
              </div>
              <div className="flex-1 flex items-start pt-0.5 relative z-10">
                <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight">Total Proker</span>
              </div>
            </div>

            {/* Card 2: Menunggu */}
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center relative overflow-hidden h-24 md:h-28 transition hover:shadow-md">
              <svg className="absolute -left-3 -top-3 w-16 h-16 text-yellow-500 opacity-[0.1] rotate-[15deg] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 flex items-end pb-0.5 relative z-10">
                <span className="text-3xl md:text-4xl font-medium text-gray-700 leading-none">{statistik.menunggu}</span>
              </div>
              <div className="flex-1 flex items-start pt-0.5 relative z-10">
                <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight">Menunggu</span>
              </div>
            </div>

            {/* Card 3: Selesai */}
            <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-50 flex flex-col items-center justify-center text-center relative overflow-hidden h-24 md:h-28 transition hover:shadow-md">
              <svg className="absolute -right-3 -bottom-3 w-16 h-16 text-green-500 opacity-[0.08] rotate-[-12deg] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1 flex items-end pb-0.5 relative z-10">
                <span className="text-3xl md:text-4xl font-medium text-gray-700 leading-none">{statistik.selesai}</span>
              </div>
              <div className="flex-1 flex items-start pt-0.5 relative z-10">
                <span className="text-[10px] md:text-xs font-bold text-gray-500 leading-tight">Selesai</span>
              </div>
            </div>
          </div>

          {/* Progress Kegiatan */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50">
            <h3 className="font-bold text-gray-800 mb-3 text-sm">Progres Kegiatan</h3>
            {progressKegiatan.length > 0 ? (
              <div className="space-y-3">
                {progressKegiatan.map((item) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-medium flex items-center gap-1.5 text-gray-600 truncate mr-2">
                        <span className={item.color}>
                          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </span> <span className="truncate">{item.nama}</span>
                      </span>
                      <span className="text-[11px] font-bold text-gray-600">{item.persentase}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div className={`${item.bg} h-1.5 rounded-full transition-all duration-500`} style={{ width: `${item.persentase}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center">
                {isFilterActive ? "Tidak ada progres yang cocok dengan filter." : "Belum ada proker."}
              </p>
            )}
          </div>

          {/* Pengajuan KAK/LPJ Terbaru */}
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-50 min-h-[120px] relative overflow-hidden">
            <h3 className="font-bold text-gray-800 text-[13px] relative z-10 mb-3">Approval KAK/LPJ Terbaru</h3>
            <div className="space-y-2 relative z-10">
              {approvalTerbaru.length > 0 ? approvalTerbaru.map((approval) => (
                <div key={approval.id} className="bg-gray-50 p-2 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm transition hover:shadow-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[11px] font-bold text-gray-800 truncate">{approval.nama}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold shrink-0 ${approval.tipe === 'LPJ' ? 'bg-purple-50 text-purple-600' : 'bg-orange-50 text-orange-600'}`}>
                        {approval.tipe}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 truncate">{approval.divisi}</p>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${approval.colorClass}`}>
                    {approval.status}
                  </span>
                </div>
              )) : (
                <p className="text-[11px] text-gray-500 font-medium">
                  {isFilterActive ? "Tidak ada KAK/LPJ yang cocok dengan filter." : "Belum ada history KAK/LPJ."}
                </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
