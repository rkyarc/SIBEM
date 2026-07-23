import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBem from "../assets/logo-bem.png";
import {
  Banknote,
  Building2,
  CalendarDays,
  ClipboardList,
  FileDown,
  FileText,
  Printer,
  Search,
} from "lucide-react";

// Removed restrictive Status type because backend returns various string statuses
interface LaporanData {
  id: number;
  namaKegiatan: string;
  kementerian: string;
  tanggal: string;
  statusKak: string;
  anggaran: number;
  statusLaporan: string;
}

// Type definitions for fetched data
// Removed hardcoded laporanData and ringkasan

const formatRupiah = (nominal: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);

const formatTanggal = (tanggal: string) =>
  new Date(`${tanggal}T00:00:00`).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const getStatusStyle = (status: string) => {
  if (status === 'disetujui' || status === 'Selesai') return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
  if (status === 'verifikasi_sekjen' || status === 'Proses') return "bg-orange-50 text-orange-700 ring-orange-600/20";
  if (status === 'draft' || status === 'pending' || status === 'Belum Diajukan' || status === 'Menunggu') return "bg-amber-50 text-amber-700 ring-amber-600/20";
  if (status === 'ditolak' || status === 'Ditolak') return "bg-red-50 text-red-700 ring-red-600/20";

  return "bg-gray-50 text-gray-700 ring-gray-600/20";
};

const getStatusDot = (status: string) => {
  if (status === 'disetujui' || status === 'Selesai') return "bg-emerald-500";
  if (status === 'verifikasi_sekjen' || status === 'Proses') return "bg-orange-500";
  if (status === 'draft' || status === 'pending' || status === 'Belum Diajukan' || status === 'Menunggu') return "bg-amber-500";
  if (status === 'ditolak' || status === 'Ditolak') return "bg-red-500";

  return "bg-gray-500";
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyle(
        status,
      )}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${getStatusDot(status)}`}
      />
      {status}
    </span>
  );
}

export default function Laporan() {
  const [dataLaporan, setDataLaporan] = useState<LaporanData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for filters
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // States for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLaporan();
  }, []);

  const fetchLaporan = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("https://sibem-a3fflil93-rkyarcs-projects.vercel.app/api/laporan", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDataLaporan(res.data.laporanData || []);
    } catch (err) {
      console.error("Failed to fetch laporan:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAnggaranNumber = dataLaporan.reduce((acc, curr) => acc + curr.anggaran, 0);
  const kementerianUnik = new Set(dataLaporan.map(item => item.kementerian)).size;
  const pengajuanKakCount = dataLaporan.filter(item => item.statusKak !== 'Belum Diajukan').length;

  const ringkasan = {
    totalKegiatan: dataLaporan.length,
    pengajuanKak: pengajuanKakCount,
    totalAnggaran: formatRupiah(totalAnggaranNumber),
    jumlahKementerian: kementerianUnik,
  };

  // 1. Filter Data
  const filteredData = dataLaporan.filter((item) => {
    // a. Filter Search (Keyword)
    const keywordMatch =
      item.namaKegiatan.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.kementerian.toLowerCase().includes(searchKeyword.toLowerCase());

    // b. Filter Month
    let monthMatch = true;
    if (selectedMonth !== "") {
      if (item.tanggal) {
        // extract month from 'YYYY-MM-DD'
        const monthPart = item.tanggal.split('-')[1]; // '01', '02', etc
        monthMatch = monthPart === selectedMonth;
      } else {
        monthMatch = false; // if no date, it doesn't match a specific month
      }
    }

    // c. Filter Status Laporan
    let statusMatch = true;
    if (selectedStatus !== "") {
      statusMatch = item.statusLaporan.toLowerCase() === selectedStatus.toLowerCase();
    }

    return keywordMatch && monthMatch && statusMatch;
  });

  // 2. Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1;
  // Ensure current page is within valid range after filter changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredData.length, totalPages, currentPage]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    img.src = logoBem;

    // We process PDF generation after the logo image is loaded
    img.onload = () => {
      // Header PDF (Kop Surat)
      doc.addImage(img, "PNG", 14, 10, 22, 22);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("BADAN EKSEKUTIF MAHASISWA", 115, 16, { align: "center" });
      doc.setFontSize(13);
      doc.text("UNIVERSITAS INTERNASIONAL SEMEN INDONESIA", 115, 22, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Sekretariat: Gedung Pusat Kegiatan Mahasiswa (PKM) Lt. 2", 115, 27, { align: "center" });
      doc.text("Email: bem@kampus.ac.id | Website: www.bem.kampus.ac.id", 115, 32, { align: "center" });

      // Garis Pemisah (Divider)
      doc.setLineWidth(0.5);
      doc.line(14, 35, 196, 35);

      // Judul Laporan
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("LAPORAN DATA PROKER DAN ANGGARAN SIBEM", 105, 45, { align: "center" });

      // Info Tambahan
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Dicetak pada : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 53);

      // Data Tabel PDF
      const tableData = filteredData.map((item, index) => [
        index + 1,
        item.namaKegiatan,
        item.kementerian,
        item.tanggal ? formatTanggal(item.tanggal) : '-',
        item.statusKak,
        formatRupiah(item.anggaran),
        item.statusLaporan
      ]);

      autoTable(doc, {
        startY: 57,
        head: [['No', 'Kegiatan', 'Kementerian', 'Tanggal', 'Status KAK', 'Anggaran', 'Status LPJ']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' }, // bg-orange-600
        alternateRowStyles: { fillColor: [249, 250, 251] }, // bg-gray-50
      });

      doc.save("Laporan_Resmi_SIBEM.pdf");
    };

    // Fallback if image fails to load
    img.onerror = () => {
      // Sama seperti onload namun tanpa logo
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("BADAN EKSEKUTIF MAHASISWA", 105, 16, { align: "center" });
      doc.setFontSize(13);
      doc.text("UNIVERSITAS INTERNASIONAL SEMEN INDONESIA", 105, 22, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Sekretariat: Gedung Pusat Kegiatan Mahasiswa (PKM) Lt. 2", 105, 27, { align: "center" });
      doc.text("Email: bem@kampus.ac.id | Website: www.bem.kampus.ac.id", 105, 32, { align: "center" });

      doc.setLineWidth(0.5);
      doc.line(14, 35, 196, 35);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("LAPORAN DATA PROKER DAN ANGGARAN SIBEM", 105, 45, { align: "center" });

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Dicetak pada : ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 14, 53);

      const tableData = filteredData.map((item, index) => [
        index + 1, item.namaKegiatan, item.kementerian, item.tanggal ? formatTanggal(item.tanggal) : '-', item.statusKak, formatRupiah(item.anggaran), item.statusLaporan
      ]);

      autoTable(doc, {
        startY: 57,
        head: [['No', 'Kegiatan', 'Kementerian', 'Tanggal', 'Status KAK', 'Anggaran', 'Status LPJ']],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [234, 88, 12], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
      });

      doc.save("Laporan_Resmi_SIBEM.pdf");
    };
  };

  const ringkasanCards = [
    {
      label: "Total Kegiatan",
      value: ringkasan.totalKegiatan,
      note: "Seluruh kegiatan",
      icon: ClipboardList,
      iconStyle: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pengajuan KAK",
      value: ringkasan.pengajuanKak,
      note: "KAK telah diajukan",
      icon: FileText,
      iconStyle: "bg-orange-50 text-orange-600",
    },
    {
      label: "Total Anggaran",
      value: ringkasan.totalAnggaran,
      note: "Akumulasi anggaran",
      icon: Banknote,
      iconStyle: "bg-orange-50 text-orange-600",
    },
    {
      label: "Jumlah Kementerian",
      value: ringkasan.jumlahKementerian,
      note: "Kementerian terdaftar",
      icon: Building2,
      iconStyle: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <>
      {/* TAMPILAN APLIKASI (Disembunyikan saat fitur cetak dipanggil) */}
      <div className="space-y-4 print:hidden">
        {/* Judul dan tombol aksi */}
        <div className="flex justify-end items-center mb-6">
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 sm:w-auto"
            >
              <Printer size={16} />
              Cetak Laporan
            </button>

            <button
              type="button"
              onClick={handleExportPDF}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-700 sm:w-auto"
            >
              <FileDown size={16} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Ringkasan */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ringkasanCards.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-gray-800">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">{item.note}</p>
                  </div>

                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconStyle}`}
                  >
                    <Icon size={21} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        {/* Filter */}
        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-[220px_240px_1fr]">
            <div className="relative">
              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <select
                aria-label="Pilih periode laporan"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full appearance-none rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="">Semua Periode</option>
                <option value="01">Januari 2026</option>
                <option value="02">Februari 2026</option>
                <option value="03">Maret 2026</option>
                <option value="04">April 2026</option>
                <option value="05">Mei 2026</option>
                <option value="06">Juni 2026</option>
                <option value="07">Juli 2026</option>
                <option value="08">Agustus 2026</option>
                <option value="09">September 2026</option>
                <option value="10">Oktober 2026</option>
                <option value="11">November 2026</option>
                <option value="12">Desember 2026</option>
              </select>
            </div>

            <select
              aria-label="Pilih status laporan"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Semua Status</option>
              <option value="Belum Diajukan">Belum Diajukan</option>
              <option value="pending">Pending</option>
              <option value="verifikasi_sekjen">Verifikasi Sekjen</option>
              <option value="disetujui">Disetujui</option>
              <option value="ditolak">Ditolak</option>
            </select>

            <div className="relative md:col-span-2 xl:col-span-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="search"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Cari kegiatan atau kementerian..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </section>

        {/* Tabel laporan */}
        <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-1 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-gray-800">Daftar Laporan Kegiatan</h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Menampilkan {filteredData.length} data laporan
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-400 sm:mt-0">
              Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="border-b border-gray-100 bg-gray-50/80">
                <tr>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    No
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Kegiatan
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Tanggal
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status KAK
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Anggaran
                  </th>
                  <th className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Status Laporan
                  </th>
                  <th className="px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                      Memuat data laporan...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <p className="font-medium text-gray-600">Tidak ada data laporan yang cocok dengan filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentData.map((laporan, index) => (
                    <tr
                      key={laporan.id}
                      className="border-b border-gray-50 transition hover:bg-orange-50/30 last:border-0"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-500">
                        {startIndex + index + 1}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-gray-800">
                          {laporan.namaKegiatan}
                        </p>
                        <p className="text-xs text-gray-500">
                          {laporan.kementerian}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {laporan.tanggal ? formatTanggal(laporan.tanggal) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={laporan.statusKak} />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-700">
                        {formatRupiah(laporan.anggaran)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={laporan.statusLaporan} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button className="text-orange-600 hover:text-orange-700 text-xs font-medium">Detail</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400">
              Menampilkan {currentData.length > 0 ? startIndex + 1 : 0} hingga {startIndex + currentData.length} dari {filteredData.length} entri
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-xs font-semibold text-white">
                {currentPage}
              </span>
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:text-gray-400 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* TEMPLATE KHUSUS CETAK LAPORAN (Hanya terlihat saat print) */}
      <style>{`
        @media print {
          @page {
            margin: 0mm; /* Sembunyikan header/footer bawaan browser */
          }
        }
      `}</style>
      <div className="hidden print:block w-full text-black bg-white print:p-[2cm]">

        {/* KOP SURAT */}
        <div className="border-b-[3px] border-black pb-4 mb-4 flex items-center justify-between">
          <div className="w-24 flex justify-center">
            <img src={logoBem} alt="Logo BEM" className="w-20 h-auto object-contain" />
          </div>
          <div className="flex-1 text-center px-2">
            <h1 className="text-xl font-bold uppercase tracking-wide leading-tight">Badan Eksekutif Mahasiswa</h1>
            <h2 className="text-2xl font-extrabold uppercase leading-tight">Universitas Internasional Semen Indonesia</h2>
            <p className="text-sm mt-1 font-medium leading-tight">Sekretariat: Gedung Pusat Kegiatan Mahasiswa (PKM) Lt. 2</p>
            <p className="text-sm leading-tight">Email: bem@kampus.ac.id | Website: www.bem.kampus.ac.id</p>
          </div>
          <div className="w-24">
            {/* Spasi untuk menyeimbangkan flexbox */}
          </div>
        </div>

        <div className="text-center mb-6">
          <h3 className="text-lg font-bold uppercase underline underline-offset-4">Laporan Data Proker dan Anggaran</h3>
        </div>

        <div className="flex justify-end mb-4 text-sm font-medium">
          <p>Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        <table className="w-full border-collapse border border-black text-sm text-left">
          <thead>
            <tr>
              <th className="border border-black px-2 py-1 bg-gray-100">No</th>
              <th className="border border-black px-2 py-1 bg-gray-100">Kegiatan</th>
              <th className="border border-black px-2 py-1 bg-gray-100">Kementerian</th>
              <th className="border border-black px-2 py-1 bg-gray-100">Tanggal</th>
              <th className="border border-black px-2 py-1 bg-gray-100">Status KAK</th>
              <th className="border border-black px-2 py-1 bg-gray-100">Anggaran</th>
              <th className="border border-black px-2 py-1 bg-gray-100">Status LPJ</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="border border-black px-2 py-4 text-center">Tidak ada data untuk kriteria tersebut.</td>
              </tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id}>
                  <td className="border border-black px-2 py-1">{index + 1}</td>
                  <td className="border border-black px-2 py-1">{item.namaKegiatan}</td>
                  <td className="border border-black px-2 py-1">{item.kementerian}</td>
                  <td className="border border-black px-2 py-1">{item.tanggal ? formatTanggal(item.tanggal) : '-'}</td>
                  <td className="border border-black px-2 py-1">{item.statusKak}</td>
                  <td className="border border-black px-2 py-1">{formatRupiah(item.anggaran)}</td>
                  <td className="border border-black px-2 py-1">{item.statusLaporan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
