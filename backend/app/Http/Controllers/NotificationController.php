<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get all unread notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->unreadNotifications->map(function ($notification) {
            // Kita memformat data notifikasi agar mirip dengan struktur KAK revisions di Frontend
            $data = $notification->data;
            return [
                'id' => $notification->id,
                'kas_rutin_id' => $data['kas_rutin_id'] ?? null,
                'nama_kegiatan' => $data['nama_kegiatan'] ?? 'Pengingat',
                'tipe_pengajuan' => $data['tipe_pengajuan'] ?? 'NOTIF',
                'catatan_revisi' => $data['catatan_revisi'] ?? '',
                'status' => $data['status'] ?? 'revisi',
                'is_notification' => true, // Flag khusus untuk membedakan dengan KAK
            ];
        });

        return response()->json($notifications);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->where('id', $id)->first();
        if ($notification) {
            $notification->markAsRead();
        }

        return response()->json(['message' => 'Notifikasi ditandai sebagai telah dibaca.']);
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json(['message' => 'Semua notifikasi ditandai sebagai telah dibaca.']);
    }
}
