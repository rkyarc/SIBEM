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

try {
    foreach ($dirs as $dir) {
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
    }
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['error' => 'mkdir failed', 'message' => $e->getMessage()]);
    exit;
}

try {
    // Set environment variables for cache paths BEFORE booting Laravel
    $cachePath = '/tmp/bootstrap/cache';
    putenv("APP_SERVICES_CACHE={$cachePath}/services.php");
    putenv("APP_PACKAGES_CACHE={$cachePath}/packages.php");
    $_ENV['APP_SERVICES_CACHE'] = "{$cachePath}/services.php";
    $_ENV['APP_PACKAGES_CACHE'] = "{$cachePath}/packages.php";
    $_SERVER['APP_SERVICES_CACHE'] = "{$cachePath}/services.php";
    $_SERVER['APP_PACKAGES_CACHE'] = "{$cachePath}/packages.php";

    // Fix Laravel route matching by preventing it from using /api as base URL
    $_SERVER['SCRIPT_NAME'] = '/index.php';
    $_SERVER['PHP_SELF'] = '/index.php';

    if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'debug-server') !== false) {
        echo json_encode($_SERVER);
        exit;
    }

    // Register the Composer autoloader...
    require __DIR__ . '/../vendor/autoload.php';

    // Bootstrap Laravel...
    /** @var \Illuminate\Foundation\Application $app */
    $app = require_once __DIR__ . '/../bootstrap/app.php';

    // Override storage path to /tmp BEFORE handling the request
    $app->useStoragePath($storagePath);
    
    // Override Cache path if method exists
    if (method_exists($app, 'useBootstrapCachePath')) {
        $app->useBootstrapCachePath('/tmp/bootstrap/cache');
        
        // Copy existing cache files so providers are loaded correctly
        foreach (['packages.php', 'services.php'] as $file) {
            $source = __DIR__ . '/../bootstrap/cache/' . $file;
            $dest = '/tmp/bootstrap/cache/' . $file;
            if (file_exists($source) && !file_exists($dest)) {
                copy($source, $dest);
            }
        }
    }

    // Handle the request
    $app->handleRequest(Request::capture());
} catch (\Throwable $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Laravel Boot Failed',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'previous' => $e->getPrevious() ? $e->getPrevious()->getMessage() . ' in ' . $e->getPrevious()->getFile() . ':' . $e->getPrevious()->getLine() : null,
        'trace' => $e->getTraceAsString()
    ]);
    exit;
}
