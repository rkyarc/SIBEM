<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class RemindKasRutin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:remind-kas-rutin {--force : Abaikan pengecekan tanggal untuk testing}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = \Carbon\Carbon::now();
        $this->info("Menjalankan pengecekan Kas Rutin untuk tanggal: " . $today->toDateString());

        $kasRutins = \App\Models\KasRutin::all();

        foreach ($kasRutins as $kas) {
            $shouldRemind = false;

            if ($kas->periode === 'mingguan' && $kas->hari_mingguan) {
                // Mingguan: H-3
                // Carbon dayOfWeekIso: 1 (Senin) - 7 (Minggu)
                $targetDay = $kas->hari_mingguan;
                $reminderDay = $targetDay - 3;
                if ($reminderDay <= 0) $reminderDay += 7;
                
                if ($today->dayOfWeekIso == $reminderDay) {
                    $shouldRemind = true;
                }
            } elseif ($kas->periode === 'bulanan' && $kas->tanggal_bulanan) {
                // Bulanan: H-7
                // Kita gunakan objek tanggal target di bulan ini
                $targetDate = $today->copy()->setDay($kas->tanggal_bulanan);
                $reminderDate = $targetDate->copy()->subDays(7);

                if ($today->isSameDay($reminderDate)) {
                    $shouldRemind = true;
                }
            } elseif ($kas->periode === 'tahunan' && $kas->bulan_tahunan && $kas->tanggal_tahunan) {
                // Tahunan: H-1 Bulan
                $targetDate = $today->copy()->setMonth($kas->bulan_tahunan)->setDay($kas->tanggal_tahunan);
                $reminderDate = $targetDate->copy()->subMonth();

                if ($today->isSameDay($reminderDate)) {
                    $shouldRemind = true;
                }
            }

            if ($shouldRemind || $this->option('force')) {
                if ($kas->tingkatan === 'Kementerian') {
                    $users = \App\Models\User::where('role', $kas->kementerian)->get();
                } else {
                    $users = \App\Models\User::where('role', '!=', 'Admin')->get();
                }
                
                if ($users->count() > 0) {
                    \Illuminate\Support\Facades\Notification::send($users, new \App\Notifications\KasRutinReminder($kas));
                    $pesan = "PENGINGAT KAS: [{$kas->nama}] sebesar Rp " . number_format($kas->nominal, 0, ',', '.') . " sebentar lagi jatuh tempo. Notifikasi telah dikirim ke " . $users->count() . " pengguna.";
                    \Illuminate\Support\Facades\Log::info($pesan);
                    $this->info($pesan);
                }
            }
        }
    }
}
