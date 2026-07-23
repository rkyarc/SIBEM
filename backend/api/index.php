<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// ============================================================
// VERCEL FIX: Filesystem Vercel bersifat read-only.
// Kita harus membuat folder storage di /tmp sebelum Laravel boot.
// ============================================================
$storagePath = '/tmp/storage';

$dirs = [
    $storagePath . '/app/public',
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

// Register the Composer autoloader...
require __DIR__ . '/../vendor/autoload.php';

// Bootstrap Laravel...
/** @var \Illuminate\Foundation\Application $app */
$app = require_once __DIR__ . '/../bootstrap/app.php';

// Override storage path to /tmp BEFORE handling the request
$app->useStoragePath($storagePath);

// Handle the request
$app->handleRequest(Request::capture());
