<?php
require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
print_r($app->storagePath());
