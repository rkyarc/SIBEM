<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\KasRutin;

class KasRutinReminder extends Notification
{
    use Queueable;

    protected $kasRutin;

    /**
     * Create a new notification instance.
     */
    public function __construct(KasRutin $kasRutin)
    {
        $this->kasRutin = $kasRutin;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'kas_rutin_id' => $this->kasRutin->id,
            'nama_kegiatan' => 'Pengingat Kas: ' . $this->kasRutin->nama,
            'tipe_pengajuan' => 'KAS',
            'catatan_revisi' => 'Sebesar Rp ' . number_format($this->kasRutin->nominal, 0, ',', '.') . ' sebentar lagi jatuh tempo.',
            'status' => 'revisi', // Gunakan kata kunci revisi agar Navbar bisa menangkap jika masih disatukan dengan fetch lama, tapi sebaiknya kita ubah API-nya.
        ];
    }
}
