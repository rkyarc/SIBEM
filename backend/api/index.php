<?php

// Vercel entry point for Laravel
// Vercel's filesystem is read-only, so we redirect storage to /tmp

// Create necessary directories in /tmp
$storagePath = '/tmp/storage';
$dirs = [
    $storagePath,
    $storagePath . '/app',
    $storagePath . '/app/public',
    $storagePath . '/framework',
    $storagePath . '/framework/cache',
    $storagePath . '/framework/cache/data',
    $storagePath . '/framework/sessions',
    $storagePath . '/framework/views',
    $storagePath . '/logs',
    '/tmp/bootstrap/cache',
];

foreach ($dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

// Set environment variables to use /tmp paths
$_ENV['APP_STORAGE_PATH'] = $storagePath;
putenv("APP_STORAGE_PATH=$storagePath");

// Set view compiled path
$_ENV['VIEW_COMPILED_PATH'] = $storagePath . '/framework/views';
putenv("VIEW_COMPILED_PATH=" . $storagePath . '/framework/views');

// Bootstrap Laravel
require __DIR__ . '/../public/index.php';
